"""Load intraday bars (TradingView CSV exports or any OHLCV CSV) into RTH 5-minute frames.

Expected input: one CSV per symbol, named <SYMBOL>.csv (e.g. AAPL.csv, SPY.csv), with columns
time, open, high, low, close, volume (case-insensitive; TradingView's "Volume" is fine).
`time` may be UNIX seconds (TradingView default) or ISO-8601 with offset. Bar time = bar OPEN time.
Extended-hours bars are dropped; only 09:30-16:00 New York bars are kept.
"""
from __future__ import annotations

import glob
import os

import numpy as np
import pandas as pd

NY = "America/New_York"


def _parse_time(col: pd.Series) -> pd.DatetimeIndex:
    if np.issubdtype(col.dtype, np.number):
        unit = "ms" if col.iloc[0] > 1e11 else "s"
        t = pd.to_datetime(col, unit=unit, utc=True)
    else:
        t = pd.to_datetime(col, utc=True)
    return pd.DatetimeIndex(t).tz_convert(NY)


def load_csv(path: str, bar_minutes: int = 5) -> pd.DataFrame:
    raw = pd.read_csv(path)
    raw.columns = [c.strip().lower() for c in raw.columns]
    need = ["time", "open", "high", "low", "close", "volume"]
    missing = [c for c in need if c not in raw.columns]
    if missing:
        raise ValueError(f"{path}: missing columns {missing}; got {list(raw.columns)}")
    df = raw[need].copy()
    df.index = _parse_time(df.pop("time"))
    df = df[~df.index.duplicated()].sort_index()
    df = df.dropna(subset=["open", "high", "low", "close"])
    df["volume"] = df["volume"].fillna(0.0)
    mins = df.index.hour * 60 + df.index.minute
    df = df[(mins >= 9 * 60 + 30) & (mins < 16 * 60)]
    if bar_minutes != _infer_step(df):
        df = resample(df, bar_minutes)
    return df


def _infer_step(df: pd.DataFrame) -> int:
    d = pd.Series(df.index).diff().dropna().dt.total_seconds() / 60
    return int(d.mode().iloc[0]) if len(d) else 0


def resample(df: pd.DataFrame, minutes: int) -> pd.DataFrame:
    if _infer_step(df) > minutes:
        raise ValueError(f"data is coarser than {minutes}-minute bars; cannot test 5-minute rules")
    agg = {"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"}
    out = df.resample(f"{minutes}min", origin="start_day", offset="30min").agg(agg)
    return out.dropna(subset=["open"])


def load_dir(folder: str) -> dict[str, pd.DataFrame]:
    out = {}
    for p in sorted(glob.glob(os.path.join(folder, "*.csv"))):
        sym = os.path.splitext(os.path.basename(p))[0].upper().split(",")[0].split("_")[-1]
        out[sym] = load_csv(p)
    return out


def complete_days(df: pd.DataFrame, bar_minutes: int = 5) -> pd.DataFrame:
    """Drop half-days and days with missing bars (need at least the 09:30-12:30 bars and a close)."""
    per_day = df.groupby(df.index.date).size()
    full = 390 // bar_minutes
    keep = per_day[per_day >= int(full * 0.9)].index
    return df[np.isin(df.index.date, keep)]

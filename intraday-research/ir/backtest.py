"""Per-day features, a conservative bar-by-bar trade simulator, costs, and metrics.

Conventions (5-minute RTH bars, bar k opens at 09:30 + 5k minutes):
  * Only information from completed bars is used to make a decision.
  * Stop-entry orders fill at max(trigger, bar open) for longs (min for shorts).
  * If a bar touches both stop and target, the STOP is assumed to fill first.
  * On a stop-entry bar, only the stop is checked (a target in the same bar is ignored).
  * Targets are limit orders: they need price to trade 1 tick THROUGH the level.
  * Positions not stopped or targeted exit at the 16:00 close (MOC).
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

TICK = 0.01
LAST_ENTRY_BAR = 29  # bar opening 11:55; every fill happens before 12:00
MIN_RISK_PCT = 0.0015  # skip stops tighter than 0.15% of price (costs would dominate)
MAX_RISK_PCT = 0.03


@dataclass(frozen=True)
class Costs:
    commission_ps: float = 0.0035  # per share per side
    half_spread: float = 0.005  # mega-cap stocks/ETFs normally quote a 1-cent spread
    slip_entry_stop_bp: float = 1.0
    slip_entry_open_bp: float = 0.5
    slip_exit_stop_bp: float = 2.0
    slip_exit_moc_bp: float = 1.0
    mult: float = 1.0  # stress multiplier

    def per_share(self, price: float, entry_kind: str, exit_kind: str) -> float:
        bp = price * 1e-4
        c = 2 * self.commission_ps + self.half_spread  # entry always crosses the spread
        c += bp * (self.slip_entry_stop_bp if entry_kind == "stop" else self.slip_entry_open_bp)
        if exit_kind == "stop":
            c += self.half_spread + bp * self.slip_exit_stop_bp
        elif exit_kind == "eod":
            c += bp * self.slip_exit_moc_bp
        # exit_kind == "target": passive limit, no spread or slippage
        return c * self.mult


# ---------------------------------------------------------------- features
@dataclass
class Day:
    sym: str
    date: object
    o: np.ndarray
    h: np.ndarray
    l: np.ndarray
    c: np.ndarray
    v: np.ndarray
    vwap: np.ndarray
    f: dict  # scalar features known at the open (previous-day stats, gap, ...)


def build_days(sym: str, df: pd.DataFrame) -> list[Day]:
    dates = np.array(df.index.date)
    uniq = pd.unique(dates)
    daily = df.groupby(dates).agg(open=("open", "first"), high=("high", "max"),
                                  low=("low", "min"), close=("close", "last"),
                                  volume=("volume", "sum"))
    prev_c = daily["close"].shift(1)
    tr = pd.concat([daily["high"] - daily["low"], (daily["high"] - prev_c).abs(),
                    (daily["low"] - prev_c).abs()], axis=1).max(axis=1)
    atr14 = tr.rolling(14).mean().shift(1)
    rng = daily["high"] - daily["low"]
    nr7 = (rng == rng.rolling(7).min()).shift(1)
    dollar_vol20 = (daily["close"] * daily["volume"]).rolling(20).median().shift(1)
    sma20 = daily["close"].rolling(20).mean().shift(1)
    or_vol = df.groupby(dates)["volume"].apply(lambda s: s.iloc[:3].sum())
    or_vol_avg = or_vol.rolling(14).mean().shift(1)

    out = []
    for d in uniq:
        g = df[dates == d]
        if len(g) < LAST_ENTRY_BAR + 2 or pd.isna(atr14.get(d)) or pd.isna(or_vol_avg.get(d)):
            continue
        o, h, l, c, v = (g[k].to_numpy(float) for k in ("open", "high", "low", "close", "volume"))
        tp = (h + l + c) / 3
        cv = np.cumsum(v)
        vwap = np.where(cv > 0, np.cumsum(tp * v) / np.maximum(cv, 1e-9), tp)
        i = daily.index.get_loc(d)
        f = dict(prev_close=prev_c.iloc[i], pdh=daily["high"].iloc[i - 1],
                 pdl=daily["low"].iloc[i - 1], atr14=atr14.iloc[i],
                 gap=o[0] / prev_c.iloc[i] - 1, rvol15=v[:3].sum() / max(or_vol_avg.iloc[i], 1),
                 nr7=bool(nr7.iloc[i]) if not pd.isna(nr7.iloc[i]) else False,
                 dollar_vol20=dollar_vol20.iloc[i],
                 above_sma20=bool(prev_c.iloc[i] > sma20.iloc[i]) if not pd.isna(sma20.iloc[i]) else None)
        f["atr_pct"] = f["atr14"] / prev_c.iloc[i]
        out.append(Day(sym, d, o, h, l, c, v, vwap, f))
    return out


# ---------------------------------------------------------------- simulator
@dataclass
class Signal:
    day: Day
    side: int  # +1 long, -1 short
    i_fill: int  # bar index in which the entry fills
    fill: float  # raw fill price (before costs)
    stop: float
    entry_kind: str  # "stop" (intrabar trigger) or "open" (market at bar open)
    tag: str = ""


def stop_entry(day: Day, side: int, level: float, i0: int, i1: int, cancel: float | None):
    """First bar in [i0, i1] that trades through `level`; cancelled if `cancel` trades first."""
    for j in range(i0, min(i1, len(day.o) - 1) + 1):
        # Check the trigger first: if one bar touches both the trigger and the cancel/stop level,
        # we assume the worst case (filled, then stopped in the same bar) - simulate() books it
        # as a loss. Treating it as "cancelled" would silently drop losing trades.
        if side > 0 and day.h[j] >= level:
            return j, max(level, day.o[j])
        if side < 0 and day.l[j] <= level:
            return j, min(level, day.o[j])
        if cancel is not None and ((side > 0 and day.l[j] <= cancel) or (side < 0 and day.h[j] >= cancel)):
            return None
    return None


def simulate(sig: Signal, exit_mode: str, costs: Costs, target_r: float = 2.0) -> dict | None:
    d, s = sig.day, sig.side
    risk = (sig.fill - sig.stop) * s
    if risk <= 0 or not (MIN_RISK_PCT <= risk / sig.fill <= MAX_RISK_PCT):
        return None
    target = sig.fill + s * target_r * risk if exit_mode in ("T2", "T2BE") else None
    stop = sig.stop
    ambiguous = False
    exit_px, exit_kind = None, None
    n = len(d.o)
    for j in range(sig.i_fill, n):
        if j == sig.i_fill and sig.entry_kind == "stop":
            if (s > 0 and d.l[j] <= stop) or (s < 0 and d.h[j] >= stop):
                ambiguous = True
                exit_px, exit_kind = stop, "stop"
                break
            fav = sig.fill  # trigger-bar extremes may precede the fill; don't use them
        else:
            # gaps through a level at the bar open
            if (s > 0 and d.o[j] <= stop) or (s < 0 and d.o[j] >= stop):
                exit_px, exit_kind = d.o[j], "stop"
                break
            if target is not None and ((s > 0 and d.o[j] >= target) or (s < 0 and d.o[j] <= target)):
                exit_px, exit_kind = d.o[j], "target"
                break
            hit_stop = (s > 0 and d.l[j] <= stop) or (s < 0 and d.h[j] >= stop)
            hit_tgt = target is not None and ((s > 0 and d.h[j] >= target + TICK) or
                                              (s < 0 and d.l[j] <= target - TICK))
            if hit_stop:
                ambiguous = ambiguous or hit_tgt
                exit_px, exit_kind = stop, "stop"
                break
            if hit_tgt:
                exit_px, exit_kind = target, "target"
                break
            fav = d.h[j] if s > 0 else d.l[j]
        if exit_mode == "T2BE" and (fav - sig.fill) * s >= risk:
            stop = sig.fill  # breakeven, effective from the next bar
    if exit_px is None:
        exit_px, exit_kind = d.c[-1], "eod"

    gross = (exit_px - sig.fill) * s
    cost = costs.per_share(sig.fill, sig.entry_kind, exit_kind)
    return dict(sym=d.sym, date=d.date, side=s, tag=sig.tag, entry_bar=sig.i_fill,
                fill=sig.fill, stop=sig.stop, risk=risk, risk_pct=risk / sig.fill,
                exit_kind=exit_kind, R_gross=gross / risk, R=(gross - cost) / risk,
                cost_R=cost / risk, ambiguous=ambiguous, reach2R=reached(sig, risk, 2.0),
                **{f"f_{k}": v for k, v in d.f.items()})


def reached(sig: Signal, risk: float, mult: float) -> bool:
    """Did price trade to fill + mult*R before the ORIGINAL stop was hit (stop first on ties)?"""
    d, s = sig.day, sig.side
    lvl = sig.fill + s * mult * risk
    for j in range(sig.i_fill, len(d.o)):
        if (s > 0 and d.l[j] <= sig.stop) or (s < 0 and d.h[j] >= sig.stop):
            return False
        if j == sig.i_fill and sig.entry_kind == "stop":
            continue  # the high/low of the trigger bar may precede the fill
        if (s > 0 and d.h[j] >= lvl) or (s < 0 and d.l[j] <= lvl):
            return True
    return False


# ---------------------------------------------------------------- metrics
def summarize(t: pd.DataFrame) -> dict:
    if t is None or len(t) == 0:
        return dict(n=0)
    r = t["R"].to_numpy()
    wins, losses = r[r > 0], r[r <= 0]
    eq = np.cumsum(r)
    dd = float(np.max(np.maximum.accumulate(eq) - eq)) if len(eq) else 0.0
    sd = r.std(ddof=1) if len(r) > 1 else np.nan
    return dict(
        n=len(r), exp_R=r.mean(), t=(r.mean() / (sd / np.sqrt(len(r)))) if sd and sd > 0 else np.nan,
        win_rate=len(wins) / len(r), avg_win=wins.mean() if len(wins) else 0.0,
        avg_loss=losses.mean() if len(losses) else 0.0,
        payoff=(wins.mean() / -losses.mean()) if len(wins) and len(losses) and losses.mean() < 0 else np.nan,
        pf=(wins.sum() / -losses.sum()) if len(losses) and losses.sum() < 0 else np.nan,
        reach2R=t["reach2R"].mean(), took2R=(t["exit_kind"] == "target").mean(),
        stop_rate=(t["exit_kind"] == "stop").mean(), eod_rate=(t["exit_kind"] == "eod").mean(),
        cost_R=t["cost_R"].mean(), ambiguous=t["ambiguous"].mean(), maxDD_R=dd,
        days=t["date"].nunique(), symbols=t["sym"].nunique(),
    )


def bootstrap_p(r: np.ndarray, n_boot: int = 20000, seed: int = 7) -> float:
    """One-sided bootstrap p-value for mean(R) <= 0, resampling by day blocks is done by caller."""
    if len(r) < 5:
        return np.nan
    rng = np.random.default_rng(seed)
    m = rng.choice(r, size=(n_boot, len(r)), replace=True).mean(axis=1)
    return float((m <= 0).mean())


def day_block_bootstrap_p(t: pd.DataFrame, n_boot: int = 20000, seed: int = 7) -> float:
    """Trades on the same day are correlated (one market); resample whole days."""
    if len(t) < 5:
        return np.nan
    by_day = t.groupby("date")["R"].agg(["sum", "count"])
    s, c = by_day["sum"].to_numpy(), by_day["count"].to_numpy()
    rng = np.random.default_rng(seed)
    idx = rng.integers(0, len(s), size=(n_boot, len(s)))
    m = s[idx].sum(axis=1) / c[idx].sum(axis=1)
    return float((m <= 0).mean())

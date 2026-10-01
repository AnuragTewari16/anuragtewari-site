"""Synthetic 5-minute RTH bars in TradingView CSV format, for testing the engine only.

  python make_synthetic.py OUT_DIR [--edge]

Without --edge prices are a random walk (with a common market factor, U-shaped intraday
volatility/volume, and overnight gaps): every rule should lose roughly its costs.
With --edge, days with high opening volume get a drift in the direction of the first 15 minutes,
which H1 should detect - a check that the pipeline can find a real effect.
"""
import os
import sys

import numpy as np
import pandas as pd

SYMS = ["SPY", "QQQ", "AAPL", "MSFT", "NVDA", "AMZN", "META", "GOOGL", "TSLA", "AVGO",
        "AMD", "NFLX", "PLTR", "ORCL", "MU", "JPM", "LLY", "XOM", "WMT", "COST"]


def main(out, edge, n_days=320, seed=1):
    rng = np.random.default_rng(seed)
    os.makedirs(out, exist_ok=True)
    dates = pd.bdate_range("2024-01-02", periods=n_days)
    k = np.arange(78)
    ushape = 1.6 - 1.2 * np.sin(np.pi * k / 77)  # high at open/close
    mkt = rng.normal(0, 0.0011, (n_days, 78)) * ushape
    mkt_gap = rng.normal(0, 0.005, n_days)
    for s in SYMS:
        beta, idio = rng.uniform(0.8, 1.6), rng.uniform(0.0008, 0.0025)
        p = rng.uniform(50, 800)
        rows = []
        for di, d in enumerate(dates):
            p *= np.exp(beta * mkt_gap[di] + rng.normal(0, 0.008 if s not in ("SPY", "QQQ") else 0.0))
            rvol = rng.lognormal(0, 0.5)
            r = beta * mkt[di] + rng.normal(0, idio, 78) * ushape
            if edge and rvol > 1.8:
                direction = np.sign(r[:3].sum()) or 1
                r[3:40] += direction * 0.0009
            px = p * np.exp(np.cumsum(r))
            opens = np.r_[p, px[:-1]]
            noise = np.abs(rng.normal(0, idio * 0.6, 78)) * px
            highs = np.maximum(opens, px) + noise
            lows = np.minimum(opens, px) - np.abs(rng.normal(0, idio * 0.6, 78)) * px
            vol = (1e5 * ushape * rng.lognormal(0, 0.3, 78)).astype(int)
            vol[:3] = (vol[:3] * rvol).astype(int)
            t0 = pd.Timestamp(f"{d.date()} 09:30", tz="America/New_York")
            for i in range(78):
                ts = int((t0 + pd.Timedelta(minutes=5 * i)).tz_convert("UTC").timestamp())
                rows.append((ts, round(opens[i], 2), round(highs[i], 2), round(lows[i], 2),
                             round(px[i], 2), vol[i]))
            p = px[-1]
        pd.DataFrame(rows, columns=["time", "open", "high", "low", "close", "Volume"]).to_csv(
            os.path.join(out, f"BATS_{s}, 5.csv"), index=False)


if __name__ == "__main__":
    main(sys.argv[1], "--edge" in sys.argv)

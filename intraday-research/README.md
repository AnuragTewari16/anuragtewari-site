# Intraday research: pre-registered protocol (09:30–12:00 ET entries)

Status (2026-10-01): **protocol frozen, engine validated on synthetic data, no market data tested yet.**
Nothing in this folder touches any trading system, chart, alert or broker account. It never places orders.

## Why no results yet
This cloud session cannot reach any market-data host: TradingView, Yahoo, Stooq, Alpaca, Polygon and
Alpha Vantage all return a 403 from the environment's network policy. Broker connectors are excluded
at the owner's request. The hypotheses below were written **before seeing any market data**, so the
first real run is a genuine test.

## Universe (fixed before data)
Index ETFs SPY, QQQ, plus 18 US mega-caps spread across sectors so that sector dependence can be
tested: semis (NVDA, AVGO, AMD, MU), internet (META, GOOGL, AMZN, NFLX), software (MSFT, ORCL,
PLTR), hardware (AAPL), auto (TSLA), financials (JPM), pharma (LLY), energy (XOM) and retail (WMT, COST).

## Entry hypotheses (8), on 5-minute bars, all fills before 12:00 ET
| id | idea | instruments | entry | structural stop |
|---|---|---|---|---|
| H1 | Stocks in play: OR15 breakout in first-candle direction, RVOL15 ≥ 2 | stocks | stop order 1 tick beyond OR15 | other side of OR15 |
| H2 | Moderate gap (0.25–1.0%) fade once OR15 leans to the fill | SPY, QQQ | break of OR15 toward the fill | other side of OR15 |
| H3 | Gap ≥ 1.5% with RVOL15 ≥ 1.5: first VWAP pullback in the gap direction | stocks | break of the pullback bar within 3 bars | pullback-bar extreme |
| H4 | 30-min drive ≥ 0.30×ATR14: first VWAP pullback after 10:00 | all | same as H3 | pullback-bar extreme |
| H5 | Failed break of prior-day high/low after 09:45 (open inside range) | all | next bar open, fade | day's extreme |
| H6 | Relative strength vs SPY ≥ 0.75% at 10:00 → high/low-of-day break | stocks | stop beyond HOD/LOD | 09:45–10:00 extreme |
| H7 | Drive ≥ 0.60×ATR14 exhaustion; first reversal bar 10:00–10:30 | all | next bar open, fade | day's extreme |
| H8 | 30-min opening-range breakout | SPY, QQQ | first side broken | other side of OR30 |

Each runs with 3 pre-set exits: **T2** (stop / 2R limit / 16:00 close), **EOD** (stop / 16:00 close),
**T2BE** (2R limit, stop to breakeven after +1R). That makes 24 base configurations. Each one is also
sliced by 7 pre-listed selection characteristics: direction, sector, liquidity tier, volatility tier
(ATR%), SPY regime vs its 20-day SMA, gap bucket and RVOL bucket. That makes about 500 trials in total,
all logged in `results/design_all_trials.csv`.

Stops narrower than 0.15% or wider than 3% of price are skipped.

## Execution realism (conservative by construction)
- Decisions use completed bars only. Stop entries fill at the trigger or a worse open.
- If a bar touches both the stop and the target, **the stop wins**. If the trigger and the stop fall in
  the same bar, the trade is **booked as filled and stopped**.
- A 2R target is a passive limit order that needs price to trade 1 tick *through* it.
- "Reached 2R" (price touched +2R before the original stop) is reported separately from
  "took 2R" (the limit actually filled).
- Costs per share: $0.0035 commission each side; half of a 1-cent spread on entry and on stop exits;
  slippage of 1 bp on stop entries, 0.5 bp on market entries, 2 bp on stops and 1 bp on the MOC exit.
  Every result is also re-run at **2× costs**.

## Validation protocol (locked in code)
- Chronological split: the first 60% of trading days is *design*, the last 40% is *holdout*.
- A configuration passes design only if:
  - n ≥ 80 (stocks) or n ≥ 50 (index), net expectancy ≥ +0.10R and t ≥ 2.0;
  - it stays positive at 2× costs;
  - at least 60% of symbols are net-positive.
- A segment filter can pass only on stricter terms: n ≥ 60, +0.15R and t ≥ 2.5.
- At most 3 configurations go forward, one per hypothesis. They are frozen to `results/selection.json`.
- `holdout` refuses to run until selections are frozen, refuses a changed data split, and runs once.
  A configuration survives if holdout n ≥ 30, net expectancy > 0, and the day-block bootstrap p < 0.10.

## Engine validation (synthetic data, `make_synthetic.py` and path-based random walks)
- Random walks, 3 seeds × 20 symbols × 320 days: gross expectancy for all 24 configurations sits at
  about 0R, mostly within 1 SE. The largest residual is about +0.06R (H6), below the +0.10R net bar.
- The null test caught a real bug. Bars that touched both the entry trigger and the stop were being
  dropped, which hid losing trades and inflated breakout results by about +0.1R. Fixed: such bars are
  now booked as losses.
- Planted edges are detected in design and confirmed in holdout, and the holdout lock blocks a second run.

## Run it
```
pip install pandas numpy
python run_research.py design  --data data/
python run_research.py holdout --data data/
```
Input: one CSV per symbol (a TradingView "Export chart data" file works as-is). Columns:
`time,open,high,low,close,Volume`. Time is UNIX or ISO; bar time is the bar open; RTH bars are kept.

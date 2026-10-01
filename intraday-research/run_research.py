"""Two-phase research runner with a holdout lock.

  python run_research.py design  --data data/   # uses ONLY the first 60% of trading days
  python run_research.py holdout --data data/   # runs the frozen selections on the last 40%, once

`design` writes results/selection.json (rules + filters frozen, with a hash of the data split).
`holdout` refuses to run without it and refuses to run twice (results/holdout_done.json).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys

import numpy as np
import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ir.backtest import Costs, build_days, day_block_bootstrap_p, simulate, summarize  # noqa: E402
from ir.data import complete_days, load_dir  # noqa: E402
from ir.hypotheses import EXIT_MODES, HYPOTHESES  # noqa: E402

DESIGN_FRACTION = 0.60
SECTOR = {  # fixed before seeing data
    "SPY": "index", "QQQ": "index",
    "NVDA": "semis", "AVGO": "semis", "AMD": "semis", "MU": "semis",
    "AAPL": "hardware", "TSLA": "auto",
    "MSFT": "software", "ORCL": "software", "PLTR": "software",
    "META": "internet", "GOOGL": "internet", "AMZN": "internet", "NFLX": "internet",
    "JPM": "financials", "LLY": "pharma", "XOM": "energy", "WMT": "retail", "COST": "retail",
}
# Pre-registered pass criteria
DESIGN_MIN_N_STOCK, DESIGN_MIN_N_INDEX = 80, 50
DESIGN_MIN_EXP, DESIGN_MIN_T = 0.10, 2.0
SEGMENT_MIN_N, SEGMENT_MIN_EXP, SEGMENT_MIN_T = 60, 0.15, 2.5
MAX_FORWARDED = 3
HOLDOUT_MIN_N = 30


def load_universe(folder):
    bars = {s: complete_days(df) for s, df in load_dir(folder).items()}
    days = {s: build_days(s, df) for s, df in bars.items()}
    all_dates = sorted({d.date for v in days.values() for d in v})
    cut = all_dates[int(len(all_dates) * DESIGN_FRACTION)]
    return days, all_dates, cut


def run_all(days, date_filter, costs):
    idx_by_date = {d.date: d for d in days.get("SPY", [])}
    rows = []
    for hname, fn in HYPOTHESES.items():
        for sym, dl in days.items():
            for d in dl:
                if not date_filter(d.date):
                    continue
                sig = fn(d, idx=idx_by_date.get(d.date))
                if sig is None:
                    continue
                for mode in EXIT_MODES:
                    r = simulate(sig, mode, costs)
                    if r:
                        r.update(hyp=hname, exit=mode)
                        rows.append(r)
    t = pd.DataFrame(rows)
    if len(t):
        t["sector"] = t["sym"].map(SECTOR).fillna("other")
        t["dir"] = np.where(t["side"] > 0, "long", "short")
        t["liq_tier"] = _tier(t, "f_dollar_vol20")
        t["vol_tier"] = _tier(t, "f_atr_pct")
        t["regime"] = np.where(t["f_above_sma20"] == True, "spy_lead_up", "spy_lead_down")  # noqa: E712
        t["gap_bucket"] = pd.cut(t["f_gap"].abs(), [-1, 0.005, 0.015, 0.03, 9],
                                 labels=["<0.5%", "0.5-1.5%", "1.5-3%", ">3%"]).astype(str)
        t["rvol_bucket"] = pd.cut(t["f_rvol15"], [-1, 1, 2, 3, 1e9],
                                  labels=["<1", "1-2", "2-3", ">3"]).astype(str)
    return t


def _tier(t, col):
    # tiers relative to the cross-section on the same day; fixed cut at the median
    med = t.groupby("date")[col].transform("median")
    return np.where(t[col] >= med, "high", "low")


SEGMENT_COLS = ["dir", "sector", "liq_tier", "vol_tier", "regime", "gap_bucket", "rvol_bucket"]


def design(args):
    days, all_dates, cut = load_universe(args.data)
    os.makedirs("results", exist_ok=True)
    t = run_all(days, lambda d: d < cut, Costs())
    t2 = run_all(days, lambda d: d < cut, Costs(mult=2.0))
    t.to_csv("results/design_trades.csv", index=False)
    trials, cands = [], []
    for (h, m), g in t.groupby(["hyp", "exit"]):
        s = summarize(g)
        s2 = summarize(t2[(t2.hyp == h) & (t2.exit == m)])
        s.update(hyp=h, exit=m, segment="ALL", exp_R_2xcost=s2.get("exp_R", np.nan),
                 sym_pos=(g.groupby("sym")["R"].mean() > 0).mean(), p_boot=day_block_bootstrap_p(g))
        trials.append(s)
        idx_only = g["sym"].isin(["SPY", "QQQ"]).all()
        min_n = DESIGN_MIN_N_INDEX if idx_only else DESIGN_MIN_N_STOCK
        if (s["n"] >= min_n and s["exp_R"] >= DESIGN_MIN_EXP and s["t"] >= DESIGN_MIN_T
                and s["exp_R_2xcost"] > 0 and (idx_only or s["sym_pos"] >= 0.6)):
            cands.append(dict(hyp=h, exit=m, filter=None, design=s))
        for col in SEGMENT_COLS:
            for val, gg in g.groupby(col):
                ss = summarize(gg)
                ss.update(hyp=h, exit=m, segment=f"{col}={val}", p_boot=day_block_bootstrap_p(gg))
                trials.append(ss)
                if ss["n"] >= SEGMENT_MIN_N and ss["exp_R"] >= SEGMENT_MIN_EXP and ss["t"] >= SEGMENT_MIN_T:
                    g2 = t2[(t2.hyp == h) & (t2.exit == m) & (t2[col] == val)]
                    if summarize(g2).get("exp_R", -1) > 0:
                        cands.append(dict(hyp=h, exit=m, filter=[col, str(val)], design=ss))
    tr = pd.DataFrame(trials)
    tr.to_csv("results/design_all_trials.csv", index=False)
    cands.sort(key=lambda c: -c["design"]["t"])
    chosen, seen = [], set()
    for c in cands:  # at most one configuration per hypothesis, best design t-stat first
        if c["hyp"] not in seen and len(chosen) < MAX_FORWARDED:
            chosen.append(c)
            seen.add(c["hyp"])
    split_hash = hashlib.sha256(str([str(d) for d in all_dates]).encode()).hexdigest()[:16]
    sel = dict(cut_date=str(cut), n_design_days=sum(d < cut for d in all_dates),
               n_holdout_days=sum(d >= cut for d in all_dates), split_hash=split_hash,
               n_trials=len(tr), n_configs=int((tr.segment == "ALL").sum()),
               forwarded=[{k: v for k, v in c.items() if k != "design"} | {"design": _clean(c["design"])}
                          for c in chosen])
    json.dump(sel, open("results/selection.json", "w"), indent=2, default=str)
    print(tr[tr.segment == "ALL"][["hyp", "exit", "n", "exp_R", "t", "win_rate", "avg_win", "avg_loss",
                                   "reach2R", "took2R", "exp_R_2xcost", "sym_pos"]].round(3).to_string())
    print(f"\ntrials evaluated: {len(tr)}; forwarded to holdout: {len(chosen)}")
    for c in chosen:
        print("  ->", c["hyp"], c["exit"], c["filter"], round(c["design"]["exp_R"], 3))


def holdout(args):
    if not os.path.exists("results/selection.json"):
        sys.exit("run `design` first; holdout is locked until selections are frozen")
    if os.path.exists("results/holdout_done.json") and not args.force_rerun_same_rules:
        sys.exit("holdout already run once; results are in results/holdout_*.csv")
    sel = json.load(open("results/selection.json"))
    days, all_dates, cut = load_universe(args.data)
    if str(cut) != sel["cut_date"]:
        sys.exit("data split changed since design; refusing")
    t = run_all(days, lambda d: d >= cut, Costs())
    t2 = run_all(days, lambda d: d >= cut, Costs(mult=2.0))
    out = []
    for c in sel["forwarded"]:
        def pick(x):
            g = x[(x.hyp == c["hyp"]) & (x.exit == c["exit"])]
            return g[g[c["filter"][0]] == c["filter"][1]] if c["filter"] else g
        g = pick(t)
        s = summarize(g)
        s.update(hyp=c["hyp"], exit=c["exit"], filter=c["filter"],
                 exp_R_2xcost=summarize(pick(t2)).get("exp_R", np.nan), p_boot=day_block_bootstrap_p(g),
                 survives=bool(s.get("n", 0) >= HOLDOUT_MIN_N and s.get("exp_R", -1) > 0
                               and day_block_bootstrap_p(g) < 0.10))
        out.append(s)
        g.to_csv(f"results/holdout_trades_{c['hyp']}_{c['exit']}.csv", index=False)
    res = pd.DataFrame(out)
    res.to_csv("results/holdout_summary.csv", index=False)
    json.dump(dict(done=True), open("results/holdout_done.json", "w"))
    print(res.round(3).to_string())


def _clean(d):
    return {k: (None if isinstance(v, float) and np.isnan(v) else (float(v) if isinstance(v, (np.floating, float)) else v))
            for k, v in d.items()}


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("phase", choices=["design", "holdout"])
    ap.add_argument("--data", default="data")
    ap.add_argument("--force-rerun-same-rules", action="store_true",
                    help="re-run holdout with the SAME frozen rules (e.g. after a bug fix); logged")
    a = ap.parse_args()
    design(a) if a.phase == "design" else holdout(a)

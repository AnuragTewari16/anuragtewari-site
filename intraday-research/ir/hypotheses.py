"""Pre-registered entry hypotheses. Written before any market data was examined.

Each function takes one symbol-day (plus the index day when needed) and returns at most one Signal.
Bar indices: 0 = 09:30, 2 = 09:40 (last OR15 bar), 5 = 09:55 (closes 10:00), 29 = 11:55.
"""
from __future__ import annotations


from .backtest import LAST_ENTRY_BAR, TICK, Day, Signal, stop_entry

INDEX_ETFS = {"SPY", "QQQ"}


def h1_orb_rvol(d: Day, **_) -> Signal | None:
    """Stocks in play: 15-min opening-range breakout in the direction of the first 15-min candle,
    only when first-15-min volume >= 2x its 14-day average. Stop = other side of the range."""
    if d.sym in INDEX_ETFS or d.f["rvol15"] < 2.0:
        return None
    orh, orl, oro, orc = d.h[:3].max(), d.l[:3].min(), d.o[0], d.c[2]
    if orc == oro:
        return None
    side = 1 if orc > oro else -1
    lvl, stop = (orh + TICK, orl - TICK) if side > 0 else (orl - TICK, orh + TICK)
    hit = stop_entry(d, side, lvl, 3, LAST_ENTRY_BAR, cancel=stop)
    return Signal(d, side, hit[0], hit[1], stop, "stop", "H1") if hit else None


def h2_idx_gap_fade(d: Day, **_) -> Signal | None:
    """Index ETFs: fade a moderate gap (0.25%-1.0%) once the first 15 minutes already lean toward
    the fill; enter on a break of the OR15 in the fill direction, stop at the other side."""
    if d.sym not in INDEX_ETFS or not (0.0025 <= abs(d.f["gap"]) <= 0.010):
        return None
    side = -1 if d.f["gap"] > 0 else 1
    orh, orl = d.h[:3].max(), d.l[:3].min()
    if (d.c[2] - d.o[0]) * side <= 0:
        return None
    lvl, stop = (orh + TICK, orl - TICK) if side > 0 else (orl - TICK, orh + TICK)
    hit = stop_entry(d, side, lvl, 3, LAST_ENTRY_BAR, cancel=stop)
    return Signal(d, side, hit[0], hit[1], stop, "stop", "H2") if hit else None


def _vwap_pullback(d: Day, side: int, start: int, tag: str) -> Signal | None:
    """First bar that tags VWAP but closes on the trend side; buy/sell a break of that bar within
    3 bars; stop beyond the signal bar. Invalid if a bar closes on the wrong side of VWAP first."""
    for j in range(start, LAST_ENTRY_BAR):
        if (d.c[j] - d.vwap[j]) * side < 0:
            return None
        touched = d.l[j] <= d.vwap[j] if side > 0 else d.h[j] >= d.vwap[j]
        if touched:
            lvl = d.h[j] + TICK if side > 0 else d.l[j] - TICK
            stop = d.l[j] - TICK if side > 0 else d.h[j] + TICK
            hit = stop_entry(d, side, lvl, j + 1, min(j + 3, LAST_ENTRY_BAR), cancel=stop)
            return Signal(d, side, hit[0], hit[1], stop, "stop", tag) if hit else None
    return None


def h3_gap_vwap_pullback(d: Day, **_) -> Signal | None:
    """Stocks gapping >= 1.5% with RVOL15 >= 1.5: first pullback to VWAP in the gap direction."""
    if d.sym in INDEX_ETFS or abs(d.f["gap"]) < 0.015 or d.f["rvol15"] < 1.5:
        return None
    side = 1 if d.f["gap"] > 0 else -1
    if (d.c[2] - d.vwap[2]) * side <= 0:
        return None
    return _vwap_pullback(d, side, 3, "H3")


def h4_drive_vwap_pullback(d: Day, **_) -> Signal | None:
    """Any symbol: strong 30-min opening drive (>= 0.30 x ATR14) -> first VWAP pullback after 10:00."""
    drive = d.c[5] - d.o[0]
    if abs(drive) < 0.30 * d.f["atr14"]:
        return None
    side = 1 if drive > 0 else -1
    if (d.c[5] - d.vwap[5]) * side <= 0:
        return None
    return _vwap_pullback(d, side, 6, "H4")


def h5_pdhl_sweep(d: Day, **_) -> Signal | None:
    """Failed break of the prior-day high/low after 09:45: a 5-min bar pokes through and closes back
    inside -> fade at next open, stop beyond the day's extreme. Only if the open was inside."""
    pdh, pdl = d.f["pdh"], d.f["pdl"]
    if not (pdl < d.o[0] < pdh):
        return None
    for j in range(3, LAST_ENTRY_BAR):
        if d.h[j] > pdh and d.c[j] < pdh:
            return Signal(d, -1, j + 1, d.o[j + 1], d.h[: j + 1].max() + TICK, "open", "H5")
        if d.l[j] < pdl and d.c[j] > pdl:
            return Signal(d, 1, j + 1, d.o[j + 1], d.l[: j + 1].min() - TICK, "open", "H5")
    return None


def h6_rs_break(d: Day, idx: Day | None = None, **_) -> Signal | None:
    """Stock vs SPY relative strength at 10:00 >= 0.75% (and stock itself moving that way) ->
    break of the high (low) of day after 10:00; stop below the 09:45-10:00 low (above the high)."""
    if d.sym in INDEX_ETFS or idx is None or len(idx.c) <= 5:
        return None
    r_s = d.c[5] / d.o[0] - 1
    r_i = idx.c[5] / idx.o[0] - 1
    rs = r_s - r_i
    if rs >= 0.0075 and r_s > 0:
        side, lvl, stop = 1, d.h[:6].max() + TICK, d.l[3:6].min() - TICK
    elif rs <= -0.0075 and r_s < 0:
        side, lvl, stop = -1, d.l[:6].min() - TICK, d.h[3:6].max() + TICK
    else:
        return None
    hit = stop_entry(d, side, lvl, 6, LAST_ENTRY_BAR, cancel=stop)
    return Signal(d, side, hit[0], hit[1], stop, "stop", "H6") if hit else None


def h7_drive_fade(d: Day, **_) -> Signal | None:
    """Exhaustion: 30-min opening drive >= 0.60 x ATR14, then between 10:00 and 10:30 the first
    5-min close beyond the previous bar's extreme against the drive -> fade at next open,
    stop beyond the high (low) of day."""
    drive = d.c[5] - d.o[0]
    if abs(drive) < 0.60 * d.f["atr14"]:
        return None
    side = -1 if drive > 0 else 1
    for j in range(6, 12):
        rev = d.c[j] < d.l[j - 1] if side < 0 else d.c[j] > d.h[j - 1]
        if rev:
            stop = d.h[: j + 1].max() + TICK if side < 0 else d.l[: j + 1].min() - TICK
            return Signal(d, side, j + 1, d.o[j + 1], stop, "open", "H7")
    return None


def h8_idx_orb30(d: Day, **_) -> Signal | None:
    """Index ETFs: 30-min opening-range breakout, whichever side breaks first after 10:00,
    stop at the other side of the range."""
    if d.sym not in INDEX_ETFS:
        return None
    orh, orl = d.h[:6].max(), d.l[:6].min()
    for j in range(6, LAST_ENTRY_BAR + 1):
        up, dn = d.h[j] > orh, d.l[j] < orl
        if up:  # a bar breaking both sides is booked as a long that is stopped in the same bar
            return Signal(d, 1, j, max(orh + TICK, d.o[j]), orl - TICK, "stop", "H8")
        if dn:
            return Signal(d, -1, j, min(orl - TICK, d.o[j]), orh + TICK, "stop", "H8")
    return None


HYPOTHESES = {
    "H1_orb_rvol_stocks": h1_orb_rvol,
    "H2_index_gap_fade": h2_idx_gap_fade,
    "H3_gap_vwap_pullback": h3_gap_vwap_pullback,
    "H4_drive_vwap_pullback": h4_drive_vwap_pullback,
    "H5_prior_day_sweep_fade": h5_pdhl_sweep,
    "H6_rel_strength_break": h6_rs_break,
    "H7_opening_drive_fade": h7_drive_fade,
    "H8_index_orb30": h8_idx_orb30,
}
EXIT_MODES = {"T2": "stop / 2R limit / 16:00 close",
              "EOD": "stop / 16:00 close (no target)",
              "T2BE": "stop -> breakeven after +1R / 2R limit / 16:00 close"}

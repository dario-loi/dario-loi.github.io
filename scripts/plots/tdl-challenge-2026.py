"""TDL Challenge 2026: submissions per domain, grouped by track (Section 4 of the report)."""

import matplotlib.pyplot as plt
from mentis import setup, style_axes, legend_top, save, COLORS, HATCHES, BAR_EDGE

# Track 1 (GNNs) had 37 submissions; Track 2 (TNNs) had 31: simplicial 10, cellular 6,
# hypergraph 7, combinatorial 8 (68 in all).
DOMAINS = ["Graph", "Simplicial", "Cellular", "Hypergraph", "Combinatorial"]
TRACK_1 = [37, 0, 0, 0, 0]
TRACK_2 = [0, 10, 6, 7, 8]
assert sum(TRACK_1) + sum(TRACK_2) == 68
assert sum(TRACK_2) == 31


def hbars(ax, y, widths, i, label, height=0.55):
    """mentis.bars laid on its side: the domain names read at full tick size."""
    return ax.barh(y, widths, height=height, color=COLORS[i], hatch=HATCHES[i % len(HATCHES)],
                   edgecolor="black", linewidth=BAR_EDGE, label=label, zorder=3)


setup()
fig, ax = plt.subplots(figsize=(5.2, 3.6))
y = list(range(len(DOMAINS)))
hbars(ax, y[:1], TRACK_1[:1], 0, "Track 1 (GNNs)")
hbars(ax, y[1:], TRACK_2[1:], 1, "Track 2 (TNNs)")
ax.set_yticks(y)
ax.set_yticklabels(DOMAINS)
ax.invert_yaxis()
ax.set_xticks(range(0, 41, 10))
ax.set_xlim(0, 40)
style_axes(ax, xlabel="Submissions", grid_axis="x")
leg = legend_top(fig, ax, y=0.9)
leg.set_bbox_to_anchor((0.5, 0.9), transform=fig.transFigure)
save(fig, "tdl-challenge-2026", leg)

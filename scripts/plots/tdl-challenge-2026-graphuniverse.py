"""TDL Challenge 2026: the graph characteristics GraphUniverse varies (Section 3.1 of the report)."""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from mentis import setup, COLORS, HATCHES, BAR_EDGE, style_axes, legend_top, save

# Section 3.1: homophily at three levels (0-0.1, 0.4-0.6, 0.9-1.0), average degree at two
# (1-2.5, 4-5), power-law exponent gamma at two (1.5-2 heavy-tailed, 4-5 homogeneous).
HOMOPHILY = [(0.0, 0.1), (0.4, 0.6), (0.9, 1.0)]
DEGREE = [(1.0, 2.5), (4.0, 5.0)]
GAMMA = [(1.5, 2.0), (4.0, 5.0)]
assert len(HOMOPHILY) * len(DEGREE) * len(GAMMA) == 12

setup()
fig, (a, b) = plt.subplots(2, 1, figsize=(5.4, 7.0), gridspec_kw={"height_ratios": [1, 1.05], "hspace": 0.5})

# (a) the six homophily x average-degree cells; each is sampled at both gamma levels, so they
# take the lab's neutral teal, cross-hatched, and red and blue stay panel (b)'s two gamma ranges.
for h0, h1 in HOMOPHILY:
    for d0, d1 in DEGREE:
        a.add_patch(Rectangle((h0, d0), h1 - h0, d1 - d0, facecolor=COLORS[3], hatch=HATCHES[3],
                              edgecolor="black", linewidth=BAR_EDGE, zorder=3))
a.set_xlim(-0.05, 1.05)
a.set_ylim(0, 6)
a.set_xticks([0, 0.25, 0.5, 0.75, 1])
a.set_xticklabels(["0", "0.25", "0.5", "0.75", "1"])
a.set_yticks(range(0, 7))
style_axes(a, xlabel="Homophily", ylabel="Average degree", grid_axis="both")
a.set_title("(a) Six cells, each at both $\\gamma$ levels", fontsize=16, pad=8)

# (b) shape of the degree distribution, P(k) / P(1) = k^(-gamma), for the two gamma ranges.
k = np.linspace(1, 20, 200)
for i, (g0, g1) in enumerate(GAMMA):
    lab = "Heavy-tailed, $\\gamma$ = 1.5 to 2" if i == 0 else "Homogeneous, $\\gamma$ = 4 to 5"
    b.fill_between(k, k ** -g1, k ** -g0, color=COLORS[i], hatch=HATCHES[i], edgecolor="black", linewidth=BAR_EDGE,
                   label=lab, zorder=3)
b.set_xscale("log")
b.set_yscale("log")
b.set_xlim(1, 20)
b.set_ylim(1e-7, 1.5)
b.set_xticks([1, 2, 5, 10, 20])
b.set_xticklabels(["1", "2", "5", "10", "20"])
b.set_yticks([1e-6, 1e-4, 1e-2, 1])
b.minorticks_off()
style_axes(b, xlabel="Degree k", ylabel="P(k) / P(1)", grid_axis="both")
b.set_title("(b) Degree distribution, $k^{-\\gamma}$", fontsize=16, pad=8)

fig.canvas.draw()
leg = legend_top(fig, b, ncol=1, y=b.get_position().y0 - 0.215)
save(fig, "tdl-challenge-2026-graphuniverse", leg)

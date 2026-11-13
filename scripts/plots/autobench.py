"""AutoBench: rank correlation with MMLU-Pro and GPQA, multi-judge against single-judge (Table 1)."""

import matplotlib.pyplot as plt
from mentis import setup, bars, style_axes, legend_top, save

# Table 1 of the paper, "Multi-judge (AutoBench)" block; rows MMLU-Pro, GPQA.
MULTI = {"tau": [0.64, 0.52], "rho": [0.78, 0.63]}
# Table 1, "Single-judge (gpt-oss-20b)" block; rows MMLU-Pro, GPQA.
SINGLE = {"tau": [0.45, 0.45], "rho": [0.61, 0.59]}
BENCH = ["MMLU-Pro", "GPQA"]
PANELS = [("tau", "Kendall's \u03c4"), ("rho", "Spearman's \u03c1")]

setup()
fig, axes = plt.subplots(1, 2, figsize=(7, 3.4), sharey=True)
w = 0.36
for ax, (key, title) in zip(axes, PANELS):
    x = range(len(BENCH))
    bars(ax, [i - w / 2 for i in x], MULTI[key], 0, "Multi-judge", width=w)
    bars(ax, [i + w / 2 for i in x], SINGLE[key], 1, "Single-judge", width=w)
    ax.set_xticks(list(x))
    ax.set_xticklabels(BENCH)
    ax.set_ylim(0, 1)
    ax.set_xlabel(title)
    style_axes(ax, xlabel=title, grid_axis="y")
axes[0].set_ylabel("Rank correlation", fontsize=18, labelpad=5)
fig.subplots_adjust(wspace=0.08)
leg = legend_top(fig, axes[0], y=0.93)
# center legend over both axes
leg.set_bbox_to_anchor((0.5, 0.93), transform=fig.transFigure)
save(fig, "autobench", leg)

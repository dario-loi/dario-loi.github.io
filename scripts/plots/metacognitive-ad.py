"""Segmentation F1 on MVTec AD 2 under two thresholds, for the two scorers (Table 1 of the paper)."""

import numpy as np

from mentis import setup, bars, style_axes, legend_top, save

# Table 1 ("Segmentation F1 (%) across thresholds"), row "MVTec AD 2", mean over 3 seeds.
# Columns: mu+3sigma NN = 33.34, mu+3sigma Mahalanobis = 19.88,
#          EVT t_c NN = 50.00, EVT t_c Mahalanobis = 49.39.
THRESHOLDS = ["\u03bc+3\u03c3", "EVT $t_c$"]
NN = [33.34, 50.00]
MAHALANOBIS = [19.88, 49.39]

setup()
import matplotlib.pyplot as plt  # noqa: E402

fig, ax = plt.subplots(figsize=(5.2, 3.6))
x = np.arange(len(THRESHOLDS))
w = 0.36
bars(ax, x - w / 2, NN, 0, "Nearest neighbor", width=w)
bars(ax, x + w / 2, MAHALANOBIS, 1, "Mahalanobis", width=w)
for xs, vals in ((x - w / 2, NN), (x + w / 2, MAHALANOBIS)):
    for xi, v in zip(xs, vals):
        ax.text(xi, v + 1, f"{v:.2f}", ha="center", va="bottom", fontsize=12)
ax.set_xticks(x, THRESHOLDS)
ax.set_ylim(0, 60)
style_axes(ax, xlabel="Threshold", ylabel="Segmentation F1 (%)", grid_axis="y")
leg = legend_top(fig, ax, y=0.935)
fig.tight_layout(rect=(0, 0, 1, 0.93))
save(fig, "metacognitive-ad", leg)

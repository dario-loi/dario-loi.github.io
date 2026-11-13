"""TDL Challenge 2025: submissions per category (Section 3 of the report)."""

import matplotlib.pyplot as plt
from mentis import setup, bars, style_axes, legend_top, save

# Section 3, "Submissions and Winners": Mission A had 25 submissions in Category A.1 and 9 in A.2;
# Mission B had 5 in B.1 and 5 in B.2 (44 in all).
CATEGORIES = ["A.1", "A.2", "B.1", "B.2"]
MISSION_A = [25, 9, 0, 0]
MISSION_B = [0, 0, 5, 5]
assert sum(MISSION_A) + sum(MISSION_B) == 44

setup()
fig, ax = plt.subplots(figsize=(5, 3.4))
x = list(range(len(CATEGORIES)))
bars(ax, x[:2], MISSION_A[:2], 0, "Mission A", width=0.55)
bars(ax, x[2:], MISSION_B[2:], 1, "Mission B", width=0.55)
ax.set_xticks(x)
ax.set_xticklabels(CATEGORIES)
ax.set_yticks(range(0, 26, 5))
ax.set_ylim(0, 27)
style_axes(ax, xlabel="Category", ylabel="Submissions", grid_axis="y")
leg = legend_top(fig, ax, y=0.9)
leg.set_bbox_to_anchor((0.5, 0.9), transform=fig.transFigure)
save(fig, "tdl-challenge-2025", leg)

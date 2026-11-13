"""Table 2 of the Implicit Sheaf Operators paper, Sheaf Diffusion block: forward-time speedup by stalk dimension.

    .venv/bin/python scripts/plots/implicit-sheaf-operators.py
"""

import matplotlib.pyplot as plt

from mentis import setup, line, style_axes, legend_top, save

# Table 2 (inductive, Erdos-Renyi, n=1000, m=189,810, f=16), block "Sheaf Diffusion".
# Columns "x" copied as printed, for d = 2, 4, 8.
D = [2, 4, 8]
TIME_X = {  # Forward Time, x column
    "Diagonal": [1.38, 1.34, 1.31],  # Table 2, Sheaf Diffusion, Diagonal rows d=2,4,8
    "Bundle": [2.11, 1.74, 1.73],  # Table 2, Sheaf Diffusion, Bundle rows
    "General": [4.87, 2.94, 1.71],  # Table 2, Sheaf Diffusion, General rows
}

setup()
fig, ax = plt.subplots(figsize=(5.2, 3.6))
for i, (family, ys) in enumerate(TIME_X.items()):
    line(ax, D, ys, i, family)
style_axes(ax, "Stalk dimension $d$", "Speedup in forward time")
ax.set_xticks(D)
ax.set_xlim(1.6, 8.4)
ax.set_ylim(0, max(max(v) for v in TIME_X.values()) * 1.12)
fig.tight_layout()
leg = legend_top(fig, ax, y=0.98)
save(fig, "implicit-sheaf-operators", leg)

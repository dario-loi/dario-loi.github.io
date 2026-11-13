"""Table 3b of "Implicit Inversion turns CLIP into a Decoder": the ablation on 1,000 MS-COCO captions."""

import sys
from pathlib import Path

import matplotlib.pyplot as plt

sys.path.insert(0, str(Path(__file__).resolve().parent))
from mentis import setup, bars, style_axes, save  # noqa: E402

# Table 3b (Quantitative ablation study), column "FID" (the table marks it with a down arrow),
# rows i. to v., in the table's order.
ROWS = [
    ("i.\nCLIP$^{-1}$", 107.1),            # i. CLIP-1
    ("ii.\nw/o F.O.", 185.1),              # ii. w/o Freq. Opt (F.O.)
    ("iii.\nw/o AWP", 121.0),              # iii. w/o AWP
    ("iv.\nw/o F.O.\n& Proc.", 111.3),     # iv. w/o F.O. & Proc.
    ("v.\nw/o F.O.\n& $L_{blend}$", 119.7),  # v. w/o F.O. & Lblend
]

setup()
fig, ax = plt.subplots(figsize=(5.6, 3.6))
for i, (name, fid) in enumerate(ROWS):
    bars(ax, i, fid, i, name, width=0.62)
    ax.text(i, fid + 3, f"{fid:.1f}", ha="center", va="bottom", fontsize=13)
ax.set_xticks(range(len(ROWS)))
ax.set_xticklabels([r[0] for r in ROWS], fontsize=13)
ax.set_ylim(0, 215)
style_axes(ax, ylabel="FID (lower is better)", grid_axis="y")
ax.tick_params(axis="x", labelsize=13)
save(fig, "implicit-inversion-clip")

"""The MENTIS lab's plot style, for the figures on the paper pages.

It follows the lab's own plotting scripts (MENTIS_plots/linearplot.py and evmplot.py): Times New
Roman, heavy axes, a dashed grid, lines with black-edged markers and a different dash and marker
per series, bars with a black edge and a hatch per series, and one boxed legend centered above
the axes. The lab draws at poster size (a 48 by 36 inch canvas with 90 pt type); the sizes here
are the same proportions on a canvas a web page can show at its own width.

    from mentis import setup, COLORS, LINESTYLES, MARKERS, HATCHES, line, bars, legend_top, save

Each figure is a script in this folder that holds its numbers (copied from a table of the paper,
with the table named in a comment) and writes src/content/publications/<slug>-plot.svg:

    .venv/bin/python scripts/plots/<slug>.py
"""

import io
import re
from pathlib import Path

import matplotlib as mpl

mpl.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

OUT = Path(__file__).resolve().parents[2] / "src" / "content" / "publications"

# linearplot.py's series colors first, then evmplot.py's fills.
COLORS = ["#F34C4C", "#719BDB", "#1C0835", "#20B2AA", "#8e44ad", "orange", "burlywood", "gold"]
LINESTYLES = ["--", "-", "-.", ":", (0, (5, 1)), (0, (3, 1, 1, 1))]
MARKERS = ["^", "o", "s", "D", "v", "P"]
GRID = "#7f7f7f"    # becomes var(--lab-grid) in save()
FRAME = "#808080"   # the legend frame, var(--lab-frame)
HATCHES = ["/", "\\", ".", "xx", "//", "oo"]

# linearplot.py at one sixth: 90 pt type on a 24 inch wide panel becomes 15 pt on 4 inches.
FONT = 15
AXIS_LABEL = 18
TICK_LABEL = 16
LEGEND = 16
LINEWIDTH = 2.4
MARKERSIZE = 9
MARKEREDGE = 0.9
AXES_WIDTH = 1.4
BAR_EDGE = 1.2


def setup():
    mpl.rcParams.update({
        "font.family": "serif",
        "font.serif": ["Times New Roman", "Nimbus Roman", "TeX Gyre Termes", "Liberation Serif", "DejaVu Serif"],
        "mathtext.fontset": "stix",
        "font.size": FONT,
        "axes.linewidth": AXES_WIDTH,
        "hatch.linewidth": 0.8,
        # Live <text>, so the figure can be selected, searched and crawled; save() sets the stack.
        "svg.fonttype": "none",
        "svg.hashsalt": "mentis",
    })


def style_axes(ax, xlabel=None, ylabel=None, grid_axis="both"):
    ax.set_facecolor("none")
    ax.grid(True, which="major", axis=grid_axis, linestyle="--", linewidth=0.6, color=GRID, alpha=0.45)
    ax.set_axisbelow(True)
    if xlabel:
        ax.set_xlabel(xlabel, fontsize=AXIS_LABEL, labelpad=5)
    if ylabel:
        ax.set_ylabel(ylabel, fontsize=AXIS_LABEL, labelpad=5)
    ax.tick_params(axis="both", which="both", labelsize=TICK_LABEL, width=1.1, length=4.5, pad=4)


def line(ax, x, y, i, label):
    """Series i as the lab draws a line: its own color, dash, and black-edged marker."""
    return ax.plot(x, y, color=COLORS[i], linestyle=LINESTYLES[i % len(LINESTYLES)], marker=MARKERS[i % len(MARKERS)],
                   markersize=MARKERSIZE, markeredgewidth=MARKEREDGE, markeredgecolor="black", linewidth=LINEWIDTH, label=label)


def bars(ax, x, heights, i, label, width=0.36):
    """Series i as the lab fills a box: its own color and hatch, with a black edge."""
    return ax.bar(x, heights, width=width, color=COLORS[i], hatch=HATCHES[i % len(HATCHES)],
                  edgecolor="black", linewidth=BAR_EDGE, label=label, zorder=3)


def legend_top(fig, ax, ncol=None, y=1.0):
    handles, labels = ax.get_legend_handles_labels()
    leg = fig.legend(handles, labels, loc="lower center", bbox_to_anchor=(0.5, y), ncol=ncol or len(labels),
                     fontsize=LEGEND, frameon=True, fancybox=False, framealpha=1.0, facecolor="white", edgecolor=FRAME,
                     handlelength=2.4, handletextpad=0.7, columnspacing=1.3, labelspacing=0.4, borderpad=0.5)
    leg.get_frame().set_linewidth(1.1)
    return leg


STACK = "'Times New Roman', Times, 'Liberation Serif', 'Nimbus Roman', serif"
# Lab series colors -> custom properties, so the page can lighten them on a dark ground.
SERIES = {"#f34c4c": "lab-1", "#719bdb": "lab-2", "#1c0835": "lab-3", "#20b2aa": "lab-4",
          "#8e44ad": "lab-5", "#ffa500": "lab-6", "#deb887": "lab-7", "#ffd700": "lab-8"}
INK = {"#000000": "currentColor"}
VARS = {**{h: f"var(--{n},{h})" for h, n in SERIES.items()},
        "#7f7f7f": "var(--lab-grid,#7f7f7f)", "#808080": "var(--lab-frame,#808080)",
        "#ffffff": "var(--lab-paper,#fff)"}


def _colorize(svg, slug):
    """Make the SVG follow the page: ink is currentColor, series colors are custom properties."""
    svg = re.sub(r"<\?xml.*?\?>\s*|<!DOCTYPE.*?>\s*|<metadata>.*?</metadata>\s*", "", svg, flags=re.S)
    svg = re.sub(r"<!--.*?-->\s*", "", svg, flags=re.S)
    # Presentation attributes cannot hold var(); move colors into style.
    def attr_to_style(m):
        return f' style="{m.group(1)}:{m.group(2)}"'
    svg = re.sub(r' (fill|stroke)="(#[0-9a-fA-F]{6})"', attr_to_style, svg)
    def color(m):
        h = m.group(0).lower()
        return INK.get(h) or VARS.get(h) or m.group(0)
    svg = re.sub(r"#[0-9a-fA-F]{6}\b", color, svg)
    svg = re.sub(r"font-family: [^;\"]*", lambda m: "font-family: " + STACK, svg)
    # Unique ids per plot, so two inline plots never collide.
    ids = set(re.findall(r'\bid="([^"]+)"', svg))
    for i in sorted(ids, key=len, reverse=True):
        svg = svg.replace(f'id="{i}"', f'id="{slug}-{i}"').replace(f"url(#{i})", f"url(#{slug}-{i})").replace(f'href="#{i}"', f'href="#{slug}-{i}"')
    svg = re.sub(r"-?\d+\.\d{3,}", lambda m: f"{float(m.group(0)):.2f}".rstrip("0").rstrip("."), svg)
    return re.sub(r">\s+<", "><", svg).strip() + "\n"


def save(fig, slug, leg=None):
    """Write <slug>-plot.svg beside the paper's entry: live text, transparent ground, themeable ink."""
    fig.patch.set_facecolor("none")
    out = OUT / f"{slug}-plot.svg"
    buf = io.StringIO()
    fig.savefig(buf, format="svg", bbox_inches="tight", pad_inches=0.05, bbox_extra_artists=(leg,) if leg else None,
                metadata={"Date": None, "Creator": None}, transparent=False)
    out.write_text(_colorize(buf.getvalue(), slug))
    print(f"[OK] {out.relative_to(OUT.parents[2])}")

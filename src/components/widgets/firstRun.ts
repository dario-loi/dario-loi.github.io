// The first-view run every model but IsoOperator shares: once, the first time the model is half
// in view, a control is driven from a start value to its default on one clock, so the mechanism
// shows itself. Model.astro marks the figure data-first="wait" before first paint (and drops the
// mark after 2.5 s so a stalled script still ends on the finished drawing); this module draws the
// start state, reveals the figure, and runs; `replay` runs it again when a choice changes the model. Any input on a control, or reduced motion switched on
// mid-run, ends the run on the spot. Without the mark (reduced motion, no script, a late script)
// nothing runs and the finished default state stays.

/** CSS cubic-bezier(x1, y1, x2, y2) as a function of linear progress 0..1. */
export function bezier(x1: number, y1: number, x2: number, y2: number): (x: number) => number {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 24; i++) {
      t = (lo + hi) / 2;
      if (((ax * t + bx) * t + cx) * t < x) lo = t; else hi = t;
    }
    return ((ay * t + by) * t + cy) * t;
  };
}

/** The arrival curve of the design system, cubic-bezier(0.16, 1, 0.3, 1). */
export const arrive = bezier(0.16, 1, 0.3, 1);

/** The curve a run drives its control with: an ease-out, but less front-loaded than `arrive`
 *  (which spends 80% of the distance in the first fifth of the time), so the sweep stays visible
 *  for the 2 s the mechanism needs to be read. */
export const easeOut = bezier(0.33, 1, 0.68, 1);

/** n equal stages: the stage index k (0 to n - 1) and the linear progress inside it. */
export function stages(p: number, n: number): { k: number; f: number } {
  const u = Math.min(Math.max(p, 0), 1) * n;
  const k = Math.min(n - 1, Math.floor(u));
  return { k, f: u - k };
}

export interface FirstRun {
  /** Seconds, 1.6 to 2.6. */
  duration: number;
  /** Draw the start state: controls and drawing together. Called once, before the figure shows. */
  start(): void;
  /** Draw linear progress p, 0 to 1; the last call is exactly 1. Touch only what changes. */
  frame(p: number): void;
  /** The run is over, finished or cut short by the visitor: restore the controls' own step and
   *  say the resting state in words. Called once. */
  end(cancelled: boolean): void;
}

export interface Player {
  /** Run again from the start state now, as when a choice changes the model; with reduced motion
   *  it jumps to the finished state instead. Any run in progress is dropped. */
  replay(): void;
}

export function firstRun(root: HTMLElement, run: FirstRun): Player {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  const controls = root.querySelector<HTMLElement>(".model__controls");
  const stage = root.querySelector(".model__stage") ?? root;
  let drop: (() => void) | undefined;

  // One play: draws the start state, then runs on one clock once `inView` resolves.
  const play = (waitForView: boolean) => {
    drop?.();
    let raf = 0, io: IntersectionObserver | undefined, over = false;
    const stop = (finished: boolean, cancelled: boolean) => {
      if (over) return;
      over = true;
      drop = undefined;
      cancelAnimationFrame(raf);
      io?.disconnect();
      controls?.removeEventListener("pointerdown", cut, true);
      controls?.removeEventListener("touchstart", cut, true);
      controls?.removeEventListener("keydown", key, true);
      still.removeEventListener("change", reduce);
      if (finished) run.frame(1);
      run.end(cancelled);
    };
    const cut = () => stop(false, true);
    const key = (e: KeyboardEvent) => { if (e.key !== "Tab" && e.key !== "Shift") cut(); };
    const reduce = () => { if (still.matches) stop(true, false); };
    drop = cut;

    controls?.addEventListener("pointerdown", cut, true);
    controls?.addEventListener("touchstart", cut, { capture: true, passive: true });
    controls?.addEventListener("keydown", key, true);
    still.addEventListener("change", reduce);

    run.start();
    root.dataset.first = "ready";
    // A model's own load-time wording of the default (set a tick after its script) would be stale
    // while the control sits at the start value: drop it until the run ends and says the new one.
    setTimeout(() => { if (!over) controls?.querySelector("input[type=range]")?.removeAttribute("aria-valuetext"); }, 60);

    const go = () => {
      if (over) return;
      let t0 = 0;
      const tick = (now: number) => {
        if (!t0) t0 = now;
        const p = Math.min(1, (now - t0) / (run.duration * 1000));
        if (p >= 1) return stop(true, false);
        run.frame(p);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (waitForView && "IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io!.disconnect(); go(); } }, { threshold: 0.5 });
      io.observe(stage);
    } else go();
  };

  if (root.dataset.first === "wait") {
    if (still.matches) delete root.dataset.first; else play(true);
  }
  return {
    replay() {
      drop?.();
      if (still.matches) { run.frame(1); run.end(false); } else play(false);
    },
  };
}

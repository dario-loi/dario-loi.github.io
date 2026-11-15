// Event tracking and the email link, by delegation, so any element can opt in with attributes.
//
//   data-track="cv-download"          event name sent to Umami
//   data-track-placement="home-mast"  where on the page the element sits
//   data-track-label="arXiv"          optional: which of several similar links
//
// Every event also carries the page it fired on and where the visitor came from: "direct",
// another site's host name, or "internal:/path" for a page on this site. Nothing is stored in
// the browser; when Umami is absent (no id, blocked) the call is a no-op. The
// returned promise settles once Umami has sent the event, for a page that leaves right after.
type Umami = { track: (name: string, data?: Record<string, string>) => Promise<unknown> | void };
declare global { interface Window { umami?: Umami } }

function source() {
  const ref = document.referrer;
  if (!ref) return "direct";
  try {
    const u = new URL(ref);
    return u.hostname === location.hostname ? `internal:${u.pathname}` : u.hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

function campaign() {
  const p = new URLSearchParams(location.search);
  const out: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign"]) {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 100);
  }
  return out;
}

export function track(name: string, el?: HTMLElement, extra?: Record<string, string>) {
  const data: Record<string, string> = { page: location.pathname, source: source(), ...campaign() };
  if (el?.dataset.trackPlacement) data.placement = el.dataset.trackPlacement;
  if (el?.dataset.trackLabel) data.label = el.dataset.trackLabel;
  for (const [k, v] of Object.entries(extra ?? {})) data[k] = v.slice(0, 100);
  try { return window.umami?.track(name, data); } catch {}
}

// The address is never whole in the HTML: [data-email-user] and [data-email-domain] are joined
// into a mailto the moment the link is about to be used (pointer, keyboard focus, or click).
function arm(el: HTMLAnchorElement) {
  const { emailUser: user, emailDomain: domain } = el.dataset;
  if (user && domain && !el.href.startsWith("mailto:")) el.href = `mailto:${user}@${domain}`;
}
for (const type of ["pointerdown", "focusin"] as const) {
  document.addEventListener(type, (e) => {
    const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[data-email-user]");
    if (a) arm(a);
  });
}

document.addEventListener("click", (e) => {
  const target = e.target as Element | null;
  const mail = target?.closest?.<HTMLAnchorElement>("a[data-email-user]");
  if (mail) arm(mail);
  const el = target?.closest?.<HTMLElement>("[data-track]");
  if (el?.dataset.track) { track(el.dataset.track, el); return; }
  // An external link nobody tagged: report where it goes (host name only).
  const a = target?.closest?.<HTMLAnchorElement>("a[href]");
  if (a && /^https?:$/.test(a.protocol) && a.hostname !== location.hostname) {
    const place = a.closest<HTMLElement>("[data-track-placement]")?.dataset.trackPlacement;
    track("outbound", undefined, { label: a.hostname.replace(/^www\./, ""), ...(place ? { placement: place } : {}) });
  }
});

// The first real use of each interactive figure (a [data-model] root), once per figure per page view.
const touched = new WeakSet<Element>();
function touch(e: Event) {
  if (e.type === "keydown" && ["Tab", "Shift"].includes((e as KeyboardEvent).key)) return;
  const fig = (e.target as Element | null)?.closest?.<HTMLElement>("[data-model]");
  if (!fig || touched.has(fig)) return;
  touched.add(fig);
  track("widget-interact", undefined, { label: fig.dataset.model ?? "" });
}
for (const type of ["pointerdown", "keydown", "change"]) document.addEventListener(type, touch, true);

// The theme switch: report the theme it left the page in (read after the switch's own handler runs).
document.addEventListener("click", (e) => {
  if (!(e.target as Element | null)?.closest?.("[data-ply-theme-toggle]")) return;
  setTimeout(() => track("theme-toggle", undefined, { label: document.documentElement.dataset.theme ?? "" }), 0);
});

// End of an article: once per page view, when the sentinel after the prose scrolls into view. A page
// short enough that the sentinel is on screen at load, with no scroll, does not count.
const end = document.querySelector<HTMLElement>("[data-read-end]");
if (end && "IntersectionObserver" in window) {
  let first = true;
  const io = new IntersectionObserver((entries) => {
    const hit = entries.some((x) => x.isIntersecting);
    if (first) { first = false; if (hit) { io.disconnect(); return; } return; }
    if (hit) { io.disconnect(); track("read-end", undefined, { label: end.dataset.readEnd ?? "" }); }
  });
  io.observe(end);
}

// Site search (Polytope's <ply-search> in the top bar, and the results page, which reports the same
// events). Only what the events carry is sent: that the field was used, how many results a query
// settled on (a bucket), and which page kind and path a result led to. The query text is never in
// an event, and never read here.
const BUCKETS = new Set(["0", "1-5", "6+"]);
const detailOf = (e: Event) => ((e as CustomEvent).detail ?? {}) as Record<string, unknown>;
document.addEventListener("ply-search:open", () => track("search-open"));
document.addEventListener("ply-search:results", (e) => {
  const bucket = String(detailOf(e).bucket ?? "");
  if (BUCKETS.has(bucket)) track("search-results", undefined, { bucket });
});
document.addEventListener("ply-search:select", (e) => {
  const { url, kind } = detailOf(e);
  // The path only: a query string would be the reader's words.
  const path = String(url ?? "").split("?")[0];
  track("search-select", undefined, { kind: String(kind ?? ""), label: path });
});

/** The 404 page: send `not-found` once Umami exists (its script is deferred), for up to 5 seconds. */
export function notFound() {
  let tries = 0;
  const t = setInterval(() => {
    if (window.umami) { clearInterval(t); track("not-found", undefined, { path: location.pathname }); }
    else if (++tries > 20) clearInterval(t);
  }, 250);
}

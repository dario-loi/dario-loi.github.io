// Event tracking and the email link, by delegation, so any element can opt in with attributes.
//
//   data-track="cv-download"          event name sent to Umami
//   data-track-placement="home-mast"  where on the page the element sits
//   data-track-label="arXiv"          optional: which of several similar links
//
// Every event also carries the page it fired on and where the visitor came from: "direct",
// another site's host name, or "internal:/path" for a page on this site. Nothing is stored in
// the browser; when Umami is absent (no id, blocked, Do Not Track) the call is a no-op. The
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

export function track(name: string, el?: HTMLElement) {
  const data: Record<string, string> = { page: location.pathname, source: source(), ...campaign() };
  if (el?.dataset.trackPlacement) data.placement = el.dataset.trackPlacement;
  if (el?.dataset.trackLabel) data.label = el.dataset.trackLabel;
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
  if (el?.dataset.track) track(el.dataset.track, el);
});

#!/usr/bin/env node
// The paper PDFs the site hosts, and the sources they were copied from.
//
// Each hosted PDF, public/publications/<id>/<id>.pdf, has a record beside its entry,
// src/content/publications/<id>.pdf.json, that says where it came from and which version of the
// source it is:
//   source   the PDF's address at the publisher, the lab, or arXiv
//   check    "arxiv": compare the arXiv version. "hash": compare the source file's SHA-256.
//            "manual": a script cannot fetch the source (OpenReview's bot check), so it is skipped
//   arxiv    with "arxiv": the identifier and version copied, such as "2510.22593v1"
//   sha256   the SHA-256 of the source file as downloaded, before compression
//   fetched  the day it was copied
//   notes    anything a sync does not repeat on its own
//
//   npm run papers:check                        which sources changed since their copy
//   npm run papers:check -- --markdown          the same, as the body of the weekly issue
//   npm run papers:sync -- <id>                 copy the source again, compress it, update the record
//   npm run papers:sync -- <id> --from <file>   the same from a PDF downloaded by hand
//   npm run papers:sync -- <id> --source <url>  a paper's first copy, which creates its record
//
// check exits 0 when every copy is current, 1 when a source changed, and 2 when a source could
// not be read and none changed.
//
// A sync compresses with Ghostscript at full resolution and the highest JPEG quality: images keep
// their pixels, lossless ones become near-lossless JPEG, and text and fonts stay text. Ghostscript
// leaves palette images as they are, so scripts/pdf-palette.py then re-encodes the large ones,
// when a Python with pikepdf is at hand. The smaller of the result and the source is kept.
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const ENTRIES = "src/content/publications";
const UA = "dario-loi.github.io paper check (+https://github.com/dario-loi/dario-loi.github.io)";
const GS = [
  "-q", "-dSAFER", "-dNOPAUSE", "-dBATCH", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.7", "-dPDFSETTINGS=/prepress",
  "-dDownsampleColorImages=false", "-dDownsampleGrayImages=false", "-dDownsampleMonoImages=false",
  "-dAutoFilterColorImages=false", "-dColorImageFilter=/DCTEncode", "-dAutoFilterGrayImages=false", "-dGrayImageFilter=/DCTEncode",
  "-dPassThroughJPEGImages=true",
];
// JPEG at QFactor 0.15 with no chroma subsampling: the highest quality Ghostscript writes.
const QUALITY = "<< /ColorImageDict << /QFactor 0.15 /Blend 1 /HSamples [1 1 1 1] /VSamples [1 1 1 1] >> /GrayImageDict << /QFactor 0.15 /Blend 1 /HSamples [1 1 1 1] /VSamples [1 1 1 1] >> >> setdistillerparams";

const recordPath = (id) => join(ENTRIES, `${id}.pdf.json`);
const readRecord = (id) => JSON.parse(readFileSync(recordPath(id), "utf8"));
const writeRecord = (id, r) => writeFileSync(recordPath(id), `${JSON.stringify(r, null, 2)}\n`);
const ids = () => readdirSync(ENTRIES).filter((f) => f.endsWith(".pdf.json")).map((f) => f.slice(0, -".pdf.json".length)).sort();
const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const today = () => new Date().toISOString().slice(0, 10);
const baseId = (arxiv) => arxiv.replace(/v\d+$/, "");
const mb = (n) => `${(n / 1e6).toFixed(1)} MB`;

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// The newest version of an arXiv paper, from the export API.
async function latestArxiv(arxiv) {
  const xml = (await get(`https://export.arxiv.org/api/query?id_list=${baseId(arxiv)}`)).toString("utf8");
  const m = xml.match(/<entry>[\s\S]*?<id>https?:\/\/arxiv\.org\/abs\/([^<\s]+)<\/id>/);
  if (!m) throw new Error(`arXiv has no entry for ${arxiv}`);
  return m[1];
}

async function status(id) {
  const r = readRecord(id);
  if (r.check === "manual") return { id, state: "manual", detail: `check by hand: ${r.source}` };
  try {
    if (r.check === "arxiv") {
      const latest = await latestArxiv(r.arxiv);
      return latest === r.arxiv ? { id, state: "current", detail: r.arxiv } : { id, state: "changed", detail: `${r.arxiv} -> ${latest}` };
    }
    const now = sha256(await get(r.source));
    return now === r.sha256 ? { id, state: "current", detail: `copied ${r.fetched}` } : { id, state: "changed", detail: `the file at ${r.source} changed since ${r.fetched}` };
  } catch (e) {
    return { id, state: "error", detail: e.message };
  }
}

async function check(markdown) {
  const all = [];
  for (const id of ids()) {
    all.push(await status(id));
    // arXiv asks for one API call every three seconds.
    if (readRecord(id).check === "arxiv") await new Promise((r) => setTimeout(r, 3000));
  }
  const changed = all.filter((s) => s.state === "changed");
  const errors = all.filter((s) => s.state === "error");
  if (markdown) {
    console.log("A paper's source has a newer version than the PDF this site hosts. Look at the new version, then copy it in:\n");
    console.log("```sh\nnpm run papers:sync -- <id>\n```\n");
    console.log("| Paper | State | Detail |\n| --- | --- | --- |");
    for (const s of all) console.log(`| \`${s.id}\` | ${s.state} | ${s.detail.replace(/\|/g, "\\|")} |`);
  } else {
    for (const s of all) console.log(`${s.state.padEnd(8)} ${s.id}: ${s.detail}`);
  }
  return changed.length > 0 ? 1 : errors.length > 0 ? 2 : 0;
}

// A Python that has pikepdf and Pillow, for the palette step: PAPERS_PYTHON, the project's .venv,
// or the system's.
function python() {
  for (const py of [process.env.PAPERS_PYTHON, ".venv/bin/python", "python3"].filter(Boolean)) {
    try {
      execFileSync(py, ["-c", "import pikepdf, PIL"], { stdio: "ignore" });
      return py;
    } catch {}
  }
  return undefined;
}

function pages(file) {
  try {
    return Number(execFileSync("pdfinfo", [file], { encoding: "utf8" }).match(/^Pages:\s+(\d+)/m)?.[1]);
  } catch {
    return undefined;
  }
}

async function sync(id, opts) {
  const exists = existsSync(recordPath(id));
  if (!exists && !opts.source) throw new Error(`${id} has no record yet: pass --source <url> for its first copy`);
  const r = exists ? readRecord(id) : { file: `public/publications/${id}/${id}.pdf`, source: opts.source, check: /arxiv\.org/.test(opts.source) ? "arxiv" : "hash" };
  if (opts.source) r.source = opts.source;

  let src;
  if (opts.from) src = readFileSync(opts.from);
  else if (r.check === "manual") throw new Error(`${id} is checked by hand: download ${r.source} and pass --from <file>`);
  else if (r.check === "arxiv") {
    const m = r.source.match(/arxiv\.org\/(?:abs|pdf)\/([^?#\s]+?)(?:\.pdf)?$/);
    r.arxiv = await latestArxiv(r.arxiv ?? m?.[1] ?? "");
    src = await get(`https://arxiv.org/pdf/${r.arxiv}`);
  } else src = await get(r.source);
  if (src.subarray(0, 5).toString() !== "%PDF-") throw new Error(`${id}: the source is not a PDF`);

  const tmp = join(tmpdir(), `papers-${id}-${process.pid}`);
  const [input, gsOut, paletteOut] = [`${tmp}.in.pdf`, `${tmp}.gs.pdf`, `${tmp}.palette.pdf`];
  let small;
  try {
    writeFileSync(input, src);
    execFileSync("gs", [...GS, `-sOutputFile=${gsOut}`, "-c", QUALITY, "-f", input], { stdio: "inherit" });
    let out = gsOut;
    const py = python();
    if (py) {
      execFileSync(py, ["scripts/pdf-palette.py", gsOut, paletteOut], { stdio: "inherit" });
      if (statSync(paletteOut).size < statSync(gsOut).size) out = paletteOut;
    } else console.warn("Palette images were left as they are: scripts/pdf-palette.py needs pikepdf and Pillow (python3 -m venv .venv && .venv/bin/pip install pikepdf pillow).");
    const before = pages(input), after = pages(out);
    if (before !== undefined && before !== after) throw new Error(`${id}: compression changed the page count (${before} -> ${after})`);
    if (before === undefined) console.warn("pdfinfo (poppler) is not installed, so the page count was not compared.");
    small = statSync(out).size < src.length;
    mkdirSync(dirname(r.file), { recursive: true });
    copyFileSync(small ? out : input, r.file);
  } finally {
    for (const f of [input, gsOut, paletteOut]) rmSync(f, { force: true });
  }

  Object.assign(r, { sha256: sha256(src), fetched: today() });
  writeRecord(id, r);
  console.log(`${id}: ${mb(src.length)} -> ${mb(statSync(r.file).size)}${small ? "" : " (compression did not help, kept the source)"}, ${r.file}`);
  if (r.notes) console.log(`notes: ${r.notes}`);
  if (!exists) console.log(`Point the entry at it: pdf: "/${r.file.replace(/^public\//, "")}"`);
}

const [cmd, ...rest] = process.argv.slice(2);
const flag = (name) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : undefined;
};
try {
  if (cmd === "check") process.exitCode = await check(rest.includes("--markdown"));
  else if (cmd === "sync" && rest[0] && !rest[0].startsWith("--")) await sync(rest[0], { from: flag("--from"), source: flag("--source") });
  else {
    console.error("usage: papers.mjs check [--markdown] | sync <id> [--from <file>] [--source <url>]");
    process.exitCode = 2;
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 2;
}

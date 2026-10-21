#!/usr/bin/env node
// IndexNow (https://www.indexnow.org): tells Bing, Yandex, Seznam, Naver, and Yep which pages
// changed, so they recrawl them without waiting. Google does not take part.
//
// The key is public: public/<key>.txt holds it, and a search engine reads that file to check
// that a submission comes from the site. A script finds the key by that file's name.
//
//   node scripts/indexnow.mjs changed          URLs in dist/'s sitemap that are new or have a new
//                                              lastmod against the live sitemap, and URLs the live
//                                              one lists that dist/ dropped, one a line
//   node scripts/indexnow.mjs changed --all    every URL in dist/'s sitemap
//   node scripts/indexnow.mjs submit < urls    send the URLs to IndexNow
//
// The deploy workflow runs `changed` before the new build goes live and `submit` after it has.
// When the live sitemap cannot be read, `changed` lists every URL.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://dario-loi.github.io";
const DIST = "dist";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const key = () => {
  const file = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (!file) throw new Error("no IndexNow key file (public/<32 hex digits>.txt)");
  const k = readFileSync(join("public", file), "utf8").trim();
  if (`${k}.txt` !== file) throw new Error(`public/${file} does not hold its own name`);
  return k;
};

const tags = (xml, tag) => [...xml.matchAll(new RegExp(`<${tag}>([^<]*)</${tag}>`, "g"))].map((m) => m[1].trim());
const entries = (xml) => [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => [tags(m[1], "loc")[0], tags(m[1], "lastmod")[0] ?? ""]);

// Every URL in a sitemap index and the sitemaps it lists, with its lastmod. `read` takes a
// sitemap's address and returns its text.
async function sitemap(read) {
  const index = await read(`${SITE}/sitemap-index.xml`);
  const out = new Map();
  for (const loc of tags(index, "loc")) for (const [url, mod] of entries(await read(loc))) out.set(url, mod);
  return out;
}

const fromDist = async (url) => readFileSync(join(DIST, new URL(url).pathname), "utf8");
async function fromLive(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

async function changed(all) {
  const next = await sitemap(fromDist);
  if (all) return [...next.keys()];
  let live;
  try {
    live = await sitemap(fromLive);
  } catch (e) {
    console.error(`The live sitemap could not be read (${e.message}), so every URL is listed.`);
    return [...next.keys()];
  }
  const updated = [...next].filter(([url, mod]) => live.get(url) !== mod).map(([url]) => url);
  const removed = [...live.keys()].filter((url) => !next.has(url));
  return [...updated, ...removed];
}

async function submit(urls) {
  if (urls.length === 0) return console.log("Nothing to submit.");
  const k = key();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(SITE).host, key: k, keyLocation: `${SITE}/${k}.txt`, urlList: urls }),
  });
  // 200: accepted. 202: accepted, the key is still being checked.
  if (res.status !== 200 && res.status !== 202) throw new Error(`IndexNow answered HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  console.log(`Submitted ${urls.length} URL${urls.length === 1 ? "" : "s"} (HTTP ${res.status}):\n${urls.join("\n")}`);
}

const [cmd, ...rest] = process.argv.slice(2);
try {
  if (cmd === "changed") (await changed(rest.includes("--all"))).forEach((u) => console.log(u));
  else if (cmd === "submit") await submit(readFileSync(0, "utf8").split("\n").map((s) => s.trim()).filter((s) => s.startsWith(`${SITE}/`)));
  else {
    console.error("usage: indexnow.mjs changed [--all] | submit < urls");
    process.exitCode = 2;
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}

// Election Night Bingo backend (Netlify Function + Netlify Blobs).
// Routes, all under /api/bingo?action=...
//   GET  state                -> { called: [squareIndex...] }            (public)
//   POST deal  {name,email}   -> { id }  one card per email               (public)
//   GET  card&id=...          -> { id, name, squares }                    (public, no email)
//   POST call  {called:[...]} -> { called }        needs x-host-key header
//   GET  winners              -> { players, online:[...], printed:[...] } needs x-host-key
import { getStore } from "@netlify/blobs";
import { printed, squareCount } from "./bingo-data.mjs";

// SHA-256 of the host passphrase. The passphrase itself is never stored in this public repo.
const HOST_KEY_HASH = "e94848e1698fbefd9430e58471f6498f9eac7e4f3fe091dc3a3bf305827802d4";
const N = squareCount;

const LINES = [];
for (let i = 0; i < 5; i++) {
  LINES.push([0, 1, 2, 3, 4].map((j) => i * 5 + j));
  LINES.push([0, 1, 2, 3, 4].map((j) => j * 5 + i));
}
LINES.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);

// card squares (24 indices) -> 25 grid positions, center (12) is free
function hasBingo(cardSquares, calledSet) {
  const grid = [];
  let k = 0;
  for (let p = 0; p < 25; p++) grid.push(p === 12 ? -1 : cardSquares[k++]);
  return LINES.some((line) => line.every((p) => grid[p] === -1 || calledSet.has(grid[p])));
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function randomId() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
}

function dealSquares() {
  const idx = [...Array(N).keys()];
  for (let i = idx.length - 1; i > 0; i--) {
    const r = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [idx[i], idx[r]] = [idx[r], idx[i]];
  }
  return idx.slice(0, 24);
}

async function isHost(req) {
  const key = req.headers.get("x-host-key") || "";
  return key && (await sha256(key.trim())) === HOST_KEY_HASH;
}

async function getCalled(store) {
  return (await store.get("called", { type: "json" })) || [];
}

export default async (req) => {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const store = getStore({ name: "election-bingo-2026", consistency: "strong" });

  try {
    if (action === "state" && req.method === "GET") {
      return json({ called: await getCalled(store) });
    }

    if (action === "deal" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const name = String(body.name || "").trim().slice(0, 40);
      const email = String(body.email || "").trim().toLowerCase().slice(0, 120);
      if (!name) return json({ error: "Add your first name." }, 400);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "That email doesn't look right." }, 400);
      const emailKey = "email/" + (await sha256(email));
      const existing = await store.get(emailKey);
      if (existing) return json({ id: existing, returning: true });
      const id = randomId();
      await store.setJSON("card/" + id, { id, name, email, squares: dealSquares(), created: new Date().toISOString() });
      await store.set(emailKey, id);
      return json({ id });
    }

    if (action === "card" && req.method === "GET") {
      const id = (url.searchParams.get("id") || "").replace(/[^a-z0-9]/g, "");
      const card = id && (await store.get("card/" + id, { type: "json" }));
      if (!card) return json({ error: "We couldn't find that card." }, 404);
      return json({ id: card.id, name: card.name, squares: card.squares });
    }

    if (action === "call" && req.method === "POST") {
      if (!(await isHost(req))) return json({ error: "Wrong host passphrase." }, 401);
      const body = await req.json().catch(() => ({}));
      const called = [...new Set((body.called || []).map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n < N))];
      await store.setJSON("called", called);
      return json({ called });
    }

    if (action === "winners" && req.method === "GET") {
      if (!(await isHost(req))) return json({ error: "Wrong host passphrase." }, 401);
      const calledSet = new Set(await getCalled(store));
      const { blobs } = await store.list({ prefix: "card/" });
      const cards = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
      const online = cards
        .filter((c) => c && hasBingo(c.squares, calledSet))
        .map((c) => ({ id: c.id, name: c.name, email: c.email }));
      const printedWinners = printed
        .map((sq, i) => (hasBingo(sq, calledSet) ? i + 1 : null))
        .filter(Boolean);
      return json({ players: cards.length, online, printed: printedWinners });
    }

    return json({ error: "Unknown request." }, 404);
  } catch (e) {
    console.log("bingo error", e?.stack || e);
    return json({ error: "Something went wrong on our end. Try again in a moment." }, 500);
  }
};

export const config = { path: "/api/bingo" };

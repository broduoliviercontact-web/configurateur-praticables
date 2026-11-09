// Modèles de scène du mode Simple, partagés par l'équipe : un seul fichier (presets.json) dans le même stockage Blob.
// Ajout et suppression faits côté serveur avec écriture conditionnelle (ETag), pour ne pas écraser un ajout fait ailleurs.
import { put, get, BlobPreconditionFailedError, BlobNotFoundError } from "@vercel/blob";

const ACCESS = process.env.BLOB_ACCESS === "public" ? "public" : "private";
const FILE = "configurateur-praticables/presets.json";
const ID = /^[a-z0-9]{6,24}$/;
const MAX = 100;

const send = (res, code, body) => { res.setHeader("Cache-Control", "no-store"); res.status(code).json(body); };

async function readList() {
  let r;
  try { r = await get(FILE, { access: ACCESS, useCache: false }); }
  catch (e) { if (e instanceof BlobNotFoundError) return { list: [], etag: null }; throw e; }
  if (!r || !r.stream) return { list: [], etag: null };
  const j = JSON.parse(await new Response(r.stream).text());
  return { list: Array.isArray(j.presets) ? j.presets : [], etag: r.blob.etag };
}

async function update(fn) {
  for (let i = 0; i < 5; i++) {
    const { list, etag } = await readList();
    const next = fn(list);
    try {
      await put(FILE, JSON.stringify({ presets: next }), {
        access: ACCESS, contentType: "application/json", addRandomSuffix: false, cacheControlMaxAge: 60,
        ...(etag ? { ifMatch: etag } : {}),
      });
      return next;
    } catch (e) {
      if (!(e instanceof BlobPreconditionFailedError) && !/already exists/i.test(String(e?.message))) throw e;
    }
  }
  throw new Error("modèles occupés, réessaie");
}

// un modèle : {id, name, t, cfg:{w,d,h,...}} ; cfg est revérifié par la page au chargement
function clean(p) {
  if (!p || typeof p !== "object" || !ID.test(String(p.id)) || !p.cfg || typeof p.cfg !== "object") return null;
  const cfg = JSON.parse(JSON.stringify(p.cfg));
  if (JSON.stringify(cfg).length > 4000) return null;
  return { id: p.id, name: String(p.name || "Modèle").slice(0, 60), t: Date.now(), cfg };
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") return send(res, 200, { presets: (await readList()).list });
    if (req.method === "POST") {
      const b = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const p = clean(b);
      if (!p) return send(res, 400, { error: "modèle invalide" });
      const list = await update(l => [p, ...l.filter(x => x.id !== p.id)].slice(0, MAX));
      return send(res, 200, { presets: list });
    }
    if (req.method === "DELETE") {
      const id = String(req.query.id || "");
      if (!ID.test(id)) return send(res, 400, { error: "identifiant invalide" });
      const list = await update(l => l.filter(x => x.id !== id));
      return send(res, 200, { presets: list });
    }
    res.setHeader("Allow", "GET, POST, DELETE");
    return send(res, 405, { error: "méthode non prise en charge" });
  } catch (e) {
    const missing = !process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN;
    return send(res, missing ? 503 : 500, { error: missing ? "stockage en ligne non configuré" : "erreur du stockage en ligne" });
  }
}

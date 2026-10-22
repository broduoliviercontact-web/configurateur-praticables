// Projets en ligne : stockage Vercel Blob privé, relié au projet Vercel (BLOB_STORE_ID + OIDC, ou BLOB_READ_WRITE_TOKEN).
// Store public : ajouter la variable BLOB_ACCESS=public.
// Un fichier par projet (projects/<id>.json) + un index (projects/index.json) pour la liste.
// Écritures conditionnelles (ETag) : un projet modifié ailleurs entre-temps renvoie 409 au lieu d'être écrasé.
import { put, get, del, BlobPreconditionFailedError, BlobNotFoundError } from "@vercel/blob";

const ACCESS = process.env.BLOB_ACCESS === "public" ? "public" : "private";
const INDEX = "projects/index.json";
const ID = /^[a-z0-9]{6,24}$/;
const MAX_BYTES = 2_000_000;

const send = (res, code, body) => { res.setHeader("Cache-Control", "no-store"); res.status(code).json(body); };

async function readJson(pathname) {
  let r;
  try { r = await get(pathname, { access: ACCESS, useCache: false }); }
  catch (e) { if (e instanceof BlobNotFoundError) return null; throw e; }
  if (!r || !r.stream) return null;
  return { json: JSON.parse(await new Response(r.stream).text()), etag: r.blob.etag };
}
const write = (pathname, obj, etag) => put(pathname, JSON.stringify(obj), {
  access: ACCESS, contentType: "application/json", addRandomSuffix: false, cacheControlMaxAge: 60,
  ...(etag ? { ifMatch: etag } : { allowOverwrite: true }),
});

// met à jour l'index (nouvelle tentative si un autre enregistrement l'a modifié au même moment)
async function updateIndex(fn) {
  for (let i = 0; i < 5; i++) {
    const cur = await readJson(INDEX);
    const list = Array.isArray(cur?.json?.projects) ? cur.json.projects : [];
    try {
      if (cur) await write(INDEX, { projects: fn(list) }, cur.etag);
      else await put(INDEX, JSON.stringify({ projects: fn(list) }), { access: ACCESS, contentType: "application/json", addRandomSuffix: false, cacheControlMaxAge: 60 });
      return;
    } catch (e) {
      if (!(e instanceof BlobPreconditionFailedError) && !/already exists/i.test(String(e?.message))) throw e;
    }
  }
  throw new Error("index occupé, réessaie");
}

export default async function handler(req, res) {
  try {
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (id && !ID.test(id)) return send(res, 400, { error: "identifiant invalide" });

    if (req.method === "GET" && !id) {
      const cur = await readJson(INDEX);
      const projects = (cur?.json?.projects || []).sort((a, b) => b.t - a.t);
      return send(res, 200, { projects });
    }
    if (req.method === "GET") {
      const cur = await readJson(`projects/${id}.json`);
      if (!cur) return send(res, 404, { error: "projet introuvable" });
      return send(res, 200, { ...cur.json, etag: cur.etag });
    }
    if (req.method === "PUT") {
      const b = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      if (!b.data || typeof b.data !== "object" || !Array.isArray(b.data.plats)) return send(res, 400, { error: "projet invalide" });
      const name = String(b.name || b.data.name || "Sans nom").slice(0, 80), t = Date.now();
      const doc = { id, name, t, n: b.data.plats.length, data: b.data };
      if (JSON.stringify(doc).length > MAX_BYTES) return send(res, 413, { error: "projet trop lourd" });
      let r;
      try {
        if (b.etag) r = await write(`projects/${id}.json`, doc, b.etag);
        else if (b.force) r = await write(`projects/${id}.json`, doc);
        else r = await put(`projects/${id}.json`, JSON.stringify(doc), { access: ACCESS, contentType: "application/json", addRandomSuffix: false, cacheControlMaxAge: 60 });
      } catch (e) {
        if (e instanceof BlobPreconditionFailedError || /already exists/i.test(String(e?.message))) {
          const cur = await readJson(`projects/${id}.json`);
          return send(res, 409, { error: "modifié ailleurs", remote: cur ? { ...cur.json, etag: cur.etag } : null });
        }
        throw e;
      }
      await updateIndex(list => [{ id, name, t, n: doc.n }, ...list.filter(p => p.id !== id)].slice(0, 500));
      return send(res, 200, { id, t, etag: r.etag });
    }
    if (req.method === "DELETE") {
      await del(`projects/${id}.json`).catch(() => {});
      await updateIndex(list => list.filter(p => p.id !== id));
      return send(res, 200, { ok: true });
    }
    res.setHeader("Allow", "GET, PUT, DELETE");
    return send(res, 405, { error: "méthode non prise en charge" });
  } catch (e) {
    // le stockage relié au projet fournit BLOB_STORE_ID (accès OIDC, par défaut) et/ou BLOB_READ_WRITE_TOKEN
    const missing = !process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN;
    return send(res, missing ? 503 : 500, { error: missing ? "stockage en ligne non configuré" : "erreur du stockage en ligne" });
  }
}

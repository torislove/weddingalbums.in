import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'content.sqlite');
const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    type TEXT DEFAULT 'image',
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS contents (
    key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updatedAt TEXT
  );
`);

class Query {
  constructor(executor) {
    this._executor = executor;
  }
  sort(fields) { return this; }
  limit(n) { return this; }
  skip(n) { return this; }
  then(resolve, reject) {
    try { resolve(this._executor()); }
    catch (err) { reject(err); }
  }
  catch(reject) {
    return Promise.resolve(this).catch(reject);
  }
}

function nowIso() { return new Date().toISOString(); }

export const Media = {
  create: async (doc) => {
    const id = crypto.randomUUID();
    const stmt = db.prepare('INSERT INTO media (id, url, type, createdAt) VALUES (?, ?, ?, ?)');
    stmt.run(id, doc.url, doc.type || 'image', nowIso());
    return { ...doc, _id: id, id, createdAt: nowIso() };
  },
  find: (query = {}) => {
    return new Query(() => {
      let sql = 'SELECT * FROM media';
      let args = [];
      if (query.type) {
        sql += ' WHERE type = ?';
        args.push(query.type);
      }
      sql += ' ORDER BY createdAt DESC';
      const rows = db.prepare(sql).all(...args);
      return rows.map(r => ({ ...r, _id: r.id }));
    });
  }
};

export const Content = {
  findOne: async (query) => {
    const stmt = db.prepare('SELECT * FROM contents WHERE key = ?');
    const row = stmt.get(query.key);
    if (!row) return null;
    return { _id: row.key, key: row.key, data: JSON.parse(row.data) };
  },
  findOneAndUpdate: async (query, update, options) => {
    const stmt = db.prepare('INSERT INTO contents (key, data, updatedAt) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET data = ?, updatedAt = ?');
    const dataStr = JSON.stringify(update.data);
    const now = nowIso();
    stmt.run(query.key, dataStr, now, dataStr, now);
    return { _id: query.key, key: query.key, data: update.data };
  }
};

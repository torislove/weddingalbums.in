import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.SQLITE_DB_PATH 
  ? path.resolve(__dirname, process.env.SQLITE_DB_PATH)
  : path.join(__dirname, 'business.sqlite');

const db = new DatabaseSync(dbPath);

// Enable WAL mode for high concurrency & performance
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
`);

// ==========================================
// TABLE SCHEMAS
// ==========================================
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    wallet_balance REAL DEFAULT 0,
    phone TEXT,
    city TEXT,
    studioName TEXT,
    gstNumber TEXT,
    coupleNames TEXT,
    weddingDate TEXT,
    portfolioLink TEXT,
    specialization TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS payout_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'Pending',
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY,
    tier TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    suffix TEXT,
    features TEXT DEFAULT '[]',
    popular INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    sortOrder INTEGER DEFAULT 0,
    b2bOrB2c TEXT NOT NULL,
    color TEXT DEFAULT '#9E9E9E',
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS configs (
    key TEXT PRIMARY KEY,
    options TEXT DEFAULT '[]',
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    status TEXT DEFAULT 'Pending',
    data TEXT NOT NULL,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    createdAt TEXT,
    updatedAt TEXT
  );

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

  CREATE TABLE IF NOT EXISTS contact_leads (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    city TEXT,
    eventType TEXT,
    date TEXT,
    venue TEXT,
    budget TEXT,
    message TEXT,
    createdAt TEXT
  );
`);

// ==========================================
// QUERY THENABLE ADAPTER (Supports .sort(...))
// ==========================================
class Query {
  constructor(executor) {
    this._executor = executor;
  }
  sort(fields) {
    return this;
  }
  limit(n) {
    return this;
  }
  skip(n) {
    return this;
  }
  then(resolve, reject) {
    try {
      const res = this._executor();
      resolve(res);
    } catch (err) {
      reject(err);
    }
  }
  catch(reject) {
    return Promise.resolve(this).catch(reject);
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================
function generateId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

function formatUser(row) {
  if (!row) return null;
  const doc = {
    ...row,
    _id: row.id,
    save: async function() {
      const stmt = db.prepare(`
        UPDATE users 
        SET name = ?, email = ?, password = ?, role = ?, wallet_balance = ?, 
            phone = ?, city = ?, studioName = ?, gstNumber = ?, 
            coupleNames = ?, weddingDate = ?, portfolioLink = ?, specialization = ?, 
            updatedAt = ?
        WHERE id = ?
      `);
      stmt.run(
        this.name, this.email, this.password, this.role, this.wallet_balance,
        this.phone, this.city, this.studioName, this.gstNumber,
        this.coupleNames, this.weddingDate, this.portfolioLink, this.specialization,
        nowIso(), this.id
      );
      return this;
    }
  };
  return doc;
}

function formatPackage(row) {
  if (!row) return null;
  return {
    ...row,
    _id: row.id,
    popular: Boolean(row.popular),
    isActive: Boolean(row.isActive),
    features: typeof row.features === 'string' ? JSON.parse(row.features || '[]') : (row.features || [])
  };
}

function formatConfig(row) {
  if (!row) return null;
  return {
    ...row,
    _id: row.key,
    options: typeof row.options === 'string' ? JSON.parse(row.options || '[]') : (row.options || [])
  };
}

function formatJsonDoc(row) {
  if (!row) return null;
  let parsed = {};
  try {
    parsed = JSON.parse(row.data);
  } catch (e) {
    parsed = {};
  }
  return {
    ...parsed,
    id: row.id,
    _id: row.id,
    status: row.status !== undefined ? row.status : parsed.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

// ==========================================
// MODELS (Mongoose-compatible API)
// ==========================================

export const User = {
  async findOne({ email }) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    const row = stmt.get(email);
    return formatUser(row);
  },

  async findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    const row = stmt.get(id);
    return formatUser(row);
  },

  async create(data) {
    const id = generateId();
    const now = nowIso();
    const stmt = db.prepare(`
      INSERT INTO users (
        id, name, email, password, role, wallet_balance,
        phone, city, studioName, gstNumber,
        coupleNames, weddingDate, portfolioLink, specialization,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.name,
      data.email,
      data.password,
      data.role,
      data.wallet_balance || 0,
      data.phone || null,
      data.city || null,
      data.studioName || null,
      data.gstNumber || null,
      data.coupleNames || null,
      data.weddingDate || null,
      data.portfolioLink || null,
      data.specialization || null,
      now,
      now
    );
    return this.findById(id);
  },

  async countDocuments(filter = {}) {
    if (filter.role) {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?');
      const res = stmt.get(filter.role);
      return res ? Number(res.count) : 0;
    }
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
    const res = stmt.get();
    return res ? Number(res.count) : 0;
  }
};

export const PayoutRequest = {
  async create(data) {
    const id = generateId();
    const now = nowIso();
    const stmt = db.prepare(`
      INSERT INTO payout_requests (id, user_id, amount, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, String(data.user_id), Number(data.amount), data.status || 'Pending', now, now);
    return { id, _id: id, ...data, createdAt: now, updatedAt: now };
  }
};

export const Package = {
  find(filter = {}) {
    return new Query(() => {
      let sql = 'SELECT * FROM packages';
      const params = [];
      const conditions = [];

      if (filter.isActive !== undefined) {
        conditions.push('isActive = ?');
        params.push(filter.isActive ? 1 : 0);
      }

      if (filter.b2bOrB2c) {
        if (filter.b2bOrB2c.$in) {
          const placeholders = filter.b2bOrB2c.$in.map(() => '?').join(',');
          conditions.push(`b2bOrB2c IN (${placeholders})`);
          params.push(...filter.b2bOrB2c.$in);
        } else {
          conditions.push('b2bOrB2c = ?');
          params.push(filter.b2bOrB2c);
        }
      }

      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }

      sql += ' ORDER BY b2bOrB2c ASC, category ASC, sortOrder ASC, id ASC';
      const stmt = db.prepare(sql);
      const rows = stmt.all(...params);
      return rows.map(formatPackage);
    });
  },

  async findById(id) {
    const stmt = db.prepare('SELECT * FROM packages WHERE id = ? LIMIT 1');
    const row = stmt.get(id);
    return formatPackage(row);
  },

  async create(data) {
    const id = generateId();
    const now = nowIso();
    const featuresStr = JSON.stringify(Array.isArray(data.features) ? data.features : []);
    const stmt = db.prepare(`
      INSERT INTO packages (
        id, tier, category, price, suffix, features, popular, isActive, sortOrder, b2bOrB2c, color, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.tier,
      data.category,
      data.price,
      data.suffix || null,
      featuresStr,
      data.popular ? 1 : 0,
      data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
      data.sortOrder || 0,
      data.b2bOrB2c,
      data.color || '#9E9E9E',
      now,
      now
    );
    return this.findById(id);
  },

  async findByIdAndUpdate(id, data, options = {}) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const merged = { ...existing, ...data };
    const featuresStr = JSON.stringify(Array.isArray(merged.features) ? merged.features : []);
    const now = nowIso();

    const stmt = db.prepare(`
      UPDATE packages 
      SET tier = ?, category = ?, price = ?, suffix = ?, features = ?, popular = ?, isActive = ?, sortOrder = ?, b2bOrB2c = ?, color = ?, updatedAt = ?
      WHERE id = ?
    `);
    stmt.run(
      merged.tier,
      merged.category,
      merged.price,
      merged.suffix || null,
      featuresStr,
      merged.popular ? 1 : 0,
      merged.isActive ? 1 : 0,
      merged.sortOrder || 0,
      merged.b2bOrB2c,
      merged.color || '#9E9E9E',
      now,
      id
    );
    return this.findById(id);
  },

  async findByIdAndDelete(id) {
    const stmt = db.prepare('DELETE FROM packages WHERE id = ?');
    stmt.run(id);
    return { success: true };
  },

  async deleteMany() {
    db.exec('DELETE FROM packages');
    return { success: true };
  },

  async insertMany(list) {
    for (const item of list) {
      await this.create(item);
    }
    return true;
  }
};

export const Config = {
  find() {
    return new Query(() => {
      const stmt = db.prepare('SELECT * FROM configs');
      const rows = stmt.all();
      return rows.map(formatConfig);
    });
  },

  async findOne({ key }) {
    const stmt = db.prepare('SELECT * FROM configs WHERE key = ? LIMIT 1');
    const row = stmt.get(key);
    return formatConfig(row);
  },

  async findOneAndUpdate(filter, update, options = {}) {
    const key = filter.key;
    const optionsStr = JSON.stringify(update.options || []);
    const now = nowIso();
    const existing = await this.findOne({ key });

    if (existing) {
      const stmt = db.prepare('UPDATE configs SET options = ?, updatedAt = ? WHERE key = ?');
      stmt.run(optionsStr, now, key);
    } else {
      const stmt = db.prepare('INSERT INTO configs (key, options, createdAt, updatedAt) VALUES (?, ?, ?, ?)');
      stmt.run(key, optionsStr, now, now);
    }
    return this.findOne({ key });
  },

  async deleteMany() {
    db.exec('DELETE FROM configs');
    return { success: true };
  },

  async insertMany(list) {
    for (const item of list) {
      await this.findOneAndUpdate({ key: item.key }, { options: item.options });
    }
    return true;
  }
};

export const Order = {
  find() {
    return new Query(() => {
      const stmt = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC');
      const rows = stmt.all();
      return rows.map(formatJsonDoc);
    });
  },

  async create(data) {
    const id = generateId();
    const now = nowIso();
    const dataStr = JSON.stringify({ ...data, id, _id: id });
    const stmt = db.prepare('INSERT INTO orders (id, data, createdAt, updatedAt) VALUES (?, ?, ?, ?)');
    stmt.run(id, dataStr, now, now);
    return formatJsonDoc({ id, data: dataStr, createdAt: now, updatedAt: now });
  },

  async countDocuments() {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM orders');
    const res = stmt.get();
    return res ? Number(res.count) : 0;
  }
};

export const Task = {
  find() {
    return new Query(() => {
      const stmt = db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC');
      const rows = stmt.all();
      return rows.map(formatJsonDoc);
    });
  },

  async create(data) {
    const id = generateId();
    const now = nowIso();
    const status = data.status || 'Pending';
    const dataStr = JSON.stringify({ ...data, id, _id: id, status });
    const stmt = db.prepare('INSERT INTO tasks (id, status, data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, status, dataStr, now, now);
    return formatJsonDoc({ id, status, data: dataStr, createdAt: now, updatedAt: now });
  },

  async findByIdAndUpdate(id, data, options = {}) {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ? LIMIT 1');
    const row = stmt.get(id);
    if (!row) return null;

    let parsed = {};
    try { parsed = JSON.parse(row.data); } catch(e) {}
    const merged = { ...parsed, ...data, id, _id: id };
    const status = data.status || merged.status || row.status || 'Pending';
    const now = nowIso();
    const updateStmt = db.prepare('UPDATE tasks SET status = ?, data = ?, updatedAt = ? WHERE id = ?');
    updateStmt.run(status, JSON.stringify(merged), now, id);

    return formatJsonDoc({ id, status, data: JSON.stringify(merged), createdAt: row.createdAt, updatedAt: now });
  },

  async countDocuments(filter = {}) {
    if (filter.status && filter.status.$ne) {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE status != ?');
      const res = stmt.get(filter.status.$ne);
      return res ? Number(res.count) : 0;
    }
    const stmt = db.prepare('SELECT COUNT(*) as count FROM tasks');
    const res = stmt.get();
    return res ? Number(res.count) : 0;
  }
};

export const Project = {
  find() {
    return new Query(() => {
      const stmt = db.prepare('SELECT * FROM projects ORDER BY createdAt DESC');
      const rows = stmt.all();
      return rows.map(formatJsonDoc);
    });
  },

  async create(data) {
    const id = generateId();
    const now = nowIso();
    const dataStr = JSON.stringify({ ...data, id, _id: id });
    const stmt = db.prepare('INSERT INTO projects (id, data, createdAt, updatedAt) VALUES (?, ?, ?, ?)');
    stmt.run(id, dataStr, now, now);
    return formatJsonDoc({ id, data: dataStr, createdAt: now, updatedAt: now });
  },

  async countDocuments() {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM projects');
    const res = stmt.get();
    return res ? Number(res.count) : 0;
  }
};

export const Media = {
  find(filter = {}) {
    return new Query(() => {
      let sql = 'SELECT * FROM media';
      const params = [];
      if (filter.type) {
        sql += ' WHERE type = ?';
        params.push(filter.type);
      }
      sql += ' ORDER BY createdAt DESC';
      const stmt = db.prepare(sql);
      const rows = stmt.all(...params);
      return rows.map(r => ({ ...r, _id: r.id }));
    });
  },

  async create(data) {
    const id = generateId();
    const now = nowIso();
    const stmt = db.prepare('INSERT INTO media (id, url, type, createdAt) VALUES (?, ?, ?, ?)');
    stmt.run(id, data.url, data.type || 'image', now);
    return { id, _id: id, ...data, createdAt: now };
  }
};

export const Content = {
  async findOne({ key }) {
    const stmt = db.prepare('SELECT * FROM contents WHERE key = ? LIMIT 1');
    const row = stmt.get(key);
    if (!row) return null;
    let parsed = null;
    try {
      parsed = JSON.parse(row.data);
    } catch(e) {}
    return { key: row.key, data: parsed, _id: row.key };
  },

  async findOneAndUpdate(filter, update, options = {}) {
    const key = filter.key;
    const dataStr = JSON.stringify(update.data || {});
    const now = nowIso();
    const existing = await this.findOne({ key });

    if (existing) {
      const stmt = db.prepare('UPDATE contents SET data = ?, updatedAt = ? WHERE key = ?');
      stmt.run(dataStr, now, key);
    } else {
      const stmt = db.prepare('INSERT INTO contents (key, data, updatedAt) VALUES (?, ?, ?)');
      stmt.run(key, dataStr, now);
    }
    return this.findOne({ key });
  }
};

export const ContactLead = {
  async create(data) {
    const id = generateId();
    const now = nowIso();
    const stmt = db.prepare(`
      INSERT INTO contact_leads (id, name, phone, city, eventType, date, venue, budget, message, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.name || null,
      data.phone || null,
      data.city || null,
      data.eventType || null,
      data.date || null,
      data.venue || null,
      data.budget || null,
      data.message || null,
      now
    );
    return { id, _id: id, ...data, createdAt: now };
  }
};

// ==========================================
// AUTOMATED INITIAL SEEDING
// ==========================================
export async function autoSeedDatabase() {
  try {
    // 1. Seed Super Admin User if none exists
    const adminCheck = db.prepare('SELECT id FROM users WHERE email = ? LIMIT 1').get('admin@weddingalbums.in');
    if (!adminCheck) {
      const hash = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Super Admin',
        email: 'admin@weddingalbums.in',
        password: hash,
        role: 'admin',
        wallet_balance: 10000
      });
      console.log('✅ SQLite: Default Super Admin created (admin@weddingalbums.in / admin123)');
    }

    // 2. Seed Packages if empty
    const packageCount = db.prepare('SELECT COUNT(*) as count FROM packages').get().count;
    if (packageCount === 0) {
      const seedPackages = [
        // B2C Packages
        { tier: 'Starter Memories', category: 'combo', price: '₹2,000', features: ['10x10 Album (10 pages)', 'Basic Color Editing', 'Matte Cover'], popular: false, b2bOrB2c: 'b2c', color: '#9E9E9E' },
        { tier: 'Classic Wedding', category: 'combo', price: '₹9,000', features: ['12x12 Album (30 pages)', 'Advanced Editing (200 photos)', 'Acrylic Cover', 'Layflat Paper'], popular: true, b2bOrB2c: 'b2c', color: '#D4AF37' },
        { tier: 'Premium Cinematic', category: 'combo', price: '₹15,000', features: ['12x18 Album (40 pages)', '3-min Cinematic Teaser Video', 'Pro Editing (300 photos)', 'Leather Cover'], popular: false, b2bOrB2c: 'b2c', color: '#780016' },
        { tier: 'Royal Elite', category: 'combo', price: '₹25,000', features: ['12x18 Flush Mount Album', 'Full Wedding Film (30 min)', '3 Instagram Reels', '500 photos edited'], popular: false, b2bOrB2c: 'b2c', color: '#780016' },
        
        { tier: 'Basic Retouch', category: 'photo', price: '₹99', suffix: '/photo', features: ['Skin smoothing', 'Blemish removal', 'Basic color & brightness fix', '24-hour turnaround'], popular: false, b2bOrB2c: 'b2c', color: '#9E9E9E' },
        { tier: 'Advanced Edit', category: 'photo', price: '₹199', suffix: '/photo', features: ['Full frequency separation', 'Background replacement', 'High-end compositing', 'Subject extraction'], popular: true, b2bOrB2c: 'b2c', color: '#D4AF37' },
        { tier: 'Social Reel', category: 'video', price: '₹2,500', suffix: '/reel', features: ['60-second vertical reel', 'Trending audio sync', 'Cinematic color grade', 'Title cards & transitions'], popular: false, b2bOrB2c: 'b2c', color: '#9E9E9E' },
        { tier: 'Teaser Film', category: 'video', price: '₹8,000', suffix: '/film', features: ['3–5 minute cinematic teaser', 'Full DaVinci color grade', 'Professional audio mix', 'Beat-synced cuts'], popular: true, b2bOrB2c: 'b2c', color: '#D4AF37' },
        
        { tier: 'Standard', category: 'albums', price: '₹7,500', features: ['12x12 Size', 'Matte Cover', 'Glossy Paper', 'Up to 30 Pages', 'Free Delivery'], popular: false, b2bOrB2c: 'b2c', color: '#9E9E9E' },
        { tier: 'Premium', category: 'albums', price: '₹12,000', features: ['12x18 Cinematic Size', 'Acrylic Glass Cover', 'Layflat Paper (No Crease)', 'Custom Design Spreads', 'Premium Box'], popular: true, b2bOrB2c: 'b2c', color: '#D4AF37' },
        
        { tier: 'Welcome Board', category: 'flex', price: '₹1,500', features: ['3x4 ft Standard Size', 'Custom Telugu Typography', 'Photo Integration', 'Print-ready CMYK PDF', '1 Revision'], popular: false, b2bOrB2c: 'b2c', color: '#9E9E9E' },
        { tier: 'Mandap Backdrop', category: 'flex', price: '₹4,500', features: ['Up to 10x20 ft Size', 'Traditional Motif Design', 'High-Res Photo Retouching', 'Unlimited Revisions', 'Fast 24h Delivery'], popular: true, b2bOrB2c: 'b2c', color: '#D4AF37' },

        // B2B Packages
        { tier: 'Studio Basic', category: 'combo', price: '₹2,500', suffix: '/wedding', features: ['Photo editing only (up to 200 photos)', '3-day TAT', 'White-label guarantee'], popular: false, b2bOrB2c: 'b2b', color: '#9E9E9E' },
        { tier: 'Studio Standard', category: 'combo', price: '₹3,500', suffix: '/wedding', features: ['300 photos edited', 'Basic album design', '4-day TAT', 'White-label guarantee'], popular: true, b2bOrB2c: 'b2b', color: '#D4AF37' },
        { tier: 'Studio Pro', category: 'combo', price: '₹6,000', suffix: '/wedding', features: ['500 photos', '1 Cinematic Teaser', 'Album design', '5-day TAT'], popular: false, b2bOrB2c: 'b2b', color: '#780016' },
        { tier: 'Studio Elite', category: 'combo', price: '₹10,000', suffix: '/wedding', features: ['Full post-production', 'Editing + Full Film', 'Album + Flex design', 'VIP Priority'], popular: false, b2bOrB2c: 'b2b', color: '#780016' },
        
        { tier: 'Batch Edit', category: 'photo', price: '₹2,000', suffix: '/300 pics', features: ['Global color correction', 'Cinematic LUT grading', 'Exposure balancing', 'Delivery in 3 days'], popular: true, b2bOrB2c: 'b2b', color: '#D4AF37' },
        { tier: 'Wholesale Album', category: 'albums', price: '₹5,000', suffix: '/album', features: ['12x18 Size', 'Acrylic Cover', 'Layflat Paper', 'Drop-shipped to your client'], popular: true, b2bOrB2c: 'b2b', color: '#D4AF37' },
      ];
      await Package.insertMany(seedPackages);
      console.log('✅ SQLite: Initial packages seeded successfully');
    }

    // 3. Seed Configs if empty
    const configCount = db.prepare('SELECT COUNT(*) as count FROM configs').get().count;
    if (configCount === 0) {
      const seedConfig = [
        { key: 'album_sizes', options: [
          { label: '12x12 inches (Standard Square)', value: '12x12', price: 2000, isFree: false },
          { label: '12x15 inches (Standard Portrait)', value: '12x15', price: 3000, isFree: false },
          { label: '12x18 inches (Classic Panoramic - 12x36 open)', value: '12x18', price: 5000, isFree: false },
          { label: '15x24 inches (Grand Panoramic - 15x48 open)', value: '15x24', price: 8000, isFree: false },
          { label: '17x24 inches (Royal Size)', value: '17x24', price: 12000, isFree: false }
        ]},
        { key: 'sheet_types', options: [
          { label: 'Matte & Glossy (Standard)', value: 'standard', price: 100, isFree: true },
          { label: 'Luster / Satin', value: 'luster', price: 120, isFree: false },
          { label: 'NT (Non-Tearable) - AP Standard', value: 'nt', price: 150, isFree: false },
          { label: 'Metallic / Pearl (3D Shimmer)', value: 'metallic', price: 200, isFree: false },
          { label: 'Velvet / Feather Touch (Scuff-free)', value: 'velvet', price: 250, isFree: false },
          { label: 'Silk / Canvas Texture', value: 'silk', price: 280, isFree: false }
        ]},
        { key: 'cover_types', options: [
          { label: 'Standard Hardcover (Matte/Glossy)', value: 'hardcover', price: 0, isFree: true },
          { label: 'Premium Acrylic (Crystal/Glass)', value: 'acrylic', price: 2000, isFree: false },
          { label: 'Luxury Leather / Faux Leather (Embossed)', value: 'leather', price: 3000, isFree: false },
          { label: 'Wooden / Bamboo Cover (Premium)', value: 'wooden', price: 4000, isFree: false },
          { label: 'Velvet Cover with Gold Foiling', value: 'velvet_cover', price: 2500, isFree: false }
        ]}
      ];
      await Config.insertMany(seedConfig);
      console.log('✅ SQLite: Initial configs seeded successfully');
    }

    // 4. Seed Content from content.json if empty
    const mainContent = await Content.findOne({ key: 'main_site' });
    if (!mainContent || !mainContent.data || Object.keys(mainContent.data).length === 0) {
      const localContentPath = path.join(__dirname, '../client/public/content.json');
      if (fs.existsSync(localContentPath)) {
        const raw = fs.readFileSync(localContentPath, 'utf-8');
        const parsed = JSON.parse(raw);
        await Content.findOneAndUpdate({ key: 'main_site' }, { key: 'main_site', data: parsed });
        console.log('✅ SQLite: Initial site content populated from content.json');
      }
    }
  } catch (err) {
    console.error('SQLite seeding error:', err);
  }
}

export default db;

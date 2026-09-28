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
    coverImage TEXT,
    priceType TEXT DEFAULT 'fixed',
    priceMax TEXT,
    includedServiceIds TEXT DEFAULT '[]',
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

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    basePrice REAL NOT NULL,
    estimatedDaysToDeliver INTEGER DEFAULT 1,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS sheet_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    pricePerSheet REAL NOT NULL,
    premiumCoverSurcharge REAL DEFAULT 0,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS carts (
    id TEXT PRIMARY KEY,
    userId TEXT,
    items TEXT DEFAULT '[]',
    totalAmount REAL DEFAULT 0,
    estimatedDeliveryEta TEXT,
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

  CREATE TABLE IF NOT EXISTS b2b_jobs (
    id TEXT PRIMARY KEY,
    studio_user_id TEXT NOT NULL,
    job_type TEXT NOT NULL,         -- 'photo', 'video', 'album', 'flex', 'print'
    client_name TEXT,
    event_date TEXT,
    event_type TEXT DEFAULT 'Wedding',
    album_size TEXT,
    num_pages INTEGER,
    design_style TEXT,
    instructions TEXT,
    raw_files_link TEXT,
    status TEXT DEFAULT 'Pending',  -- Pending, Assigned, InProgress, QC, Completed, Rejected
    editor_id TEXT,
    editor_type TEXT,               -- 'photo', 'video', 'album'
    deadline_date TEXT,
    is_rush INTEGER DEFAULT 0,
    output_link TEXT,
    rating INTEGER,
    feedback TEXT,
    price_charged REAL,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS editor_payouts (
    id TEXT PRIMARY KEY,
    editor_id TEXT NOT NULL,
    amount REAL NOT NULL,
    upi_id TEXT,
    bank_account TEXT,
    status TEXT DEFAULT 'Pending',  -- Pending, Approved, Paid, Rejected
    approved_by TEXT,
    paid_at TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT,             -- 'percent' or 'flat'
    discount_value REAL,
    min_order_value REAL DEFAULT 0,
    max_uses INTEGER DEFAULT 100,
    used_count INTEGER DEFAULT 0,
    valid_until TEXT,
    applicable_to TEXT DEFAULT 'both', -- 'b2b', 'b2c', 'both'
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    referrer_user_id TEXT NOT NULL,
    referred_user_id TEXT,
    referred_email TEXT,
    status TEXT DEFAULT 'Pending',
    reward_given INTEGER DEFAULT 0,
    createdAt TEXT
  );
`);

// Add new columns to users if they don't exist
try { db.exec("ALTER TABLE users ADD COLUMN editor_type TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN editor_rating REAL DEFAULT 5.0;"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN editor_completed_jobs INTEGER DEFAULT 0;"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN b2b_studio_tier TEXT DEFAULT 'standard';"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN b2b_monthly_volume INTEGER DEFAULT 0;"); } catch (e) {}

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
    features: typeof row.features === 'string' ? JSON.parse(row.features || '[]') : (row.features || []),
    includedServiceIds: typeof row.includedServiceIds === 'string' ? JSON.parse(row.includedServiceIds || '[]') : (row.includedServiceIds || [])
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
    const serviceIdsStr = JSON.stringify(Array.isArray(data.includedServiceIds) ? data.includedServiceIds : []);
    const stmt = db.prepare(`
      INSERT INTO packages (
        id, tier, category, price, suffix, features, popular, isActive, sortOrder, b2bOrB2c, color, coverImage, priceType, priceMax, includedServiceIds, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      data.coverImage || null,
      data.priceType || 'fixed',
      data.priceMax || null,
      serviceIdsStr,
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
    const serviceIdsStr = JSON.stringify(Array.isArray(merged.includedServiceIds) ? merged.includedServiceIds : []);
    const now = nowIso();

    const stmt = db.prepare(`
      UPDATE packages 
      SET tier = ?, category = ?, price = ?, suffix = ?, features = ?, popular = ?, isActive = ?, sortOrder = ?, b2bOrB2c = ?, color = ?, coverImage = ?, priceType = ?, priceMax = ?, includedServiceIds = ?, updatedAt = ?
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
      merged.coverImage || null,
      merged.priceType || 'fixed',
      merged.priceMax || null,
      serviceIdsStr,
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

export const Service = {
  find() {
    return new Query(() => {
      const rows = db.prepare('SELECT * FROM services ORDER BY category, name').all();
      return rows.map(r => ({ ...r, _id: r.id }));
    });
  },
  async create(data) {
    const id = generateId();
    const now = nowIso();
    const stmt = db.prepare('INSERT INTO services (id, category, name, basePrice, estimatedDaysToDeliver, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, data.category, data.name, data.basePrice, data.estimatedDaysToDeliver || 1, now, now);
    return { id, _id: id, ...data, createdAt: now, updatedAt: now };
  },
  async findByIdAndUpdate(id, data) {
    const now = nowIso();
    const stmt = db.prepare('UPDATE services SET category=?, name=?, basePrice=?, estimatedDaysToDeliver=?, updatedAt=? WHERE id=?');
    stmt.run(data.category, data.name, data.basePrice, data.estimatedDaysToDeliver || 1, now, id);
    return { id, _id: id, ...data, updatedAt: now };
  },
  async delete(id) {
    const stmt = db.prepare('DELETE FROM services WHERE id=?');
    stmt.run(id);
    return true;
  }
};

export const SheetType = {
  find() {
    return new Query(() => {
      const rows = db.prepare('SELECT * FROM sheet_types ORDER BY pricePerSheet ASC').all();
      return rows.map(r => ({ ...r, _id: r.id }));
    });
  },
  async create(data) {
    const id = generateId();
    const now = nowIso();
    const stmt = db.prepare('INSERT INTO sheet_types (id, name, pricePerSheet, premiumCoverSurcharge, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(id, data.name, data.pricePerSheet, data.premiumCoverSurcharge || 0, now, now);
    return { id, _id: id, ...data, createdAt: now, updatedAt: now };
  },
  async findByIdAndUpdate(id, data) {
    const now = nowIso();
    const stmt = db.prepare('UPDATE sheet_types SET name=?, pricePerSheet=?, premiumCoverSurcharge=?, updatedAt=? WHERE id=?');
    stmt.run(data.name, data.pricePerSheet, data.premiumCoverSurcharge || 0, now, id);
    return { id, _id: id, ...data, updatedAt: now };
  },
  async delete(id) {
    const stmt = db.prepare('DELETE FROM sheet_types WHERE id=?');
    stmt.run(id);
    return true;
  }
};

export const Cart = {
  async findOne({ userId }) {
    const stmt = db.prepare('SELECT * FROM carts WHERE userId = ? LIMIT 1');
    const row = stmt.get(userId);
    if (!row) return null;
    return { ...row, _id: row.id, items: JSON.parse(row.items) };
  },
  async findOneAndUpdate(filter, update, options = {}) {
    const userId = filter.userId;
    const itemsStr = JSON.stringify(update.items || []);
    const totalAmount = update.totalAmount || 0;
    const eta = update.estimatedDeliveryEta || null;
    const now = nowIso();
    
    const existing = await this.findOne({ userId });
    if (existing) {
      const stmt = db.prepare('UPDATE carts SET items = ?, totalAmount = ?, estimatedDeliveryEta = ?, updatedAt = ? WHERE userId = ?');
      stmt.run(itemsStr, totalAmount, eta, now, userId);
    } else {
      const id = generateId();
      const stmt = db.prepare('INSERT INTO carts (id, userId, items, totalAmount, estimatedDeliveryEta, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
      stmt.run(id, userId, itemsStr, totalAmount, eta, now);
    }
    return this.findOne({ userId });
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

    // 2. Seed Services if empty
    const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
    let seededServices = [];
    if (serviceCount === 0) {
      const seedServices = [
        { category: 'Photography', name: 'Traditional Photography (Per Day)', basePrice: 15000, estimatedDaysToDeliver: 1 },
        { category: 'Photography', name: 'Candid Photography (Per Day)', basePrice: 25000, estimatedDaysToDeliver: 3 },
        { category: 'Photography', name: 'Pre-Wedding Shoot (Outdoor)', basePrice: 35000, estimatedDaysToDeliver: 5 },
        { category: 'Videography', name: 'Traditional Videography (Per Day)', basePrice: 15000, estimatedDaysToDeliver: 2 },
        { category: 'Videography', name: 'Cinematic 1-Min Teaser', basePrice: 8000, estimatedDaysToDeliver: 4 },
        { category: 'Videography', name: 'Cinematic 10-Min Highlights', basePrice: 20000, estimatedDaysToDeliver: 7 },
        { category: 'Videography', name: '1 to 4 Hour Long Video Edit', basePrice: 25000, estimatedDaysToDeliver: 10 },
        { category: 'Drone', name: 'Drone Coverage (Per Day)', basePrice: 12000, estimatedDaysToDeliver: 1 },
        { category: 'Live', name: 'Live Streaming Setup (Youtube)', basePrice: 15000, estimatedDaysToDeliver: 0 },
        { category: 'Editing', name: 'Pro Color Grading (300 pics)', basePrice: 5000, estimatedDaysToDeliver: 3 },
        { category: 'Editing', name: 'Full Wedding Film Editing (Outsource)', basePrice: 15000, estimatedDaysToDeliver: 7 },
      ];
      for (const s of seedServices) {
        seededServices.push(await Service.create(s));
      }
      console.log('✅ SQLite: Initial services seeded successfully');
    } else {
      seededServices = (await Service.find())._executor();
    }

    // 3. Seed Packages if empty
    const packageCount = db.prepare('SELECT COUNT(*) as count FROM packages').get().count;
    if (packageCount === 0) {
      const getSrvIds = (names) => seededServices.filter(s => names.includes(s.name)).map(s => s._id);

      const seedPackages = [
        { 
          tier: 'The Haldi & Mehendi Mini-Shoot', category: 'combo', price: '₹30,000', priceMax: '₹45,000', priceType: 'range', 
          features: ['Candid Photography', '1 Videographer', '50-page small album', 'Edited Reels'], 
          includedServiceIds: getSrvIds(['Candid Photography (Per Day)', 'Traditional Videography (Per Day)', 'Cinematic 1-Min Teaser']),
          popular: false, b2bOrB2c: 'b2c', color: '#f59e0b', coverImage: ''
        },
        { 
          tier: 'Traditional Telugu Muhurtham', category: 'combo', price: '₹85,000', priceType: 'starting_at', 
          features: ['2 Traditional Photographers', '1 Traditional Videographer', 'LED Screens Setup', 'Basic Album (12x15)'], 
          includedServiceIds: getSrvIds(['Traditional Photography (Per Day)', 'Traditional Videography (Per Day)', 'Live Streaming Setup (Youtube)']),
          popular: true, b2bOrB2c: 'b2c', color: '#D4AF37', coverImage: ''
        },
        { 
          tier: 'The Premium Cinematic Story', category: 'combo', price: '₹1,50,000', priceType: 'starting_at', 
          features: ['Candid + Traditional Photo', 'Cinematic Drone Coverage', '5-min Cinematic Teaser', 'Full Story Film', 'Premium Acrylic Album'], 
          includedServiceIds: getSrvIds(['Candid Photography (Per Day)', 'Traditional Photography (Per Day)', 'Drone Coverage (Per Day)', 'Cinematic 10-Min Highlights', '1 to 4 Hour Long Video Edit']),
          popular: true, b2bOrB2c: 'b2c', color: '#10b981', coverImage: ''
        },
        { 
          tier: 'The Destination Royal Elite', category: 'combo', price: '₹3,00,000', priceMax: '₹5,00,000', priceType: 'range', 
          features: ['Full 3-Day Coverage', 'Sangeet, Haldi, Wedding, Reception', 'Reels/Shorts Edit', 'Same-Day Edit Video', 'Multiple Leather Albums'], 
          includedServiceIds: getSrvIds(['Candid Photography (Per Day)', 'Traditional Photography (Per Day)', 'Drone Coverage (Per Day)', 'Cinematic 10-Min Highlights', 'Cinematic 1-Min Teaser', '1 to 4 Hour Long Video Edit', 'Live Streaming Setup (Youtube)']),
          popular: false, b2bOrB2c: 'b2c', color: '#780016', coverImage: ''
        },
        { 
          tier: 'B2B: Studio Edit Outsource', category: 'combo', price: '₹6,000', priceType: 'starting_at', 
          features: ['500 Photos Culling & Color Correction', '1 Cinematic Teaser', 'Album Design (30 sheets)', 'White-label guarantee', '5-day TAT'], 
          includedServiceIds: getSrvIds(['Pro Color Grading (300 pics)', 'Cinematic 1-Min Teaser']),
          popular: true, b2bOrB2c: 'b2b', color: '#3b82f6', coverImage: ''
        }
      ];
      await Package.insertMany(seedPackages);
      console.log('✅ SQLite: Initial packages seeded successfully');
    }

    // 4. Seed Configs if empty
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



    // 5. Seed Market Album Sheets if empty
    const sheetCount = db.prepare('SELECT COUNT(*) as count FROM sheet_types').get().count;
    if (sheetCount === 0) {
      await SheetType.create({ name: 'Standard Matte/Glossy', pricePerSheet: 100, premiumCoverSurcharge: 0 });
      await SheetType.create({ name: 'NT (Non-Tearable)', pricePerSheet: 150, premiumCoverSurcharge: 0 });
      await SheetType.create({ name: 'Velvet (Feather Touch)', pricePerSheet: 250, premiumCoverSurcharge: 500 });
      await SheetType.create({ name: 'Metallic (3D Shimmer)', pricePerSheet: 200, premiumCoverSurcharge: 0 });
      console.log('✅ SQLite: Initial market album sheets seeded successfully');
    }
  } catch (err) {
    console.error('SQLite seeding error:', err);
  }
}

export default db;

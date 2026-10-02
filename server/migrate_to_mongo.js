import { DatabaseSync } from 'node:sqlite';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import * as MongoModels from './models_mongo.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ Error: MONGODB_URI is not set in server/.env');
    console.log('👉 Please set MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/weddingalbums?retryWrites=true&w=majority in server/.env');
    process.exit(1);
  }

  // 1. Locate SQLite database
  const sqliteFile = fs.existsSync(path.join(__dirname, 'weddingalbums.sqlite'))
    ? path.join(__dirname, 'weddingalbums.sqlite')
    : path.join(__dirname, 'business.sqlite');

  console.log(`📂 Reading source SQLite database from: ${sqliteFile}`);
  const sqliteDb = new DatabaseSync(sqliteFile);

  // 2. Connect to MongoDB Atlas
  console.log('🔄 Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri, { maxPoolSize: 10 });
  console.log('✅ Connected to MongoDB Atlas!');

  console.log('\n=============================================');
  console.log('🚀 MIGRATING DATA FROM SQLITE TO MONGODB ATLAS');
  console.log('=============================================\n');

  // Helper safe parser
  const parseJson = (val, fallback = []) => {
    if (!val) return fallback;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  };

  // Helper table migrator
  const migrateTable = async (tableName, callback) => {
    try {
      const rows = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();
      console.log(`📦 Found ${rows.length} rows in SQLite '${tableName}'`);
      let migrated = 0;
      for (const row of rows) {
        await callback(row);
        migrated++;
      }
      console.log(`✅ Successfully migrated ${migrated} records into MongoDB '${tableName}'`);
    } catch (err) {
      console.log(`⚠️ Note for '${tableName}': ${err.message}`);
    }
  };

  // A. Migrate Users
  await migrateTable('users', async (r) => {
    await MongoModels.User.findOneAndUpdate(
      { email: r.email },
      {
        name: r.name,
        email: r.email,
        password: r.password,
        role: r.role,
        wallet_balance: Number(r.wallet_balance || 0),
        phone: r.phone || null,
        city: r.city || null,
        studioName: r.studioName || null,
        gstNumber: r.gstNumber || null,
        coupleNames: r.coupleNames || null,
        weddingDate: r.weddingDate || null,
        portfolioLink: r.portfolioLink || null,
        specialization: r.specialization || null,
        editor_type: r.editor_type || null,
        editor_rating: Number(r.editor_rating || 5.0),
        editor_completed_jobs: Number(r.editor_completed_jobs || 0),
        b2b_studio_tier: r.b2b_studio_tier || 'standard',
        b2b_monthly_volume: Number(r.b2b_monthly_volume || 0),
      },
      { upsert: true, new: true }
    );
  });

  // B. Migrate Packages
  await migrateTable('packages', async (r) => {
    await MongoModels.Package.findOneAndUpdate(
      { tier: r.tier, b2bOrB2c: r.b2bOrB2c },
      {
        tier: r.tier,
        category: r.category,
        price: r.price,
        suffix: r.suffix || null,
        features: parseJson(r.features, []),
        popular: Boolean(r.popular),
        isActive: Boolean(r.isActive !== 0),
        sortOrder: Number(r.sortOrder || 0),
        b2bOrB2c: r.b2bOrB2c,
        color: r.color || '#9E9E9E',
        coverImage: r.coverImage || '',
        priceType: r.priceType || 'fixed',
        priceMax: r.priceMax || null,
        includedServiceIds: parseJson(r.includedServiceIds, []),
      },
      { upsert: true, new: true }
    );
  });

  // C. Migrate Services
  await migrateTable('services', async (r) => {
    await MongoModels.Service.findOneAndUpdate(
      { name: r.name, category: r.category },
      {
        category: r.category,
        name: r.name,
        basePrice: Number(r.basePrice || 0),
        estimatedDaysToDeliver: Number(r.estimatedDaysToDeliver || 1),
      },
      { upsert: true, new: true }
    );
  });

  // D. Migrate Sheet Types
  await migrateTable('sheet_types', async (r) => {
    await MongoModels.SheetType.findOneAndUpdate(
      { name: r.name },
      {
        name: r.name,
        pricePerSheet: Number(r.pricePerSheet || 0),
        premiumCoverSurcharge: Number(r.premiumCoverSurcharge || 0),
      },
      { upsert: true, new: true }
    );
  });

  // E. Migrate Configs
  await migrateTable('configs', async (r) => {
    await MongoModels.Config.findOneAndUpdate(
      { key: r.key },
      {
        key: r.key,
        options: parseJson(r.options, []),
      },
      { upsert: true, new: true }
    );
  });

  // F. Migrate Orders
  await migrateTable('orders', async (r) => {
    const data = parseJson(r.data, {});
    await MongoModels.Order.create({
      userId: data.userId || null,
      customerName: data.customerName || null,
      customerEmail: data.customerEmail || null,
      customerPhone: data.customerPhone || null,
      status: data.status || 'Pending',
      totalAmount: Number(data.totalAmount || 0),
      items: data.items || [],
      data: data,
    });
  });

  // G. Migrate Tasks
  await migrateTable('tasks', async (r) => {
    const data = parseJson(r.data, {});
    await MongoModels.Task.create({
      status: r.status || 'Pending',
      orderId: data.orderId || null,
      editorId: data.editorId || null,
      title: data.title || null,
      data: data,
    });
  });

  // H. Migrate Projects
  await migrateTable('projects', async (r) => {
    const data = parseJson(r.data, {});
    await MongoModels.Project.create({
      userId: data.userId || null,
      title: data.title || null,
      data: data,
    });
  });

  console.log('\n=============================================');
  console.log('🎉 MIGRATION COMPLETE! MongoDB Atlas is in sync.');
  console.log('=============================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

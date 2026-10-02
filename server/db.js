import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isMongo = false;
let models = {};

if (process.env.MONGODB_URI) {
  isMongo = true;
  console.log('🔄 Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('⚡ MongoDB Atlas connected successfully! (High Concurrency & Auto-Scaling Active)');
    models = await import('./models_mongo.js');
  } catch (err) {
    console.error('❌ MongoDB connection error, falling back to SQLite:', err.message);
    isMongo = false;
    models = await import('./db_business.js');
  }
} else {
  console.log('ℹ️ MONGODB_URI not configured in .env. Running on local SQLite engine.');
  models = await import('./db_business.js');
}

export const {
  User,
  Package,
  Service,
  SheetType,
  Order,
  Task,
  Project,
  PayoutRequest,
  Config,
  Cart,
  RefreshToken,
  AuditLog,
  ContactLead
} = models;

export async function initDatabase() {
  if (isMongo) {
    console.log('🚀 Database initialized with MongoDB Atlas cluster');
  } else {
    if (models.autoSeedDatabase) {
      await models.autoSeedDatabase();
    }
  }
}

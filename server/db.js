import dotenv from 'dotenv';
import * as postgresModels from './db_postgres.js';

dotenv.config();

console.log('🐘 Enterprise Database Engine: PostgreSQL Active');

export const {
  User,
  Package,
  Service,
  SheetType,
  AlbumSize,
  Order,
  Task,
  Project,
  PayoutRequest,
  Config,
  Cart,
  RefreshToken,
  AuditLog,
  ContactLead,
  initDatabase,
  getPool,
  query
} = postgresModels;

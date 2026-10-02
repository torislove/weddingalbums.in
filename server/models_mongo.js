import mongoose from 'mongoose';

// ==========================================
// 1. USER SCHEMA
// ==========================================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, required: true, index: true },
  wallet_balance: { type: Number, default: 0 },
  phone: { type: String, default: null },
  city: { type: String, default: null },
  studioName: { type: String, default: null },
  gstNumber: { type: String, default: null },
  coupleNames: { type: String, default: null },
  weddingDate: { type: String, default: null },
  portfolioLink: { type: String, default: null },
  specialization: { type: String, default: null },
  editor_type: { type: String, default: null },
  editor_rating: { type: Number, default: 5.0 },
  editor_completed_jobs: { type: Number, default: 0 },
  b2b_studio_tier: { type: String, default: 'standard' },
  b2b_monthly_volume: { type: Number, default: 0 }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('id').get(function() {
  return this._id.toString();
});

// ==========================================
// 2. PACKAGE SCHEMA
// ==========================================
const packageSchema = new mongoose.Schema({
  tier: { type: String, required: true },
  category: { type: String, required: true, index: true },
  price: { type: String, required: true },
  suffix: { type: String, default: null },
  features: { type: [String], default: [] },
  popular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0 },
  b2bOrB2c: { type: String, required: true, index: true },
  color: { type: String, default: '#9E9E9E' },
  coverImage: { type: String, default: '' },
  priceType: { type: String, default: 'fixed' },
  priceMax: { type: String, default: null },
  includedServiceIds: { type: [String], default: [] }
}, { timestamps: true });

packageSchema.virtual('id').get(function() {
  return this._id.toString();
});

// ==========================================
// 3. SERVICE SCHEMA
// ==========================================
const serviceSchema = new mongoose.Schema({
  category: { type: String, required: true, index: true },
  name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  estimatedDaysToDeliver: { type: Number, default: 1 }
}, { timestamps: true });

serviceSchema.virtual('id').get(function() {
  return this._id.toString();
});

// ==========================================
// 4. SHEET TYPE SCHEMA
// ==========================================
const sheetTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerSheet: { type: Number, required: true },
  premiumCoverSurcharge: { type: Number, default: 0 }
}, { timestamps: true });

sheetTypeSchema.virtual('id').get(function() {
  return this._id.toString();
});

// ==========================================
// 5. ORDER SCHEMA (Document with Flexible Details)
// ==========================================
const orderSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String },
  status: { type: String, default: 'Pending', index: true },
  totalAmount: { type: Number, default: 0 },
  items: { type: Array, default: [] },
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, strict: false });

orderSchema.virtual('id').get(function() {
  return this._id.toString();
});

// ==========================================
// 6. TASK SCHEMA (Editor Task Queue)
// ==========================================
const taskSchema = new mongoose.Schema({
  orderId: { type: String, index: true },
  editorId: { type: String, index: true },
  status: { type: String, default: 'Pending', index: true },
  title: { type: String },
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, strict: false });

taskSchema.virtual('id').get(function() {
  return this._id.toString();
});

// ==========================================
// 7. PROJECT SCHEMA
// ==========================================
const projectSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  title: { type: String },
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, strict: false });

projectSchema.virtual('id').get(function() {
  return this._id.toString();
});

// ==========================================
// 8. PAYOUT REQUEST SCHEMA
// ==========================================
const payoutRequestSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Pending', index: true }
}, { timestamps: true });

payoutRequestSchema.virtual('id').get(function() {
  return this._id.toString();
});

// ==========================================
// 9. CONFIG SCHEMA (CMS Options)
// ==========================================
const configSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  options: { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true });

// ==========================================
// 10. CART SCHEMA
// ==========================================
const cartSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  items: { type: Array, default: [] },
  totalAmount: { type: Number, default: 0 },
  estimatedDeliveryEta: { type: String, default: null }
}, { timestamps: true });

// ==========================================
// 11. REFRESH TOKEN SCHEMA
// ==========================================
const refreshTokenSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },
  token_hash: { type: String, required: true },
  expires_at: { type: Date, required: true },
  revoked: { type: Boolean, default: false }
}, { timestamps: true });

// ==========================================
// 12. AUDIT LOG SCHEMA
// ==========================================
const auditLogSchema = new mongoose.Schema({
  user_id: { type: String, index: true },
  action: { type: String, required: true },
  resource: { type: String },
  details: { type: String },
  ip: { type: String }
}, { timestamps: true });

// ==========================================
// 13. CONTACT LEAD SCHEMA
// ==========================================
const contactLeadSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  city: { type: String },
  eventType: { type: String },
  date: { type: String },
  venue: { type: String },
  budget: { type: String },
  message: { type: String }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Package = mongoose.model('Package', packageSchema);
export const Service = mongoose.model('Service', serviceSchema);
export const SheetType = mongoose.model('SheetType', sheetTypeSchema);
export const Order = mongoose.model('Order', orderSchema);
export const Task = mongoose.model('Task', taskSchema);
export const Project = mongoose.model('Project', projectSchema);
export const PayoutRequest = mongoose.model('PayoutRequest', payoutRequestSchema);
export const Config = mongoose.model('Config', configSchema);
export const Cart = mongoose.model('Cart', cartSchema);
export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export const ContactLead = mongoose.model('ContactLead', contactLeadSchema);

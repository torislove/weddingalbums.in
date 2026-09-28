import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_wedding_key_2026';

app.use(cors({ origin: ['https://weddingalbums.in', 'http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json({ limit: '50mb' }));

// Basic Rate Limiting Mock for Login
const loginRateLimiter = (req, res, next) => {
  // In production, use express-rate-limit
  next();
};

// =======================
// MONGODB CONNECTION
// =======================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studio_db';
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log('Connected to MongoDB cleanly!'))
  .catch(err => console.error('MongoDB connection error:', err));

// =======================
// MONGOOSE MODELS
// =======================
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  wallet_balance: { type: Number, default: 0 },
  
  // Extra fields for registration
  phone: { type: String },
  city: { type: String },
  studioName: { type: String }, // B2B
  gstNumber: { type: String }, // B2B
  coupleNames: { type: String }, // B2C
  weddingDate: { type: Date }, // B2C
  portfolioLink: { type: String }, // Editor
  specialization: { type: String } // Editor
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

const PayoutRequestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });
const PayoutRequest = mongoose.model('PayoutRequest', PayoutRequestSchema);

const Project = mongoose.model('Project', new mongoose.Schema({}, { strict: false, timestamps: true }));
const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false, timestamps: true }));
const Task = mongoose.model('Task', new mongoose.Schema({ status: { type: String, default: 'Pending' } }, { strict: false, timestamps: true }));
const Content = mongoose.model('Content', new mongoose.Schema({ key: String, data: mongoose.Schema.Types.Mixed }));
const Media = mongoose.model('Media', new mongoose.Schema({ url: String, type: String }, { timestamps: true }));

const PackageSchema = new mongoose.Schema({
  tier: { type: String, required: true },
  category: { type: String, required: true }, // 'photo', 'video', 'albums', 'flex', 'combo'
  price: { type: String, required: true },
  suffix: { type: String },
  features: { type: [String], default: [] },
  popular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  b2bOrB2c: { type: String, required: true, enum: ['b2b', 'b2c', 'both'] },
  color: { type: String, default: '#9E9E9E' }
}, { timestamps: true });
const Package = mongoose.model('Package', PackageSchema);

const ConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'album_sizes', 'sheet_types'
  options: { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true });
const Config = mongoose.model('Config', ConfigSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  city: String,
  eventType: String,
  date: String,
  venue: String,
  budget: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const ContactLead = mongoose.model('ContactLead', contactSchema);

// =======================
// CLOUDINARY STORAGE
// =======================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'studio_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif']
  },
});
const upload = multer({ storage: storage });

// =======================
// CONTENT API (Replaces content.json)
// =======================
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/api/content', async (req, res) => {
  try {
    // If MongoDB is not connected, skip straight to fallback for zero latency
    if (mongoose.connection.readyState === 1) {
      const contentDoc = await Content.findOne({ key: 'main_site' }).maxTimeMS(2000);
      if (contentDoc && contentDoc.data && Object.keys(contentDoc.data).length > 0) {
        return res.json(contentDoc.data);
      }
    }
    
    // Fallback to local file if DB is empty or disconnected
    const localContentPath = path.join(__dirname, '../client/public/content.json');
    const raw = await fs.readFile(localContentPath, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err) {
    console.error('MongoDB query failed, falling back to local file:', err.message);
    try {
      const localContentPath = path.join(__dirname, '../client/public/content.json');
      const raw = await fs.readFile(localContentPath, 'utf-8');
      res.json(JSON.parse(raw));
    } catch (fsErr) {
      console.error('Failed to read fallback file:', fsErr);
      res.status(500).json({ error: 'Failed to read content' });
    }
  }
});

app.post('/api/content', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Content.findOneAndUpdate(
        { key: 'main_site' },
        { key: 'main_site', data: req.body },
        { upsert: true, new: true, maxTimeMS: 2000 }
      );
      return res.json({ success: true });
    }
    
    // Fallback to local file if DB is disconnected
    const localContentPath = path.join(__dirname, '../client/public/content.json');
    await fs.writeFile(localContentPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Saved to local file fallback (DB Disconnected)' });
  } catch (err) {
    console.error('MongoDB save failed, falling back to local file:', err.message);
    try {
      const localContentPath = path.join(__dirname, '../client/public/content.json');
      await fs.writeFile(localContentPath, JSON.stringify(req.body, null, 2));
      res.json({ success: true, message: 'Saved to local file fallback' });
    } catch (fsErr) {
      console.error('Failed to save to local file fallback:', fsErr);
      res.status(500).json({ error: 'Failed to save content' });
    }
  }
});

// =======================
// UPLOAD API (Cloudinary)
// =======================
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const imageUrl = req.file.path; // Cloudinary URL
  
  // Save reference in MongoDB so we can list them later
  await Media.create({ url: imageUrl, type: 'image' });
  
  res.json({ url: imageUrl });
});

app.get('/api/images', async (req, res) => {
  try {
    // Fetch all uploaded image URLs from DB
    const media = await Media.find({ type: 'image' }).sort({ createdAt: -1 });
    const images = media.map(m => m.url);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// =======================
// AUTH & WALLET API
// =======================
app.post('/api/register', async (req, res) => {
  const { 
    name, email, password, role, 
    phone, city, studioName, gstNumber, 
    coupleNames, weddingDate, portfolioLink, specialization 
  } = req.body;
  
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'All fields required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, email, password: hashedPassword, role,
      phone, city, studioName, gstNumber, 
      coupleNames, weddingDate, portfolioLink, specialization 
    });
    
    const token = jwt.sign({ id: user._id, name, email, role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name, email, role, wallet_balance: user.wallet_balance } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', loginRateLimiter, async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role, wallet_balance: user.wallet_balance }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, wallet_balance: user.wallet_balance } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    req.user = user;
    next();
  });
};

app.get('/api/wallet', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ balance: user.wallet_balance });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/payout', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.wallet_balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    // Deduct balance and create request
    user.wallet_balance -= amount;
    await user.save();
    
    await PayoutRequest.create({ user_id: user._id, amount });
    
    res.json({ success: true, message: 'Payout requested', newBalance: user.wallet_balance });
  } catch (err) {
    res.status(500).json({ error: 'Transaction failed' });
  }
});

// =======================
// PACKAGES API
// =======================
app.get('/api/packages', async (req, res) => {
  try {
    const { type } = req.query; // 'b2b' or 'b2c'
    let query = { isActive: true };
    if (type) {
      query.b2bOrB2c = { $in: [type, 'both'] };
    }
    
    // Group by category manually or return flat list
    const packages = await Package.find(query).sort({ sortOrder: 1, price: 1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// Admin routes for packages
app.get('/api/admin/packages', async (req, res) => {
  try {
    const packages = await Package.find().sort({ b2bOrB2c: 1, category: 1, sortOrder: 1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

app.post('/api/admin/packages', authenticateAdmin, async (req, res) => {
  try {
    const newPkg = await Package.create(req.body);
    res.json(newPkg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create package', details: err.message });
  }
});

app.put('/api/admin/packages/:id', authenticateAdmin, async (req, res) => {
  try {
    const updatedPkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPkg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update package' });
  }
});

app.delete('/api/admin/packages/:id', authenticateAdmin, async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

app.post('/api/admin/seed-packages', authenticateAdmin, async (req, res) => {
  try {
    await Package.deleteMany({});
    
    const seedData = [
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
    
    await Package.insertMany(seedData);
    
    // Seed Config Data for Cart Builder
    await Config.deleteMany({});
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

    res.json({ success: true, message: 'Packages and Configs seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed packages' });
  }
});

// Admin routes for Configs
app.get('/api/admin/configs', async (req, res) => {
  try {
    const configs = await Config.find();
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch configs' });
  }
});

app.put('/api/admin/configs/:key', authenticateAdmin, async (req, res) => {
  try {
    const updated = await Config.findOneAndUpdate(
      { key: req.params.key },
      { options: req.body.options },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// =======================
// B2B & B2C API (Dynamic MongoDB Collections)
// =======================
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch(err) { res.status(500).json({error: 'Failed to fetch'}); }
});
// =======================
// NOTIFICATION UTILS (MOCKS)
// =======================
const sendEmail = async (to, subject, text) => {
  console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
  return true;
};

const sendWhatsApp = async (phone, template, params) => {
  console.log(`[WHATSAPP SENT] To: ${phone} | Template: ${template}`);
  return true;
};

// =======================
// PAYMENTS & INVOICES
// =======================
app.post('/api/pay/create-order', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  // Mock Razorpay Order Creation
  res.json({
    id: `order_${Math.random().toString(36).substring(7)}`,
    amount: amount * 100, // in paise
    currency: 'INR'
  });
});

app.post('/api/pay/verify', authenticateToken, async (req, res) => {
  // Mock verification
  const { paymentId, orderId } = req.body;
  res.json({ success: true, paymentId });
});

app.get('/api/orders/:id/invoice', async (req, res) => {
  res.json({ url: `https://weddingalbums.in/invoices/${req.params.id}.pdf` });
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch(err) { res.status(500).json({error: 'Failed to create'}); }
});

// =======================
// ADMIN STATS API
// =======================
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: { $ne: 'Completed' } });
    const totalProjects = await Project.countDocuments();
    const totalUsers = await User.countDocuments();
    const b2bUsers = await User.countDocuments({ role: 'studio' });
    const editors = await User.countDocuments({ role: 'editor' });

    res.json({
      orders: totalOrders,
      tasks: totalTasks,
      pendingTasks,
      projects: totalProjects,
      users: totalUsers,
      b2bUsers,
      editors
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch(err) { res.status(500).json({error: 'Failed to fetch'}); }
});
app.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json(order);
  } catch(err) { res.status(500).json({error: 'Failed to create'}); }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch(err) { res.status(500).json({error: 'Failed to fetch'}); }
});
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch(err) { res.status(500).json({error: 'Failed to create'}); }
});
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch(err) { res.status(500).json({error: 'Failed to update'}); }
});

// Muhurtham Fallback API
app.get('/api/muhurtham', async (req, res) => {
  try {
    const url = 'https://www.prokerala.com/astrology/hindu-marriage-muhurat/';
    const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
    const $ = cheerio.load(response.data);
    const auspiciousDates = [];
    const fallbackDates = ["2026-10-12", "2026-10-18", "2026-10-26", "2026-11-04", "2026-11-12", "2026-11-18", "2026-12-06", "2026-12-11", "2026-12-21"];
    
    if (auspiciousDates.length > 0) res.json({ dates: auspiciousDates, source: 'scraped' });
    else res.json({ dates: fallbackDates, source: 'fallback' });
  } catch (error) {
    const fallbackDates = ["2026-10-12", "2026-10-18", "2026-10-26", "2026-11-04", "2026-11-12", "2026-11-18", "2026-12-06", "2026-12-11", "2026-12-21"];
    res.json({ dates: fallbackDates, source: 'fallback_error' });
  }
});

app.listen(PORT, () => {
  console.log(`Clean Server running on http://localhost:${PORT}`);
});

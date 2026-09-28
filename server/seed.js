import bcrypt from 'bcryptjs';
import db, { autoSeedDatabase, User } from './db.js';

async function seed() {
  try {
    await autoSeedDatabase();
    
    const hash = await bcrypt.hash('admin123', 10);
    const existing = await User.findOne({ email: 'admin@weddingalbums.in' });
    if (existing) {
      existing.password = hash;
      existing.role = 'admin';
      existing.name = 'Super Admin';
      await existing.save();
      console.log('✅ SQLite: Super Admin user refreshed (admin@weddingalbums.in / admin123)');
    } else {
      await User.create({
        name: 'Super Admin',
        email: 'admin@weddingalbums.in',
        password: hash,
        role: 'admin',
        wallet_balance: 10000
      });
      console.log('✅ SQLite: Super Admin user created (admin@weddingalbums.in / admin123)');
    }

    console.log('🎉 SQLite Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();

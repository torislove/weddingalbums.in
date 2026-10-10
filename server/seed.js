import bcrypt from 'bcryptjs';
import { User, initDatabase, autoSeedDatabase } from './db_postgres.js';

async function seed() {
  try {
    console.log('🐘 Connecting to PostgreSQL...');
    await initDatabase();
    await autoSeedDatabase();

    const hash = await bcrypt.hash('admin123', 10);
    const existing = await User.findOne({ email: 'admin@weddingalbums.in' });
    if (existing) {
      await User.updatePassword(existing._id || existing.id, hash);
      console.log('✅ PostgreSQL: Super Admin user password updated (admin@weddingalbums.in / admin123)');
    } else {
      await User.create({
        name: 'Super Admin',
        email: 'admin@weddingalbums.in',
        password: hash,
        role: 'admin',
        wallet_balance: 10000
      });
      console.log('✅ PostgreSQL: Super Admin user created (admin@weddingalbums.in / admin123)');
    }

    console.log('🎉 PostgreSQL Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();

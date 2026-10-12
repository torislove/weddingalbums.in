import bcrypt from 'bcryptjs';
import { User, initDatabase, autoSeedDatabase } from './db_postgres.js';

async function seed() {
  try {
    console.log('🐘 Connecting to PostgreSQL...');
    await initDatabase();
    await autoSeedDatabase();

    const hash = await bcrypt.hash('admin123', 10);
    const seedUsers = [
      { name: 'Super Admin', email: 'admin@weddingalbums.in', role: 'admin' },
      { name: 'System Admin', email: 'sysadmin@weddingalbums.in', role: 'sysadmin' },
      { name: 'Content Admin', email: 'contentadmin@weddingalbums.in', role: 'content_admin' }
    ];

    for (const u of seedUsers) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        await User.updatePassword(existing._id || existing.id, hash);
        console.log(`✅ PostgreSQL: ${u.name} password updated (${u.email} / admin123)`);
      } else {
        await User.create({
          name: u.name,
          email: u.email,
          password: hash,
          role: u.role,
          wallet_balance: 10000
        });
        console.log(`✅ PostgreSQL: ${u.name} user created (${u.email} / admin123)`);
      }
    }

    console.log('🎉 PostgreSQL Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();

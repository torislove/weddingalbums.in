import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = 'mongodb://127.0.0.1:27017/studio_db';

mongoose.connect(uri).then(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  await mongoose.connection.db.collection('users').updateOne(
    { email: 'admin@weddingalbums.in' },
    { $set: { name: 'Super Admin', email: 'admin@weddingalbums.in', password: hash, role: 'admin' } },
    { upsert: true }
  );
  console.log('Admin user successfully seeded!');
  process.exit(0);
}).catch(err => {
  console.error('Mongo not ready yet:', err);
  process.exit(1);
});

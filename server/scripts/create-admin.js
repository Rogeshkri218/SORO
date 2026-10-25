import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { AdminUser } from '../models/AdminUser.js';
import { closeDatabase, connectDatabase } from '../config/database.js';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_INITIAL_PASSWORD;

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Set ADMIN_EMAIL to the initial administrator email.');
  process.exit(1);
}
if (!password || password.length < 14 || password.length > 200) {
  console.error('Set ADMIN_INITIAL_PASSWORD to a temporary password of at least 14 characters.');
  process.exit(1);
}

try {
  await connectDatabase();
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await AdminUser.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.active = true;
    existing.role = 'admin';
    await existing.save();
    console.info('Administrator password rotated.');
  } else {
    await AdminUser.create({ email, passwordHash, role: 'admin', active: true });
    console.info('Administrator provisioned.');
  }
} catch (error) {
  console.error('Administrator provisioning failed:', error instanceof Error ? error.name : 'unknown error');
  process.exitCode = 1;
} finally {
  await closeDatabase();
}

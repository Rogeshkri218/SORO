import 'dotenv/config';
import { AdminUser } from '../models/AdminUser.js';
import { AuditLog } from '../models/AuditLog.js';
import { NotificationLog } from '../models/NotificationLog.js';
import { Submission } from '../models/Submission.js';
import { closeDatabase, connectDatabase } from '../config/database.js';

try {
  await connectDatabase();
  for (const model of [AdminUser, AuditLog, NotificationLog, Submission]) {
    await model.createIndexes();
    console.info(`Indexes verified for ${model.modelName}.`);
  }
} catch (error) {
  console.error('Database index setup failed:', error instanceof Error ? error.name : 'unknown error');
  process.exitCode = 1;
} finally {
  await closeDatabase();
}

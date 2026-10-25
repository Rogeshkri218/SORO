import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin'], default: 'admin' },
  active: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
}, { timestamps: true });

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);

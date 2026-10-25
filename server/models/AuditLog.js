import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true, index: true },
  action: { type: String, required: true, maxlength: 100 },
  submission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true, index: true },
  changes: { type: mongoose.Schema.Types.Mixed, default: {} },
  ipAddress: { type: String, maxlength: 80 },
}, { timestamps: true });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

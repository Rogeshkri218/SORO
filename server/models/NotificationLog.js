import mongoose from 'mongoose';

const notificationLogSchema = new mongoose.Schema({
  submission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true, index: true },
  type: { type: String, enum: ['admin-new-submission', 'customer-confirmation', 'status-update'], required: true },
  recipient: { type: String, required: true, maxlength: 254 },
  status: { type: String, enum: ['sent', 'failed'], required: true },
  providerMessageId: { type: String, maxlength: 200 },
  errorCode: { type: String, maxlength: 80 },
}, { timestamps: true });

notificationLogSchema.index({ createdAt: -1 });

export const NotificationLog = mongoose.model('NotificationLog', notificationLogSchema);

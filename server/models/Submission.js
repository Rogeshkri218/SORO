import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true, maxlength: 180 },
  storageKey: { type: String, required: true, unique: true },
  size: { type: Number, required: true, min: 0 },
  contentType: { type: String, required: true, maxlength: 120 },
  uploadedAt: { type: Date },
  status: { type: String, enum: ['pending', 'uploaded', 'rejected'], default: 'pending' },
  scanStatus: { type: String, enum: ['pending', 'clean', 'rejected'], default: 'pending' },
  scanReviewedAt: { type: Date },
  scanReviewNote: { type: String, maxlength: 1000 },
}, { _id: true });

const submissionSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true, index: true },
  requestId: { type: String, unique: true, sparse: true, maxlength: 80 },
  requestFingerprint: { type: String, maxlength: 64 },
  accessTokenHash: { type: String, required: true, select: false },
  customer: {
    name: { type: String, required: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, maxlength: 254, index: true },
    phone: { type: String, maxlength: 40 },
    company: { type: String, maxlength: 160 },
  },
  serviceType: { type: String, required: true, maxlength: 80, index: true },
  project: {
    projectTitle: { type: String, maxlength: 180 },
    projectType: { type: String, maxlength: 80 },
    software: { type: String, maxlength: 160 },
    description: { type: String, required: true, maxlength: 10_000 },
    quantity: { type: String, maxlength: 300 },
    deliverables: [{ type: String, maxlength: 120 }],
    constraints: { type: String, maxlength: 5_000 },
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    budget: { type: String, maxlength: 100 },
    contactMethod: { type: String, maxlength: 80 },
    deadline: { type: Date },
    privacyConsent: { type: Boolean, default: false },
  },
  files: { type: [fileSchema], default: [] },
  status: {
    type: String,
    enum: ['Pending Review', 'Quoted', 'In Production', 'Completed', 'Cancelled'],
    default: 'Pending Review',
    index: true,
  },
  quotedAmount: { type: Number, min: 0 },
  paymentStatus: { type: String, enum: ['Not Applicable', 'Unpaid', 'Paid', 'Refunded'], default: 'Not Applicable' },
  adminNotes: { type: String, maxlength: 10_000, default: '' },
  emailNotifications: {
    admin: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    customer: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  },
}, { timestamps: true });

submissionSchema.index({ createdAt: -1 });
submissionSchema.index({ status: 1, createdAt: -1 });
submissionSchema.index({ serviceType: 1, createdAt: -1 });
submissionSchema.index({ reference: 1, 'customer.email': 1 });

export const Submission = mongoose.model('Submission', submissionSchema);

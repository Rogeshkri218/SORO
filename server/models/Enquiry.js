import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 40, default: '' },
  company: { type: String, trim: true, maxlength: 160, default: '' },
  subject: { type: String, required: true, trim: true, maxlength: 180 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
}, {
  timestamps: true,
  collection: 'enquiries',
});

export const Enquiry = mongoose.model('Enquiry', enquirySchema);

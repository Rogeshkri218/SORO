import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 40 },
  companyName: { type: String, trim: true, maxlength: 160, default: '' },
}, { _id: false });

const specificationsSchema = new mongoose.Schema({
  dimensions: { type: String, trim: true, maxlength: 120, default: '' },
  layers: { type: String, trim: true, maxlength: 40, default: '' },
  material: { type: String, trim: true, maxlength: 100, default: '' },
  copperThickness: { type: String, trim: true, maxlength: 80, default: '' },
  surfaceFinish: { type: String, trim: true, maxlength: 80, default: '' },
}, { _id: false });

const pcbSubmissionSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true, index: true },
  projectType: {
    type: String,
    required: true,
    enum: ['pcb-layout', 'pcb-design', 'mechanical-design'],
  },
  software: { type: String, trim: true, maxlength: 160, default: '' },
  softwareOther: { type: String, trim: true, maxlength: 120, default: '' },
  description: { type: String, required: true, trim: true, maxlength: 10_000 },
  quantity: { type: String, trim: true, maxlength: 300, default: '' },
  deliverables: {
    type: [String],
    enum: [
      'Schematic source files',
      'PCB layout source files',
      'Gerber / fabrication outputs',
      'Bill of Materials (BOM)',
      'Assembly drawings',
      'CAD models or drawings',
    ],
    default: [],
  },
  constraints: { type: String, trim: true, maxlength: 5000, default: '' },
  deadline: { type: Date },
  contactMethod: { type: String, enum: ['', 'Email', 'Phone call', 'Other'], default: '' },
  contact: { type: contactSchema, required: true },
  specifications: { type: specificationsSchema, default: () => ({}) },
  status: {
    type: String,
    enum: ['Pending Review', 'Quoted', 'In Production', 'Completed', 'Cancelled'],
    default: 'Pending Review',
  },
}, {
  timestamps: true,
  collection: 'pcb_submissions',
});

export const PcbSubmission = mongoose.model('PcbSubmission', pcbSubmissionSchema);

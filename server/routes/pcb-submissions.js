import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { PcbSubmission } from '../models/PcbSubmission.js';

const router = Router();
const softwareOptions = [
  '',
  'Altium Designer',
  'KiCad',
  'Cadence / OrCAD',
  'Not sure yet',
  'AutoCAD',
  'Fusion 360',
  'SolidWorks',
  'FreeCAD',
  'Other',
];
const deliverableOptions = [
  'Schematic source files',
  'PCB layout source files',
  'Gerber / fabrication outputs',
  'Bill of Materials (BOM)',
  'Assembly drawings',
  'CAD models or drawings',
];
const phone = z.string().trim()
  .regex(/^\+?[1-9][\d\s().-]{5,24}$/)
  .refine((value) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  });
const date = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}).optional().or(z.literal(''));

const pcbSubmissionSchema = z.object({
  projectType: z.enum(['pcb-layout', 'pcb-design', 'mechanical-design']),
  software: z.enum(softwareOptions).optional().default(''),
  softwareOther: z.string().trim().max(120).optional().default(''),
  description: z.string().trim().min(1).max(10_000),
  quantity: z.string().trim().max(300).optional().default(''),
  deliverables: z.array(z.enum(deliverableOptions)).max(deliverableOptions.length).optional().default([]),
  constraints: z.string().trim().max(5000).optional().default(''),
  deadline: date,
  contactMethod: z.enum(['Email', 'Phone call', 'Other']).optional().default(''),
  contact: z.object({
    fullName: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(254),
    phone,
    companyName: z.string().trim().max(160).optional().default(''),
  }).strict(),
  website: z.string().trim().max(200).optional().default(''),
  specifications: z.object({
    dimensions: z.string().trim().max(120).optional().default(''),
    layers: z.string().trim().max(40).optional().default(''),
    material: z.string().trim().max(100).optional().default(''),
    copperThickness: z.string().trim().max(80).optional().default(''),
    surfaceFinish: z.string().trim().max(80).optional().default(''),
  }).strict().optional().default({}),
}).strict().superRefine((data, context) => {
  const allowedSoftware = data.projectType === 'mechanical-design'
    ? ['Not sure yet', 'AutoCAD', 'Fusion 360', 'SolidWorks', 'FreeCAD', 'Other']
    : ['Altium Designer', 'KiCad', 'Cadence / OrCAD', 'Not sure yet'];
  if (data.software && !allowedSoftware.includes(data.software)) {
    context.addIssue({
      code: 'custom',
      path: ['software'],
      message: 'The selected design software is invalid.',
    });
  }
  if (data.projectType !== 'mechanical-design' && !data.software) {
    context.addIssue({
      code: 'custom',
      path: ['software'],
      message: 'Select a PCB design software or “Not sure yet”.',
    });
  }
});

const generateReference = () => `PCB-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomBytes(12).toString('hex').toUpperCase()}`;

router.post('/', async (request, response, next) => {
  if (!request.get('origin')) {
    return response.status(403).json({ error: 'Request origin is required.' });
  }

  try {
    const parsed = pcbSubmissionSchema.parse(request.body);
    const { website, ...details } = parsed;
    if (website) return response.status(400).json({ error: 'Submission rejected.' });
    const submission = await PcbSubmission.create({
      ...details,
      deadline: details.deadline || undefined,
      reference: generateReference(),
    });

    return response.status(201).json({
      success: true,
      submission: {
        id: submission.id,
        reference: submission.reference,
        status: submission.status,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    if (error?.name === 'ZodError') {
      return response.status(400).json({
        error: 'Please check the submitted fields.',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    return next(error);
  }
});

export default router;

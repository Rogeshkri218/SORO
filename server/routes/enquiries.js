import { Router } from 'express';
import { z } from 'zod';
import { Enquiry } from '../models/Enquiry.js';

const router = Router();
const phone = z.string().trim().regex(/^\+?[1-9][\d\s().-]{5,24}$/).refine((value) => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}).optional().or(z.literal('')).default('');

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone,
  company: z.string().trim().max(160).optional().default(''),
  subject: z.string().trim().min(3).max(180),
  message: z.string().trim().min(20).max(5000),
  website: z.string().trim().max(200).optional().default(''),
}).strict();

router.post('/', async (request, response, next) => {
  if (!request.get('origin')) {
    return response.status(403).json({ error: 'Request origin is required.' });
  }

  let enquiry;
  try {
    const parsed = enquirySchema.parse(request.body);
    const { website, ...details } = parsed;
    if (website) return response.status(400).json({ error: 'Submission rejected.' });
    enquiry = await Enquiry.create(details);
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

  return response.status(201).json({
    success: true,
    enquiry: {
      id: enquiry.id,
      createdAt: enquiry.createdAt,
    },
  });
});

export default router;

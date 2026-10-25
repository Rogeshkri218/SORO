import { createHash, createHmac, randomBytes } from 'node:crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { AdminUser } from '../models/AdminUser.js';
import { AuditLog } from '../models/AuditLog.js';
import { NotificationLog } from '../models/NotificationLog.js';
import { Submission } from '../models/Submission.js';
import { clearAdminSession, createAdminSession, authenticateAdmin } from '../middleware/auth.js';
import { sendStatusNotification, sendSubmissionNotifications } from '../services/email.js';
import { confirmStoredObject, createSignedDownload, createSignedUpload, validateUploadDetails } from '../services/storage.js';

const router = Router();
const allowedProjectTypes = ['pcb-layout', 'pcb-design', 'mechanical-design'];
const allowedPcbSoftware = ['Altium Designer', 'KiCad', 'Cadence / OrCAD', 'Not sure yet'];
const allowedCadSoftware = ['Not sure yet', 'AutoCAD', 'Fusion 360', 'SolidWorks', 'FreeCAD', 'Other'];
const allowedDeliverables = [
  'Schematic source files',
  'PCB layout source files',
  'Gerber / fabrication outputs',
  'Bill of Materials (BOM)',
  'Assembly drawings',
  'CAD models or drawings',
];
const allowedQuoteCategories = [
  'PCB Schematic Design',
  'PCB Layout',
  'Electronic Product Development',
  'Prototype Assembly',
  '3D CAD or 3D Printing',
  'Other Engineering Enquiry',
];

const text = (max, required = false) => {
  let schema = z.string().trim().max(max);
  if (required) schema = schema.min(1);
  return schema;
};
const email = z.string().trim().email().max(254);
const phone = z.string().trim().regex(/^\+?[1-9][\d\s().-]{5,24}$/).refine((value) => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
});
const date = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}).optional().or(z.literal(''));
const common = {
  name: text(120, true),
  email,
  phone: phone.optional().or(z.literal('')),
  company: text(160).optional().default(''),
  website: text(200).optional().default(''),
};

const submissionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('pcb-project'),
    requestId: z.string().uuid(),
    data: z.object({
      projectType: z.enum(allowedProjectTypes),
      software: text(160).optional().default(''),
      softwareOther: text(120).optional().default(''),
      description: text(10_000, true),
      quantity: text(300).optional().default(''),
      deliverables: z.array(z.enum(allowedDeliverables)).max(allowedDeliverables.length).default([]),
      constraints: text(5_000).optional().default(''),
      deadline: date,
      contactMethod: z.enum(['Email', 'Phone call', 'Other']).optional().default(''),
      contact: z.object({
        fullName: common.name,
        email: common.email,
        phone,
        companyName: common.company,
      }),
      website: common.website,
      specifications: z.object({
        dimensions: text(120).optional().default(''),
        layers: text(40).optional().default(''),
        material: text(100).optional().default(''),
        copperThickness: text(80).optional().default(''),
        surfaceFinish: text(80).optional().default(''),
      }).optional().default({}),
      selectedFiles: z.array(z.object({
        name: text(180, true),
        size: z.number().int().nonnegative().max(500 * 1024 * 1024),
        contentType: text(120).optional().default(''),
      })).max(50).optional().default([]),
    }),
  }),
  z.object({
    type: z.literal('quote'),
    requestId: z.string().uuid(),
    data: z.object({
      fullName: common.name,
      companyName: common.company,
      email: common.email,
      phone,
      serviceCategory: z.enum(allowedQuoteCategories),
      projectTitle: text(180, true),
      projectDescription: text(10_000, true).min(30),
      estimatedQuantity: text(300).optional().default(''),
      budgetRange: text(100).optional().default(''),
      deliveryDate: date,
      deliverables: text(2_000).optional().default(''),
      designSoftware: text(160).optional().default(''),
      contactMethod: z.enum(['Email', 'Phone Call', 'WhatsApp', 'Video Call']),
      privacyConsent: z.literal(true),
      website: common.website,
    }),
  }),
  z.object({
    type: z.literal('contact'),
    requestId: z.string().uuid(),
    data: z.object({
      name: common.name,
      email: common.email,
      subject: text(180, true).min(3),
      message: text(5_000, true).min(20),
      website: common.website,
    }),
  }),
]);

const objectId = (value) => /^[a-f\d]{24}$/i.test(value);
const hashToken = (token) => createHash('sha256').update(token).digest('hex');
const createCustomerAccessToken = (requestId) => {
  const secret = process.env.CUSTOMER_TOKEN_SECRET;
  if (
    !secret
    || secret.length < 32
    || secret === process.env.JWT_SECRET
    || /^(replace|your_|example)/i.test(secret)
  ) {
    throw Object.assign(new Error('Customer access is not configured.'), { statusCode: 503 });
  }
  return createHmac('sha256', secret).update(`submission:${requestId}`).digest('base64url');
};
const generateReference = () => `SR-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomBytes(6).toString('hex').toUpperCase()}`;
const requestFingerprint = (parsed) => createHash('sha256').update(JSON.stringify(parsed)).digest('hex');

const publicSubmission = (submission) => ({
  id: submission._id,
  reference: submission.reference,
  serviceType: submission.serviceType,
  status: submission.status,
  emailNotifications: submission.emailNotifications,
  createdAt: submission.createdAt,
});

const cleanCustomerView = (submission) => ({
  reference: submission.reference,
  serviceType: submission.serviceType,
  status: submission.status,
  project: submission.project,
  files: submission.files.map((file) => ({
    id: file._id,
    originalName: file.originalName,
    size: file.size,
    contentType: file.contentType,
    status: file.status,
    uploadedAt: file.uploadedAt,
  })),
  createdAt: submission.createdAt,
  updatedAt: submission.updatedAt,
});

const submissionFromBody = (parsed) => {
  const { type, data } = parsed;
  let customer;
  let serviceType;
  let project;
  if (type === 'pcb-project') {
    const projectType = data.projectType;
    const label = projectType === 'pcb-layout' ? 'PCB Layout' : projectType === 'pcb-design' ? 'PCB Design' : 'Mechanical Design';
    const softwareOptions = projectType === 'mechanical-design' ? allowedCadSoftware : allowedPcbSoftware;
    if (data.software && !softwareOptions.includes(data.software)) {
      throw Object.assign(new Error('The selected design software is invalid.'), { statusCode: 400 });
    }
    if (projectType !== 'mechanical-design' && !data.software) {
      throw Object.assign(new Error('Select a PCB design software or “Not sure yet”.'), { statusCode: 400 });
    }
    let totalFileBytes = 0;
    const selectedFiles = data.selectedFiles.map((file) => {
      const validated = validateUploadDetails(file, totalFileBytes);
      totalFileBytes += validated.size;
      return {
        name: validated.originalName,
        size: validated.size,
        contentType: validated.contentType,
      };
    });
    customer = {
      name: data.contact.fullName,
      email: data.contact.email,
      phone: data.contact.phone,
      company: data.contact.companyName,
    };
    serviceType = label;
    project = {
      projectType: label,
      software: data.software === 'Other' ? data.softwareOther || 'Other' : data.software,
      description: data.description,
      quantity: data.quantity,
      deliverables: data.deliverables,
      constraints: data.constraints,
      deadline: data.deadline || undefined,
      contactMethod: data.contactMethod,
      specifications: { ...data.specifications, selectedFiles },
    };
  } else if (type === 'quote') {
    customer = {
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.companyName,
    };
    serviceType = data.serviceCategory;
    project = {
      projectTitle: data.projectTitle,
      projectType: data.serviceCategory,
      software: data.designSoftware,
      description: data.projectDescription,
      quantity: data.estimatedQuantity,
      deliverables: data.deliverables ? [data.deliverables] : [],
      constraints: '',
      budget: data.budgetRange,
      contactMethod: data.contactMethod,
      deadline: data.deliveryDate || undefined,
      privacyConsent: data.privacyConsent,
      specifications: {},
    };
  } else {
    customer = { name: data.name, email: data.email, phone: '', company: '' };
    serviceType = 'General Customer Enquiry';
    project = {
      projectTitle: data.subject,
      projectType: serviceType,
      software: '',
      description: data.message,
      quantity: '',
      deliverables: [],
      constraints: '',
      specifications: {},
    };
  }
  return { customer, serviceType, project };
};

const normalizeError = (error, response) => {
  if (error?.name === 'ZodError') {
    return response.status(400).json({
      error: 'Please check the submitted fields.',
      details: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
    });
  }
  const status = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  if (status >= 500) {
    return response.status(status).json({ error: status === 503 ? error.message : 'The request could not be completed.' });
  }
  return response.status(status).json({ error: error.message });
};

const uploadTokenFor = (request, response, next) => {
  const token = request.get('x-submission-token') || '';
  if (!token || token.length < 40 || token.length > 200) {
    return response.status(401).json({ error: 'Submission access is required.' });
  }
  request.submissionTokenHash = hashToken(token);
  next();
};

const ensureSubmissionOwner = async (request, response, next) => {
  try {
    const submission = await Submission.findOne({
      reference: request.params.reference,
      accessTokenHash: request.submissionTokenHash,
    }).select('+accessTokenHash');
    if (!submission) return response.status(404).json({ error: 'Submission was not found.' });
    request.submission = submission;
    next();
  } catch (error) {
    next(error);
  }
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

router.get('/health', (request, response) => {
  const databaseReady = request.app.locals.databaseReady === true;
  response.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'ready' : 'degraded',
    database: databaseReady ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

router.use((request, response, next) => {
  if (request.app.locals.databaseReady !== true) {
    return response.status(503).json({ error: 'The SORO enquiry service is not ready. Please retry shortly.' });
  }
  next();
});

router.post('/submissions', async (request, response) => {
  try {
    if (!request.get('origin')) return response.status(403).json({ error: 'Request origin is required.' });
    const parsed = submissionSchema.parse(request.body);
    const idempotencyKey = request.get('idempotency-key');
    if (idempotencyKey && idempotencyKey !== parsed.requestId) {
      return response.status(400).json({ error: 'The idempotency key does not match the request identifier.' });
    }
    if (parsed.data.website) return response.status(400).json({ error: 'Submission rejected.' });
    const mapped = submissionFromBody(parsed);
    const accessToken = createCustomerAccessToken(parsed.requestId);
    const fingerprint = requestFingerprint(parsed);
    const existing = await Submission.findOne({ requestId: parsed.requestId });
    if (existing) {
      if (existing.requestFingerprint !== fingerprint) {
        return response.status(409).json({ error: 'This request identifier was already used for different enquiry details.' });
      }
      return response.status(200).json({
        success: true,
        submission: publicSubmission(existing),
        accessToken,
      });
    }
    let submission;
    try {
      submission = await Submission.create({
        reference: generateReference(),
        requestId: parsed.requestId,
        requestFingerprint: fingerprint,
        accessTokenHash: hashToken(accessToken),
        customer: mapped.customer,
        serviceType: mapped.serviceType,
        project: mapped.project,
      });
    } catch (error) {
      if (error?.code === 11000) {
        const concurrentSubmission = await Submission.findOne({ requestId: parsed.requestId });
        if (concurrentSubmission?.requestFingerprint === fingerprint) {
          return response.status(200).json({
            success: true,
            submission: publicSubmission(concurrentSubmission),
            accessToken,
          });
        }
        return response.status(409).json({ error: 'This request was already submitted. Contact SORO if you need to confirm its status.' });
      }
      throw error;
    }

    try {
      await sendSubmissionNotifications(submission, { accessToken });
    } catch {
      submission.emailNotifications.admin = 'failed';
      submission.emailNotifications.customer = 'failed';
      await submission.save().catch(() => undefined);
    }

    return response.status(201).json({
      success: true,
      submission: publicSubmission(submission),
      accessToken,
    });
  } catch (error) {
    return normalizeError(error, response);
  }
});

router.get('/orders/:reference', uploadTokenFor, ensureSubmissionOwner, (request, response) => {
  response.json({ submission: cleanCustomerView(request.submission) });
});

router.post('/submissions/:reference/uploads/sign', uploadTokenFor, ensureSubmissionOwner, async (request, response) => {
  try {
    const { files } = request.body ?? {};
    if (!Array.isArray(files) || files.length < 1 || files.length > 10) {
      return response.status(400).json({ error: 'Select between 1 and 10 files per upload request.' });
    }
    const submission = request.submission;
    if (submission.files.length + files.length > 50) return response.status(413).json({ error: 'Too many project files.' });
    let totalSize = submission.files.reduce((total, file) => total + file.size, 0);
    const prepared = files.map((file) => {
      const validated = validateUploadDetails(file, totalSize);
      totalSize += validated.size;
      return validated;
    });
    const signed = [];
    for (const file of prepared) {
      let record = submission.files.find((entry) =>
        entry.originalName === file.originalName && entry.size === file.size && entry.status !== 'rejected');
      let result;
      if (record && await confirmStoredObject(record.storageKey, record.size)) {
        signed.push({ fileId: record._id, path: record.storageKey, token: '', alreadyUploaded: true });
        continue;
      }
      result = await createSignedUpload({
        reference: submission.reference,
        file,
        existingKey: record?.storageKey,
      });
      if (!record) {
        submission.files.push({
          originalName: file.originalName,
          storageKey: result.storageKey,
          size: file.size,
          contentType: file.contentType,
          status: 'pending',
          scanStatus: 'pending',
        });
        await submission.save();
        record = submission.files.find((entry) => entry.storageKey === result.storageKey);
      }
      if (!record) throw Object.assign(new Error('Could not save file metadata.'), { statusCode: 500 });
      signed.push({ fileId: record._id, path: result.storageKey, token: result.token, alreadyUploaded: false });
    }
    return response.status(201).json({ uploads: signed });
  } catch (error) {
    return normalizeError(error, response);
  }
});

router.post('/submissions/:reference/uploads/:fileId/complete', uploadTokenFor, ensureSubmissionOwner, async (request, response) => {
  try {
    const file = request.submission.files.id(request.params.fileId);
    if (!file) return response.status(404).json({ error: 'File record was not found.' });
    if (!await confirmStoredObject(file.storageKey, file.size)) {
      return response.status(400).json({ error: 'The storage service could not verify this uploaded file.' });
    }
    if (file.status === 'uploaded') return response.json({ success: true });
    file.status = 'uploaded';
    file.uploadedAt = new Date();
    await request.submission.save();
    return response.json({ success: true });
  } catch (error) {
    return normalizeError(error, response);
  }
});

router.post('/admin/login', loginLimiter, async (request, response) => {
  if (!request.get('origin')) return response.status(403).json({ error: 'Request origin is required.' });
  const emailAddress = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  const password = typeof request.body?.password === 'string' ? request.body.password : '';
  if (emailAddress.length > 254 || password.length > 200) return response.status(400).json({ error: 'Email or password is invalid.' });
  try {
    const admin = await AdminUser.findOne({ email: emailAddress }).select('+passwordHash');
    const passwordValid = admin && await bcrypt.compare(password, admin.passwordHash);
    if (!passwordValid || !admin.active || admin.role !== 'admin') {
      return response.status(401).json({ error: 'Invalid email or password.' });
    }
    admin.lastLoginAt = new Date();
    await admin.save();
    const csrfToken = createAdminSession(admin, response);
    return response.json({ admin: { email: admin.email, role: admin.role }, csrfToken });
  } catch (error) {
    return normalizeError(error, response);
  }
});

router.post('/admin/logout', authenticateAdmin, (request, response) => {
  clearAdminSession(response);
  response.json({ success: true });
});

router.get('/admin/session', authenticateAdmin, (request, response) => {
  response.json({ admin: { email: request.admin.email, role: request.admin.role }, csrfToken: request.csrfToken });
});

router.use('/admin', authenticateAdmin);

router.get('/admin/dashboard', async (request, response, next) => {
  try {
    const [total, pendingReview, quoted, inProduction, completed, cancelled, recent] = await Promise.all([
      Submission.countDocuments(),
      Submission.countDocuments({ status: 'Pending Review' }),
      Submission.countDocuments({ status: 'Quoted' }),
      Submission.countDocuments({ status: 'In Production' }),
      Submission.countDocuments({ status: 'Completed' }),
      Submission.countDocuments({ status: 'Cancelled' }),
      Submission.find().sort({ createdAt: -1 }).limit(10).select('reference customer serviceType status createdAt'),
    ]);
    response.json({ statistics: { total, pendingReview, quoted, inProduction, completed, cancelled }, recent });
  } catch (error) {
    next(error);
  }
});

const buildOrderQuery = (query) => {
  const filter = {};
  if (typeof query.status === 'string' && ['Pending Review', 'Quoted', 'In Production', 'Completed', 'Cancelled'].includes(query.status)) {
    filter.status = query.status;
  }
  if (typeof query.serviceType === 'string' && query.serviceType.length <= 80) filter.serviceType = query.serviceType;
  if (typeof query.search === 'string' && query.search.trim()) {
    const escaped = query.search.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { reference: { $regex: escaped, $options: 'i' } },
      { 'customer.name': { $regex: escaped, $options: 'i' } },
      { 'customer.email': { $regex: escaped, $options: 'i' } },
    ];
  }
  if (typeof query.from === 'string' || typeof query.to === 'string') {
    filter.createdAt = {};
    if (typeof query.from === 'string' && !Number.isNaN(Date.parse(query.from))) filter.createdAt.$gte = new Date(query.from);
    if (typeof query.to === 'string' && !Number.isNaN(Date.parse(query.to))) filter.createdAt.$lte = new Date(query.to);
  }
  return filter;
};

const listAdminSubmissions = async (request, response, next) => {
  try {
    const page = Math.max(1, Math.min(10_000, Number.parseInt(request.query.page, 10) || 1));
    const limit = Math.max(1, Math.min(100, Number.parseInt(request.query.limit, 10) || 25));
    const filter = buildOrderQuery(request.query);
    const [items, total] = await Promise.all([
      Submission.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
        .select('-accessTokenHash -project.specifications')
        .lean(),
      Submission.countDocuments(filter),
    ]);
    response.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

router.get('/admin/orders', listAdminSubmissions);
router.get('/admin/submissions', listAdminSubmissions);

router.get('/admin/orders/:id', async (request, response, next) => {
  try {
    const query = objectId(request.params.id) ? { _id: request.params.id } : { reference: request.params.id };
    const submission = await Submission.findOne(query).select('-accessTokenHash');
    if (!submission) return response.status(404).json({ error: 'Submission was not found.' });
    response.json({ submission });
  } catch (error) {
    next(error);
  }
});

router.patch('/admin/orders/:id/status', async (request, response, next) => {
  try {
    const schema = z.object({
      status: z.enum(['Pending Review', 'Quoted', 'In Production', 'Completed', 'Cancelled']),
      adminNotes: text(10_000).optional(),
      quotedAmount: z.number().nonnegative().nullable().optional(),
      paymentStatus: z.enum(['Not Applicable', 'Unpaid', 'Paid', 'Refunded']).optional(),
    }).strict();
    const update = schema.parse(request.body);
    const query = objectId(request.params.id) ? { _id: request.params.id } : { reference: request.params.id };
    const submission = await Submission.findOne(query);
    if (!submission) return response.status(404).json({ error: 'Submission was not found.' });
    const previousStatus = submission.status;
    submission.status = update.status;
    if (update.adminNotes !== undefined) submission.adminNotes = update.adminNotes;
    if (update.quotedAmount !== undefined) submission.quotedAmount = update.quotedAmount ?? undefined;
    if (update.paymentStatus !== undefined) submission.paymentStatus = update.paymentStatus;
    await submission.save();
    await AuditLog.create({
      admin: request.admin._id,
      action: 'submission.updated',
      submission: submission._id,
      changes: {
        previousStatus,
        status: submission.status,
        ...(update.adminNotes !== undefined ? { adminNotesUpdated: true } : {}),
        ...(update.quotedAmount !== undefined ? { quotedAmount: update.quotedAmount } : {}),
        ...(update.paymentStatus !== undefined ? { paymentStatus: update.paymentStatus } : {}),
      },
      ipAddress: request.ip,
    });
    if (previousStatus !== submission.status) {
      await sendStatusNotification(submission).catch(async () => {
        await NotificationLog.create({
          submission: submission._id,
          type: 'status-update',
          recipient: submission.customer.email,
          status: 'failed',
          errorCode: 'SMTP_SEND_FAILED',
        });
      });
    }
    response.json({ submission });
  } catch (error) {
    if (error?.name === 'ZodError') return normalizeError(error, response);
    next(error);
  }
});

router.post('/admin/orders/:id/notifications/retry', async (request, response, next) => {
  try {
    const query = objectId(request.params.id) ? { _id: request.params.id } : { reference: request.params.id };
    const submission = await Submission.findOne(query);
    if (!submission) return response.status(404).json({ error: 'Submission was not found.' });
    const retryAdmin = submission.emailNotifications.admin === 'failed';
    const retryCustomer = submission.emailNotifications.customer === 'failed';
    if (!retryAdmin && !retryCustomer) {
      return response.status(409).json({ error: 'There are no failed submission notifications to retry.' });
    }
    const accessToken = createCustomerAccessToken(submission.requestId);
    await sendSubmissionNotifications(submission, {
      accessToken,
      admin: retryAdmin,
      customer: retryCustomer,
    });
    await AuditLog.create({
      admin: request.admin._id,
      action: 'submission.notifications_retried',
      submission: submission._id,
      changes: { admin: retryAdmin, customer: retryCustomer },
      ipAddress: request.ip,
    });
    response.json({ emailNotifications: submission.emailNotifications });
  } catch (error) {
    next(error);
  }
});

router.get('/admin/orders/:id/files/:fileId', async (request, response, next) => {
  try {
    const query = objectId(request.params.id) ? { _id: request.params.id } : { reference: request.params.id };
    const submission = await Submission.findOne(query);
    if (!submission) return response.status(404).json({ error: 'Submission was not found.' });
    const file = submission.files.id(request.params.fileId);
    if (!file || file.status !== 'uploaded') return response.status(404).json({ error: 'Uploaded file was not found.' });
    if (file.scanStatus !== 'clean') {
      return response.status(423).json({ error: 'This file is unavailable until it has been reviewed for malware.' });
    }
    response.json({ url: await createSignedDownload(file.storageKey), expiresInSeconds: 60 });
  } catch (error) {
    next(error);
  }
});

router.patch('/admin/orders/:id/files/:fileId/scan', async (request, response, next) => {
  try {
    const parsed = z.object({
      status: z.enum(['clean', 'rejected']),
      reviewNote: text(1000, true).min(10),
    }).strict().parse(request.body);
    const query = objectId(request.params.id) ? { _id: request.params.id } : { reference: request.params.id };
    const submission = await Submission.findOne(query);
    if (!submission) return response.status(404).json({ error: 'Submission was not found.' });
    const file = submission.files.id(request.params.fileId);
    if (!file || file.status !== 'uploaded') return response.status(404).json({ error: 'Uploaded file was not found.' });
    const previousStatus = file.scanStatus;
    file.scanStatus = parsed.status;
    file.scanReviewedAt = new Date();
    file.scanReviewNote = parsed.reviewNote;
    if (parsed.status === 'rejected') file.status = 'rejected';
    await submission.save();
    await AuditLog.create({
      admin: request.admin._id,
      action: 'project-file.reviewed',
      submission: submission._id,
      changes: { fileId: String(file._id), previousStatus, scanStatus: parsed.status, reviewNote: parsed.reviewNote },
      ipAddress: request.ip,
    });
    response.json({ file: { id: file._id, scanStatus: file.scanStatus, status: file.status } });
  } catch (error) {
    if (error?.name === 'ZodError') return normalizeError(error, response);
    next(error);
  }
});

router.get('/admin/notifications', async (request, response, next) => {
  try {
    const page = Math.max(1, Math.min(10_000, Number.parseInt(request.query.page, 10) || 1));
    const limit = Math.max(1, Math.min(100, Number.parseInt(request.query.limit, 10) || 25));
    const [items, total] = await Promise.all([
      NotificationLog.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      NotificationLog.countDocuments(),
    ]);
    response.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
});

export default router;

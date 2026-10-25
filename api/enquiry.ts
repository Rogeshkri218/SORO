import type { IncomingMessage, ServerResponse } from 'node:http';

const RECIPIENT = 'orders@sorofabrication.in';
const MAX_BODY_BYTES = 48 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitBuckets = new Map<string, { count: number; expiresAt: number }>();

type EnquiryType = 'pcb-project' | 'quote' | 'contact';
type EnquiryRequest = IncomingMessage & { body?: unknown };
type EnquiryEnvironment = Record<string, string | undefined>;
type EnquiryData = Record<string, unknown>;
type NormalizedEnquiry = {
  type: EnquiryType;
  subjectType: string;
  replyTo: string;
  customerName: string;
  companyName: string;
  phone: string;
  fields: Array<[string, string]>;
};

const projectTypes: Record<string, string> = {
  'pcb-layout': 'PCB Layout',
  'pcb-design': 'PCB Design',
  'mechanical-design': 'Mechanical Design',
};

const pcbSoftware = ['Altium Designer', 'KiCad', 'Cadence / OrCAD', 'Not sure yet'];
const cadSoftware = ['Not sure yet', 'AutoCAD', 'Fusion 360', 'SolidWorks', 'FreeCAD', 'Other'];
const quoteCategories = [
  'PCB Schematic Design',
  'PCB Layout',
  'Electronic Product Development',
  'Prototype Assembly',
  '3D CAD or 3D Printing',
  'Other Engineering Enquiry',
];
const quoteContactMethods = ['Email', 'Phone Call', 'WhatsApp', 'Video Call'];
const pcbContactMethods = ['Email', 'Phone call', 'Other'];
const quoteBudgetRanges = [
  'Under ₹10,000',
  '₹10,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹5,00,000',
  'Above ₹5,00,000',
  'Prefer not to say',
];
const pcbDeliverables = [
  'Schematic source files',
  'PCB layout source files',
  'Gerber / fabrication outputs',
  'Bill of Materials (BOM)',
  'Assembly drawings',
  'CAD models or drawings',
];

const safeText = (value: unknown, label: string, maxLength: number, required = false): string => {
  if (value === undefined || value === null) {
    if (required) throw new Error(`${label} is required.`);
    return '';
  }
  if (typeof value !== 'string') throw new Error(`${label} is invalid.`);
  const normalized = Array.from(value)
    .filter((character) => {
      const codePoint = character.codePointAt(0)!;
      return !((codePoint < 0x20 && ![0x09, 0x0a, 0x0d].includes(codePoint)) || (codePoint >= 0x7f && codePoint <= 0x9f));
    })
    .join('')
    .trim();
  if (normalized.length > maxLength) throw new Error(`${label} is too long.`);
  if (required && !normalized) throw new Error(`${label} is required.`);
  return normalized;
};

const safeEmail = (value: unknown): string => {
  const email = safeText(value, 'Email address', 254, true);
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    throw new Error('A valid email address is required.');
  }
  return email;
};

const safePhone = (value: unknown, required: boolean): string => {
  const phone = safeText(value, 'Phone number', 40, required);
  if (phone && !/^\+?[1-9][\d\s().-]{5,24}$/.test(phone)) {
    throw new Error('A valid phone number is required.');
  }
  const digits = phone.replace(/\D/g, '');
  if (phone && (digits.length < 7 || digits.length > 15)) {
    throw new Error('A valid phone number is required.');
  }
  return phone;
};

const safeDate = (value: unknown): string => {
  const date = safeText(value, 'Project deadline', 10);
  if (date) {
    const parsedDate = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== date) {
      throw new Error('Project deadline is invalid.');
    }
  }
  return date;
};

const safeChoice = (value: unknown, label: string, options: string[], required = false): string => {
  const choice = safeText(value, label, 160, required);
  if (choice && !options.includes(choice)) throw new Error(`${label} is invalid.`);
  return choice;
};

const safeStringList = (value: unknown, label: string, options: string[], maxItems: number): string[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > maxItems) throw new Error(`${label} is invalid.`);
  const result = value.map((item) => safeChoice(item, label, options, true));
  if (new Set(result).size !== result.length) throw new Error(`${label} contains duplicates.`);
  return result;
};

const asObject = (value: unknown, label: string): EnquiryData => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(`${label} is invalid.`);
  return value as EnquiryData;
};

const normalizeEnquiry = (body: unknown): NormalizedEnquiry => {
  const request = asObject(body, 'Request');
  const honeypot = safeText(request.website, 'Website', 200);
  if (honeypot) throw new Error('Request rejected.');

  if (request.type === 'pcb-project') {
    const data = asObject(request.data, 'Project enquiry');
    const projectType = safeChoice(data.projectType, 'Project type', Object.keys(projectTypes), true);
    const projectLabel = projectTypes[projectType]!;
    const softwareOptions = projectType === 'mechanical-design' ? cadSoftware : pcbSoftware;
    const software = safeChoice(data.software, 'Preferred software', softwareOptions, projectType !== 'mechanical-design');
    const softwareOther = safeText(data.softwareOther, 'Other software', 120);
    const description = safeText(data.description, 'Project description', 10_000, true);
    const quantity = safeText(data.quantity, 'Expected quantity', 300);
    const deliverables = safeStringList(data.deliverables, 'Deliverables', pcbDeliverables, pcbDeliverables.length);
    const constraints = safeText(data.constraints, 'Technical constraints', 5_000);
    const deadline = safeDate(data.deadline);
    const contactMethod = safeChoice(data.contactMethod, 'Preferred contact method', pcbContactMethods);
    const contact = asObject(data.contact, 'Contact details');
    const customerName = safeText(contact.fullName, 'Full name', 120, true);
    const companyName = safeText(contact.companyName, 'Company name', 160);
    const replyTo = safeEmail(contact.email);
    const phone = safePhone(contact.phone, true);
    const filesValue = data.selectedFiles === undefined ? [] : data.selectedFiles;
    if (!Array.isArray(filesValue) || filesValue.length > 50) throw new Error('Selected file list is invalid.');
    let selectedFileBytes = 0;
    const selectedFiles = filesValue.map((entry) => {
      const file = asObject(entry, 'Selected file');
      const name = safeText(file.name, 'File name', 180, true).replace(/[\\/]/g, '_');
      if (typeof file.size !== 'number' || !Number.isSafeInteger(file.size) || file.size < 0 || file.size > 500 * 1024 * 1024) {
        throw new Error('Selected file size is invalid.');
      }
      const acceptedExtensions = [
        '.pdf', '.png', '.jpg', '.jpeg', '.zip', '.7z', '.sch', '.kicad_sch',
        '.kicad_pcb', '.brd', '.pcbdoc', '.schdoc', '.step', '.stp', '.stl',
        '.iges', '.igs', '.dxf', '.dwg', '.csv', '.xlsx',
      ];
      if (!acceptedExtensions.some((extension) => name.toLowerCase().endsWith(extension))) {
        throw new Error('Selected file type is invalid.');
      }
      selectedFileBytes += file.size;
      if (selectedFileBytes > 500 * 1024 * 1024) throw new Error('Selected file total size is invalid.');
      return `${name} (${file.size} bytes)`;
    });
    const fields: Array<[string, string]> = [
      ['Customer name', customerName],
      ['Customer email', replyTo],
      ['Customer phone', phone],
      ['Company name', companyName || 'Not provided'],
      ['Project type', projectLabel],
      [projectType === 'mechanical-design' ? 'Preferred CAD software' : 'Preferred PCB software', software || 'Not specified'],
      ['Other software', softwareOther || 'Not provided'],
      ['Project description', description],
      ['Expected quantity', quantity || 'Not provided'],
      ['Preferred deliverables', deliverables.join(', ') || 'Not specified'],
      ['Additional technical constraints', constraints || 'Not provided'],
      ['Requested deadline', deadline || 'Not provided'],
      ['Preferred contact method', contactMethod || 'No preference'],
      ['Selected file names and sizes (not uploaded or attached)', selectedFiles.join('; ') || 'No files selected'],
    ];
    return { type: 'pcb-project', subjectType: projectLabel, replyTo, customerName, companyName, phone, fields };
  }

  if (request.type === 'quote') {
    const data = asObject(request.data, 'Quote enquiry');
    const customerName = safeText(data.fullName, 'Full name', 120, true);
    const companyName = safeText(data.companyName, 'Company name', 160);
    const replyTo = safeEmail(data.email);
    const phone = safePhone(data.phone, true);
    const category = safeChoice(data.serviceCategory, 'Enquiry type', quoteCategories, true);
    const projectTitle = safeText(data.projectTitle, 'Project title', 180, true);
    const description = safeText(data.projectDescription, 'Project description', 10_000, true);
    if (description.length < 30) throw new Error('Project description must be at least 30 characters.');
    const quantity = safeText(data.estimatedQuantity, 'Expected quantity', 300);
    const budget = safeChoice(data.budgetRange, 'Budget range', quoteBudgetRanges);
    const deadline = safeDate(data.deliveryDate);
    const deliverables = safeText(data.deliverables, 'Deliverables', 2_000);
    const software = safeText(data.designSoftware, 'Design software', 160);
    const contactMethod = safeChoice(data.contactMethod, 'Preferred contact method', quoteContactMethods, true);
    if (data.privacyConsent !== true) throw new Error('Privacy consent is required.');
    const fields: Array<[string, string]> = [
      ['Customer name', customerName],
      ['Customer email', replyTo],
      ['Customer phone', phone],
      ['Company name', companyName || 'Not provided'],
      ['Enquiry type', category],
      ['Project title', projectTitle],
      ['Project description', description],
      ['Expected quantity', quantity || 'Not provided'],
      ['Budget range', budget || 'Not provided'],
      ['Requested deadline', deadline || 'Not provided'],
      ['Preferred deliverables', deliverables || 'Not provided'],
      ['Preferred design software', software || 'Not provided'],
      ['Preferred contact method', contactMethod],
    ];
    return { type: 'quote', subjectType: category, replyTo, customerName, companyName, phone, fields };
  }

  if (request.type === 'contact') {
    const data = asObject(request.data, 'Contact enquiry');
    const customerName = safeText(data.name, 'Name', 120, true);
    const replyTo = safeEmail(data.email);
    const subject = safeText(data.subject, 'Subject', 180, true);
    const message = safeText(data.message, 'Message', 5_000, true);
    if (subject.length < 3 || message.length < 20) throw new Error('Please provide a subject and a message of at least 20 characters.');
    const fields: Array<[string, string]> = [
      ['Customer name', customerName],
      ['Customer email', replyTo],
      ['Customer phone', 'Not provided'],
      ['Company name', 'Not provided'],
      ['Enquiry type', 'General Customer Enquiry'],
      ['Subject', subject],
      ['Message', message],
    ];
    return { type: 'contact', subjectType: 'General Customer Enquiry', replyTo, customerName, companyName: '', phone: '', fields };
  }

  throw new Error('Enquiry type is invalid.');
};

const parseRequestBody = async (request: EnquiryRequest): Promise<unknown> => {
  if (request.body !== undefined) {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) throw new Error('Request is too large.');
    return body;
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > MAX_BODY_BYTES) throw new Error('Request is too large.');
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const isAllowedOrigin = (request: EnquiryRequest, allowedOrigins: string | undefined): boolean => {
  const origin = request.headers.origin;
  if (!origin) return false;
  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    return false;
  }
  const allowed = (allowedOrigins ?? '').split(',').map((item) => item.trim()).filter(Boolean);
  if (allowed.length) {
    return allowed.some((candidate) => {
      try {
        return new URL(candidate).origin === parsedOrigin.origin;
      } catch {
        return false;
      }
    });
  }
  return parsedOrigin.host.toLowerCase() === request.headers.host?.toLowerCase();
};

const getClientKey = (request: EnquiryRequest): string => {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const addresses = forwarded.split(',').map((address) => address.trim()).filter(Boolean);
    if (addresses.length) return addresses[addresses.length - 1]!;
  }
  return request.socket.remoteAddress ?? 'unknown';
};

const isRateLimited = (key: string, now = Date.now()): boolean => {
  for (const [bucketKey, bucket] of rateLimitBuckets) {
    if (bucket.expiresAt <= now) rateLimitBuckets.delete(bucketKey);
  }
  while (rateLimitBuckets.size >= 10_000 && !rateLimitBuckets.has(key)) {
    const oldestKey = rateLimitBuckets.keys().next().value;
    if (!oldestKey) break;
    rateLimitBuckets.delete(oldestKey);
  }
  const current = rateLimitBuckets.get(key);
  if (!current || current.expiresAt <= now) {
    rateLimitBuckets.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
};

const respond = (response: ServerResponse, status: number, body: Record<string, unknown>) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
};

export const createEnquiryHandler = (
  environment: EnquiryEnvironment = process.env,
  fetcher: typeof fetch = fetch,
) => async (request: EnquiryRequest, response: ServerResponse): Promise<void> => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    respond(response, 405, { error: 'Only POST requests are supported.' });
    return;
  }

  const contentType = request.headers['content-type']?.split(';', 1)[0]?.trim().toLowerCase();
  if (contentType !== 'application/json') {
    respond(response, 415, { error: 'The request must use JSON.' });
    return;
  }

  if (!isAllowedOrigin(request, environment.ENQUIRY_ALLOWED_ORIGINS)) {
    respond(response, 403, { error: 'Request origin is not allowed.' });
    return;
  }

  if (isRateLimited(getClientKey(request))) {
    respond(response, 429, { error: 'Too many enquiries. Please try again later.' });
    return;
  }

  let enquiry: NormalizedEnquiry;
  try {
    enquiry = normalizeEnquiry(await parseRequestBody(request));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request is invalid.';
    const status = message === 'Request is too large.' ? 413 : 400;
    respond(response, status, { error: message });
    return;
  }

  const apiKey = environment.RESEND_API_KEY?.trim();
  const fromEmail = environment.ENQUIRY_FROM_EMAIL?.trim();
  if (!apiKey || !fromEmail || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fromEmail)) {
    respond(response, 503, { error: 'Email delivery is not configured.' });
    return;
  }

  const text = enquiry.fields.map(([label, value]) => `${label}:\n${value}`).join('\n\n');
  try {
    const providerResponse = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        from: `SORO Website <${fromEmail}>`,
        to: [RECIPIENT],
        reply_to: enquiry.replyTo,
        subject: `New SORO Website Enquiry – ${enquiry.subjectType}`,
        text,
      }),
    });
    if (!providerResponse.ok) {
      respond(response, 502, { error: 'The email service could not accept this enquiry. Please retry.' });
      return;
    }
    respond(response, 200, { success: true });
  } catch {
    respond(response, 502, { error: 'The email service is temporarily unavailable. Please retry.' });
  }
};

export default createEnquiryHandler();

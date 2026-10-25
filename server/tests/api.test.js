import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import jwt from 'jsonwebtoken';

process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.TRUST_PROXY_HOPS = '0';

const { createApp } = await import('../app.js');
const { validateUploadDetails } = await import('../services/storage.js');
const { AdminUser } = await import('../models/AdminUser.js');
const { NotificationLog } = await import('../models/NotificationLog.js');
const { Submission } = await import('../models/Submission.js');
const app = createApp();
const server = createServer(app);
let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  baseUrl = `http://127.0.0.1:${address.port}/api`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('health reports degraded when the database is not connected', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json().then(({ status, database }) => ({ status, database })), {
    status: 'degraded',
    database: 'disconnected',
  });
});

test('API requests fail clearly while the database is unavailable', async () => {
  app.locals.databaseReady = false;
  const response = await fetch(`${baseUrl}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:5173',
    },
    body: JSON.stringify({}),
  });
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /not ready/i);
});

test('submission rejects requests without an origin', async () => {
  app.locals.databaseReady = true;
  const response = await fetch(`${baseUrl}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(response.status, 403);
});

test('submission validates the request body before persistence', async () => {
  app.locals.databaseReady = true;
  const response = await fetch(`${baseUrl}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:5173',
    },
    body: JSON.stringify({}),
  });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /check the submitted fields/i);
});

test('a valid submission fails closed when customer-access secrets are unconfigured', async () => {
  app.locals.databaseReady = true;
  delete process.env.CUSTOMER_TOKEN_SECRET;
  const response = await fetch(`${baseUrl}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:5173',
    },
    body: JSON.stringify({
      type: 'contact',
      requestId: '274bff8d-b9b5-4f72-b51f-6f8847014920',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test enquiry',
        message: 'This is a controlled test enquiry message.',
      },
    }),
  });
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /customer access is not configured/i);
});

test('untrusted frontend origins are rejected', async () => {
  const response = await fetch(`${baseUrl}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://untrusted.example',
    },
    body: JSON.stringify({}),
  });
  assert.equal(response.status, 403);
});

test('invalid configured client origins fail during application startup', () => {
  const previousOrigin = process.env.CLIENT_ORIGIN;
  try {
    process.env.CLIENT_ORIGIN = 'https://soro.example/path';
    assert.throws(() => createApp(), /CLIENT_ORIGIN/);
  } finally {
    if (previousOrigin === undefined) delete process.env.CLIENT_ORIGIN;
    else process.env.CLIENT_ORIGIN = previousOrigin;
  }
});

test('project file validation rejects unsafe names and unsupported types', () => {
  assert.throws(
    () => validateUploadDetails({ name: '../design.pdf', size: 100, contentType: 'application/pdf' }, 0),
    /File name is invalid/,
  );
  assert.throws(
    () => validateUploadDetails({ name: 'design.exe', size: 100, contentType: 'application/octet-stream' }, 0),
    /file type is not supported/i,
  );
  assert.deepEqual(
    validateUploadDetails({ name: 'design.pdf', size: 100, contentType: 'application/pdf' }, 0),
    { originalName: 'design.pdf', size: 100, contentType: 'application/pdf' },
  );
});

test('submission records are persisted, retries are idempotent, and unverified recipient email is not sent', async () => {
  const environmentKeys = [
    'CUSTOMER_TOKEN_SECRET',
    'ENQUIRY_RECIPIENT_VERIFIED',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM_EMAIL',
  ];
  const previousEnvironment = new Map(environmentKeys.map((key) => [key, process.env[key]]));
  const originalFindOne = Submission.findOne;
  const originalCreate = Submission.create;
  const originalLogCreate = NotificationLog.create;
  const records = new Map();
  const notificationLogs = [];
  let createCalls = 0;
  let saveCalls = 0;

  process.env.CUSTOMER_TOKEN_SECRET = randomBytes(32).toString('hex');
  process.env.ENQUIRY_RECIPIENT_VERIFIED = 'false';
  for (const key of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM_EMAIL']) {
    delete process.env[key];
  }
  Submission.findOne = async ({ requestId }) => records.get(requestId) ?? null;
  Submission.create = async (data) => {
    createCalls += 1;
    const record = {
      ...data,
      _id: '0123456789abcdef01234567',
      status: 'Pending Review',
      emailNotifications: { admin: 'pending', customer: 'pending' },
      files: [],
      createdAt: new Date(),
      project: { ...data.project, deliverables: [], specifications: {} },
      async save() {
        saveCalls += 1;
      },
    };
    records.set(data.requestId, record);
    return record;
  };
  NotificationLog.create = async (log) => {
    notificationLogs.push(log);
    return log;
  };

  try {
    app.locals.databaseReady = true;
    const payload = {
      type: 'contact',
      requestId: '274bff8d-b9b5-4f72-b51f-6f8847014920',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test enquiry',
        message: 'This is a controlled test enquiry message.',
      },
    };
    const submit = () => fetch(`${baseUrl}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
        'Idempotency-Key': payload.requestId,
      },
      body: JSON.stringify(payload),
    });
    const firstResponse = await submit();
    assert.equal(firstResponse.status, 201);
    const firstResult = await firstResponse.json();
    assert.equal(firstResult.success, true);
    assert.equal(firstResult.submission.emailNotifications.admin, 'failed');
    assert.equal(firstResult.submission.emailNotifications.customer, 'failed');
    assert.equal(createCalls, 1);
    assert.ok(saveCalls > 0);
    assert.ok(notificationLogs.some((log) => log.type === 'admin-new-submission' && log.errorCode === 'RECIPIENT_NOT_VERIFIED'));

    const retryResponse = await submit();
    assert.equal(retryResponse.status, 200);
    const retryResult = await retryResponse.json();
    assert.equal(retryResult.submission.reference, firstResult.submission.reference);
    assert.equal(createCalls, 1);
  } finally {
    Submission.findOne = originalFindOne;
    Submission.create = originalCreate;
    NotificationLog.create = originalLogCreate;
    for (const [key, value] of previousEnvironment) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test('database persistence failures return an error rather than a success response', async () => {
  const previousSecret = process.env.CUSTOMER_TOKEN_SECRET;
  const originalFindOne = Submission.findOne;
  process.env.CUSTOMER_TOKEN_SECRET = randomBytes(32).toString('hex');
  Submission.findOne = async () => {
    throw new Error('database unavailable');
  };

  try {
    app.locals.databaseReady = true;
    const response = await fetch(`${baseUrl}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
      },
      body: JSON.stringify({
        type: 'contact',
        requestId: '48bfdf27-7a7e-4d16-a78d-1e423a965937',
        data: {
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test enquiry',
          message: 'This is a controlled test enquiry message.',
        },
      }),
    });
    assert.equal(response.status, 500);
    assert.match((await response.json()).error, /could not be completed/i);
  } finally {
    Submission.findOne = originalFindOne;
    if (previousSecret === undefined) delete process.env.CUSTOMER_TOKEN_SECRET;
    else process.env.CUSTOMER_TOKEN_SECRET = previousSecret;
  }
});

test('administrator endpoints require a valid active admin session and CSRF on mutations', async () => {
  const previousSecret = process.env.JWT_SECRET;
  const originalFindOne = AdminUser.findOne;
  const secret = randomBytes(32).toString('hex');
  const subject = '0123456789abcdef01234567';
  const csrf = 'a'.repeat(48);
  process.env.JWT_SECRET = secret;
  let lookup;
  let lookups = 0;
  AdminUser.findOne = (filter) => {
    lookup = filter;
    lookups += 1;
    return {
      select: async () => ({ _id: subject, email: 'admin@example.com', role: 'admin', active: true }),
    };
  };
  const token = jwt.sign({ csrf }, secret, {
    subject,
    issuer: 'soro-api',
    audience: 'soro-admin',
    expiresIn: '5m',
  });
  const headers = {
    Origin: 'http://localhost:5173',
    Cookie: `soro_admin_session=${token}`,
  };

  try {
    app.locals.databaseReady = true;
    const missingSession = await fetch(`${baseUrl}/admin/session`, { headers: { Origin: 'http://localhost:5173' } });
    assert.equal(missingSession.status, 401);

    const session = await fetch(`${baseUrl}/admin/session`, { headers });
    assert.equal(session.status, 200);
    assert.deepEqual(lookup, { _id: subject, active: true, role: 'admin' });
    assert.equal((await session.json()).admin.role, 'admin');

    const mutationWithoutCsrf = await fetch(`${baseUrl}/admin/logout`, { method: 'POST', headers });
    assert.equal(mutationWithoutCsrf.status, 403);
    assert.equal(lookups, 1);

    AdminUser.findOne = () => ({
      select: async () => ({ _id: subject, email: 'admin@example.com', role: 'customer', active: true }),
    });
    const invalidRole = await fetch(`${baseUrl}/admin/session`, { headers });
    assert.equal(invalidRole.status, 401);
  } finally {
    AdminUser.findOne = originalFindOne;
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});

test('file download stays locked and the API rejects attempts to mark files clean', async () => {
  const previousSecret = process.env.JWT_SECRET;
  const originalAdminFindOne = AdminUser.findOne;
  const originalSubmissionFindOne = Submission.findOne;
  const secret = randomBytes(32).toString('hex');
  const subject = '0123456789abcdef01234567';
  process.env.JWT_SECRET = secret;
  const token = jwt.sign({ csrf: 'b'.repeat(48) }, secret, {
    subject,
    issuer: 'soro-api',
    audience: 'soro-admin',
    expiresIn: '5m',
  });
  const headers = {
    Origin: 'http://localhost:5173',
    Cookie: `soro_admin_session=${token}`,
    'X-CSRF-Token': 'b'.repeat(48),
  };
  AdminUser.findOne = () => ({
    select: async () => ({ _id: subject, email: 'admin@example.com', role: 'admin', active: true }),
  });
  Submission.findOne = async () => ({
    files: {
      id: () => ({ _id: 'abcdefabcdefabcdefabcdef', status: 'uploaded', scanStatus: 'pending' }),
    },
  });

  try {
    app.locals.databaseReady = true;
    const cleanAttempt = await fetch(`${baseUrl}/admin/orders/SR-TEST/files/abcdefabcdefabcdefabcdef/scan`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'clean', reviewNote: 'Manual review completed and clean.' }),
    });
    assert.equal(cleanAttempt.status, 400);

    const download = await fetch(`${baseUrl}/admin/orders/SR-TEST/files/abcdefabcdefabcdefabcdef`, { headers });
    assert.equal(download.status, 423);
    assert.match((await download.json()).error, /malware scanning/i);
  } finally {
    AdminUser.findOne = originalAdminFindOne;
    Submission.findOne = originalSubmissionFindOne;
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});

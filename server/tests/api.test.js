import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:http';

process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.TRUST_PROXY_HOPS = '0';

const { createApp } = await import('../app.js');
const { validateUploadDetails } = await import('../services/storage.js');
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

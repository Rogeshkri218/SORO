import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

const allowedExtensions = [
  '.pdf', '.png', '.jpg', '.jpeg', '.zip', '.7z', '.sch', '.kicad_sch',
  '.kicad_pcb', '.brd', '.pcbdoc', '.schdoc', '.step', '.stp', '.stl',
  '.iges', '.igs', '.dxf', '.dwg', '.csv', '.xlsx',
];

const mimeByExtension = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.zip': 'application/zip',
  '.7z': 'application/x-7z-compressed',
  '.sch': 'application/octet-stream',
  '.kicad_sch': 'application/octet-stream',
  '.kicad_pcb': 'application/octet-stream',
  '.brd': 'application/octet-stream',
  '.pcbdoc': 'application/octet-stream',
  '.schdoc': 'application/octet-stream',
  '.step': 'model/step',
  '.stp': 'model/step',
  '.stl': 'model/stl',
  '.iges': 'model/iges',
  '.igs': 'model/iges',
  '.dxf': 'application/dxf',
  '.dwg': 'application/acad',
  '.csv': 'text/csv',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

let storageClient;

const getStorageClient = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    const error = new Error('Private project file storage is not configured.');
    error.statusCode = 503;
    throw error;
  }
  if (!storageClient) {
    storageClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return storageClient;
};

const configuredLimit = (name, fallback) => {
  const value = process.env[name] === undefined ? fallback : Number(process.env[name]);
  if (!Number.isSafeInteger(value) || value < 1) {
    throw Object.assign(new Error(`${name} must be a positive integer.`), { statusCode: 503 });
  }
  return value;
};

export const validateUploadDetails = (file, totalBytes) => {
  if (!file || typeof file !== 'object' || Array.isArray(file)) {
    throw Object.assign(new Error('File metadata is invalid.'), { statusCode: 400 });
  }
  const originalName = typeof file.name === 'string' ? file.name.trim() : '';
  const containsControlCharacter = Array.from(originalName).some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
  if (!originalName || originalName.length > 180 || originalName.includes('/') || originalName.includes('\\') || containsControlCharacter) {
    throw Object.assign(new Error('File name is invalid.'), { statusCode: 400 });
  }
  const normalizedName = originalName.toLowerCase();
  const extension = allowedExtensions.find((allowed) => normalizedName.endsWith(allowed));
  if (!extension) throw Object.assign(new Error('This file type is not supported.'), { statusCode: 415 });
  const size = file.size;
  const perFileLimit = configuredLimit('MAX_UPLOAD_FILE_BYTES', 100 * 1024 * 1024);
  const totalLimit = configuredLimit('MAX_UPLOAD_TOTAL_BYTES', 500 * 1024 * 1024);
  if (!Number.isSafeInteger(size) || size <= 0 || size > perFileLimit || totalBytes + size > totalLimit) {
    throw Object.assign(new Error('The selected file exceeds the configured upload limit.'), { statusCode: 413 });
  }
  const expectedMime = mimeByExtension[extension];
  const suppliedMime = typeof file.contentType === 'string' ? file.contentType.toLowerCase() : '';
  if (suppliedMime && suppliedMime !== expectedMime && suppliedMime !== 'application/octet-stream') {
    throw Object.assign(new Error('The file type does not match its extension.'), { statusCode: 415 });
  }
  return { originalName, size, contentType: expectedMime };
};

export const createSignedUpload = async ({ reference, file, existingKey }) => {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'soro-project-files';
  const safeName = file.originalName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120);
  const storageKey = existingKey || `submissions/${reference}/${randomUUID()}-${safeName}`;
  const { data, error } = await getStorageClient().storage.from(bucket).createSignedUploadUrl(storageKey, {
    upsert: false,
  });
  if (error || !data?.token) {
    throw Object.assign(new Error('Could not prepare a secure project-file upload.'), { statusCode: 502 });
  }
  return { storageKey, token: data.token };
};

export const confirmStoredObject = async (storageKey, expectedSize) => {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'soro-project-files';
  const [folder, ...remaining] = storageKey.split('/');
  const filename = remaining.pop();
  const prefix = [folder, ...remaining].join('/');
  const { data, error } = await getStorageClient().storage.from(bucket).list(prefix, {
    limit: 100,
    search: filename,
  });
  if (error) throw Object.assign(new Error('Could not verify the uploaded file.'), { statusCode: 502 });
  const entry = (data ?? []).find((item) => item.name === filename);
  if (!entry) return false;
  const rawSize = entry.metadata?.size;
  const actualSize = Number(rawSize);
  if (expectedSize !== undefined && (rawSize === undefined || rawSize === null || !Number.isSafeInteger(actualSize))) {
    throw Object.assign(new Error('The storage service did not provide a verifiable file size.'), { statusCode: 502 });
  }
  if (expectedSize !== undefined && actualSize !== expectedSize) {
    const { error: removeError } = await getStorageClient().storage.from(bucket).remove([storageKey]);
    if (removeError) {
      throw Object.assign(new Error('The invalid upload could not be removed from private storage.'), { statusCode: 502 });
    }
    throw Object.assign(new Error('The uploaded file size does not match its declaration.'), { statusCode: 413 });
  }
  return true;
};

export const createSignedDownload = async (storageKey) => {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'soro-project-files';
  const { data, error } = await getStorageClient().storage.from(bucket).createSignedUrl(storageKey, 60);
  if (error || !data?.signedUrl) {
    throw Object.assign(new Error('Could not prepare a secure download.'), { statusCode: 502 });
  }
  return data.signedUrl;
};

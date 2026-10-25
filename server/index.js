import 'dotenv/config';
import { createServer } from 'node:http';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { closeDatabase, connectDatabase } from './config/database.js';

const port = Number(process.env.PORT || 5000);
const app = createApp();
const server = createServer(app);
let retryTimer;
let shuttingDown = false;

const shutdown = async (signal) => {
  shuttingDown = true;
  console.info(`${signal} received; shutting down SORO API.`);
  if (retryTimer) clearInterval(retryTimer);
  server.close(async () => {
    await closeDatabase();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

mongoose.connection.on('disconnected', () => {
  app.locals.databaseReady = false;
  console.error('MongoDB connection was lost.');
  if (!shuttingDown && !retryTimer) retryTimer = setInterval(() => void connectWithRetry(), 10_000);
});

mongoose.connection.on('connected', () => {
  if (shuttingDown) return;
  app.locals.databaseReady = true;
  if (retryTimer) {
    clearInterval(retryTimer);
    retryTimer = undefined;
  }
});

server.listen(port, '0.0.0.0', () => {
  console.info(`SORO API listening on port ${port}.`);
});

const connectWithRetry = async () => {
  try {
    await connectDatabase();
    app.locals.databaseReady = true;
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = undefined;
    }
    console.info('MongoDB connection is ready.');
  } catch (error) {
    app.locals.databaseReady = false;
    console.error('MongoDB is not ready:', error instanceof Error ? error.name : 'unknown error');
    if (!retryTimer) retryTimer = setInterval(() => void connectWithRetry(), 10_000);
  }
};

void connectWithRetry();

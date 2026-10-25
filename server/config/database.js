import mongoose from 'mongoose';

let connectionPromise;

mongoose.connection.on('disconnected', () => {
  connectionPromise = undefined;
});

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured.');

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || undefined,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
      autoIndex: process.env.NODE_ENV !== 'production',
    }).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }
  await connectionPromise;
  return mongoose.connection;
};

export const closeDatabase = async () => {
  connectionPromise = undefined;
  await mongoose.disconnect();
};

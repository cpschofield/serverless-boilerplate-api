import mongoose from 'mongoose';

let isConnected;

export const mongoConnect = async () => {
  if (isConnected) {
    return Promise.resolve();
  }

  const db = await mongoose.connect(process.env.DB, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  });

  isConnected = db.connections[0].readyState;
  return db;
};

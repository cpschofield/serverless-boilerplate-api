import mongoose from 'mongoose';

let isConnected;

export const connectToDB = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  const db = await mongoose.connect(process.env.DB, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  });

  isConnected = db.connections[0].readyState;
  return db;
};

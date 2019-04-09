import mongoose from 'mongoose';

class MongoDatasource {
  constructor() {
    this.isConnected = false;
    this.db = null;
  }

  connect = async () => {
    if (this.isConnected) {
      return this.db;
    }

    this.db = await mongoose.connect(process.env.DB, {
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
    });

    this.isConnected = this.db.connections[0].readyState;
    return this.db;
  };
}

export const mongoDatasource = new MongoDatasource();

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

mongoose.model('User', UserSchema);

export const User = mongoose.model('User');

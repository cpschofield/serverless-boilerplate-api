import jwt from 'jsonwebtoken';

export const token = id => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: 86400,
});

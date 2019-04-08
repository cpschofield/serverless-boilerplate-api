import bcrypt from 'bcryptjs-then';
import { mongoConnect } from '../datasources';
import { User } from '../models';

export class UserService {
  find = async (options = {}) => {
    await mongoConnect();
    return User.find(options);
  };

  findOne = async (options = {}) => {
    await mongoConnect();
    return User.findOne(options);
  };

  findById = async (id) => {
    await mongoConnect();
    return User.findById(id, { password: 0 });
  };

  create = async (body) => {
    await mongoConnect();
    const existingUser = await this.findOne({ email: body.email });
    const hash = existingUser ? Promise.reject(new Error('User with that email exists.')) : await bcrypt.hash(body.password, 8);
    return User.create({
      name: body.name,
      email: body.email,
      password: hash,
    });
  };

  validPassword = (eventBody) => {
    if (!(eventBody.password && eventBody.password.length >= 7)) {
      return Promise.reject(new Error('Password error. Password needs to be longer than 8 characters.'));
    }

    if (!(eventBody.name && eventBody.name.length > 5 && typeof eventBody.name === 'string')) {
      return Promise.reject(new Error('Username error. Username needs to longer than 5 characters'));
    }

    if (!(eventBody.email && typeof eventBody.name === 'string')) {
      return Promise.reject(new Error('Email error. Email must have valid characters.'));
    }

    return Promise.resolve(true);
  };

  matchPassword = (suppliedPassword, passwordB) => bcrypt.compare(suppliedPassword, passwordB);
}

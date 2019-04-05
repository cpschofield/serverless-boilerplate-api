import bcrypt from 'bcryptjs-then';
import { User } from '../models';
import { mongoConnect } from '../datasources';
import { AuthService } from '../services';
import { validPassword } from '../validation';

export class UserController {
  constructor() {
    this.authService = new AuthService();
  }

  getUsers = async () => {
    try {
      await mongoConnect();
      const users = await User.find({});
      return {
        statusCode: 200,
        body: JSON.stringify(users),
      };
    } catch (e) {
      return {
        statusCode: e.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ message: e.message }),
      };
    }
  };

  login = async (event) => {
    try {
      await mongoConnect();
      const user = await User.findOne({ email: event.body.email });
      // check for no user found and return error
      const auth = await bcrypt.compare(event.body.password, user.password);
      if (!auth) {
        console.log('not auth');
      } // do something
      // check if passwords do not match and return error
      const newtoken = this.authService.createToken(user.id);
      return {
        statusCode: 200,
        body: JSON.stringify({ auth: true, newtoken }),
      };
    } catch (e) {
      return {
        statusCode: e.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ stack: e.stack, message: e.message }),
      };
    }
  };

  register = async (event) => {
    try {
      await mongoConnect();
      const validity = validPassword(event.body.password);
      if (!validity) throw new Error('password mismatch');
      const existingUser = User.findOne({ email: event.body.email });
      const hash = existingUser ? Promise.reject(new Error('User with that email exists.')) : await bcrypt.hash(event.body.password, 8);
      const newUser = User.create({
        name: event.body.name,
        email: event.body.email,
        password: hash,
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ auth: true, token: this.authService.createToken(newUser.id) }),
      };
    } catch (e) {
      return {
        statusCode: e.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ stack: e.stack, message: e.message }),
      };
    }
  };

  me = async (event) => {
    try {
      await mongoConnect();
      const session = await User.findById(event.requestContext.authorizer.principalId, { password: 0 });
      // check for no user found and return error
      return {
        statusCode: 200,
        body: JSON.stringify(session),
      };
    } catch (e) {
      return {
        statusCode: e.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ stack: e.stack, message: e.message }),
      };
    }
  };
}

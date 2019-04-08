import { AuthService, UserService } from '../services';

export class UserController {
  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  getUsers = async () => {
    try {
      const users = await this.userService.find({});
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
      const user = await this.userService.findOne({ email: event.body.email });
      if (!user) throw new Error('user not found');

      const auth = await this.userService.matchPassword(event.body.password, user.password);
      if (!auth || auth === undefined) throw new Error({ message: 'passwords do not match', statusCode: 400 });

      const token = this.authService.createToken(user.id);
      return {
        statusCode: 200,
        body: JSON.stringify({ auth: true, token }),
      };
    } catch (e) {
      return {
        statusCode: e.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ message: e.message }),
      };
    }
  };

  register = async (event) => {
    try {
      const validity = this.userService.validPassword(event.body.password);
      if (!validity) throw new Error('password mismatch');

      const user = await this.userService.create(event.body);
      return {
        statusCode: 200,
        body: JSON.stringify({ auth: true, token: this.authService.createToken(user.id) }),
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
      const session = await this.userService.findById(event.requestContext.authorizer.principalId, { password: 0 });

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

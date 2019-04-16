import { AuthService, UserService } from '../services';
import { error, response } from '../helpers';

export class UserController {
  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  getUsers = async () => {
    try {
      const users = await this.userService.find({});
      return response.success({ data: users });
    } catch (e) {
      return response.error(e);
    }
  };

  login = async (event) => {
    try {
      const user = await this.userService.findOne({ email: event.body.email });
      if (!user || user === undefined) throw error.formatted({ message: 'User not found', statusCode: 400 });

      const auth = await this.userService.matchPassword(event.body.password, user.password);
      if (!auth || auth === undefined) throw error.formatted({ message: 'Password mismatch', statusCode: 400 });

      const token = this.authService.createToken(user.id);
      return response.success({ auth: true, token });
    } catch (e) {
      return response.error(e);
    }
  };

  register = async (event) => {
    try {
      const validity = this.userService.validPassword(event.body.password);
      if (!validity || validity === undefined) throw error.formatted({ message: 'Password mismatch', statusCode: 400 });

      const user = await this.userService.create(event.body);
      return response.success({ auth: true, token: await this.authService.createToken(user.id) });
    } catch (e) {
      return response.error(e);
    }
  };

  me = async (event) => {
    try {
      const session = await this.userService.findById(event.requestContext.authorizer.principalId, { password: 0 });
      if (!session || session === undefined) throw error.formatted({ statusCode: 400 });

      return response.success(session);
    } catch (e) {
      return response.error(e);
    }
  };
}

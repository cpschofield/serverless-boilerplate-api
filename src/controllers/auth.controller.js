import { AuthService } from '../services';
import { error, response } from '../helpers';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  authenticate = async (event) => {
    try {
      if (!event.authorizationToken || event.authorizationToken === undefined) throw error.formatted({ message: 'Unauthorised', statusCode: 403 });

      const validated = await this.authService.validateToken(event.authorizationToken);
      if (!validity || validity === undefined) throw error.formatted({ message: 'Invalid token', statusCode: 403 });

      return response.success(this.authService.createPolicy(validated.id, 'Allow', event.methodArn));
    } catch (e) {
      return response.error(e);
    }
  };
}

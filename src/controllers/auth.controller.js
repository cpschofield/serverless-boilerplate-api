import { AuthService } from '../services';
import { error, response } from '../helpers';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  authenticate = async (event) => {
    try {
      if (!event.authorizationToken || event.authorizationToken === undefined) throw error.formatted({ message: 'Unauthorised', statusCode: 403 });

      const { id } = await this.authService.validateToken(event.authorizationToken);
      if (!id || id === undefined) throw error.formatted({ message: 'Invalid token', statusCode: 403 });

      // this should only return the policy object
      return this.authService.createPolicy(id, 'Allow', event.methodArn);
    } catch (e) {
      return response.error(e);
    }
  };
}

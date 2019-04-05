import { AuthService } from '../services';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async authenticate(event) {
    try {
      if (!event.authorizationToken) throw new Error('Unauthorised');
      const { id } = this.authService.validateToken(event.authorizationToken, process.env.JWT_SECRET);
      return this.authService.createPolicy(id, 'Allow', event.methodArn);
    } catch (e) {
      return {
        statusCode: e.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ message: e.message }),
      };
    }
  }
}

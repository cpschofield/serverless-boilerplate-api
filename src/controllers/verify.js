import jwt from 'jsonwebtoken';
import promisify from 'util';
import { generatePolicy } from '../services';

export class VerifyController {
  constructor() {
    this.promiseVerify = promisify(jwt.verify);
  }

  async verify(event) {
    try {
      const token = event.authorizationToken;
      if (!token) throw new Error('Unauthorised');
      const verified = this.promiseVerify(token, process.env.JWT_SECRET);
      const policy = generatePolicy(verified.id, 'Allow', event.methodArn);
      return policy;
    } catch (e) {
      return {
        statusCode: e.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ message: e.message }),
      };
    }
  }
}

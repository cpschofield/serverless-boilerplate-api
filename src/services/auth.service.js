import jwt from 'jwt-then';
import SchemaObject from 'schema-object';
import { promisify } from 'util';

const NotEmptyString = { type: String, minLength: 1 };

const Statement = new SchemaObject({
  Action: { ...NotEmptyString, default: 'execute-api:Invoke' },
  Effect: NotEmptyString,
  Resource: NotEmptyString,
});

const Document = new SchemaObject({
  Version: { ...NotEmptyString, default: '2012-10-17' },
  Statement: [Statement],
});

const Policy = new SchemaObject({
  policyDocument: Document,
  principalId: String,
});

export class AuthService {
  createPolicy = (id, effect, resource) => {
    const statement = new Statement({ Effect: effect, Resource: resource });
    const document = new Document({ Statement: [statement] });
    return new Policy({ policyDocument: document, principalId: id });
  };

  createToken = id => jwt.sign({ principalId: id }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.TOKEN_DURATION, 10),
  });

  validateToken = token => jwt.verify(token.slice(7), process.env.JWT_SECRET);
}

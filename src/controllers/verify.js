import jwt from 'jsonwebtoken';
import promisify from 'util';

const verify = promisify(jwt.verify);

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports.auth = async (event) => {
  // check header or url parameters or post parameters for token
  const token = event.authorizationToken;

  if (!token) return 'Unauthorized';

  // verifies secret and checks exp
  const verified = verify(token, process.env.JWT_SECRET);
  // , (err, decoded) => {
  // if (err) return callback(null, 'Unauthorized');

  // if everything is good, save to request for use in other routes
  // return callback(null, generatePolicy(verified.id, 'Allow', event.methodArn));
  // });
  return generatePolicy(verified.id, 'Allow', event.methodArn);
};

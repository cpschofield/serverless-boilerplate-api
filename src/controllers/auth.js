import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs-then';
import connectToDB from '../service';
import User from '../model';

/**
 * Helpers
 */
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 86400, // expires in 24 hours
  });
}

function checkIfInputIsValid(eventBody) {
  if (!(eventBody.password && eventBody.password.length >= 7)) {
    return Promise.reject(
      new Error('Password error. Password needs to be longer than 8 characters.'),
    );
  }

  if (!(eventBody.name && eventBody.name.length > 5 && typeof eventBody.name === 'string')) {
    return Promise.reject(new Error('Username error. Username needs to longer than 5 characters'));
  }

  if (!(eventBody.email && typeof eventBody.name === 'string')) {
    return Promise.reject(new Error('Email error. Email must have valid characters.'));
  }

  return Promise.resolve();
}

function register(eventBody) {
  return checkIfInputIsValid(eventBody) // validate input
    .then(
      () => User.findOne({ email: eventBody.email }), // check if user exists
    )
    .then(
      user => (user
        ? Promise.reject(new Error('User with that email exists.'))
        : bcrypt.hash(eventBody.password, 8)), // hash the pass
    )
    .then(
      hash => User.create({
        name: eventBody.name,
        email: eventBody.email,
        password: hash,
      }), // create the new user
    )
    .then(user => ({ auth: true, token: signToken(user.id) })); // sign the token and send it back
}

function comparePassword(eventPassword, userPassword, userId) {
  return bcrypt
    .compare(eventPassword, userPassword)
    .then(passwordIsValid => (!passwordIsValid
      ? Promise.reject(new Error('The credentials do not match.'))
      : signToken(userId)));
}

function login(eventBody) {
  return User.findOne({ email: eventBody.email })
    .then(user => (!user
      ? Promise.reject(new Error('User with that email does not exits.'))
      : comparePassword(eventBody.password, user.password, user.id)))
    .then(token => ({ auth: true, token }));
}

function me(userId) {
  return User.findById(userId, { password: 0 })
    .then(user => (!user ? Promise.reject(new Error('No user found.')) : user))
    .catch(err => Promise.reject(new Error(err)));
}

/*
 * Functions
 */
module.exports.login = async event => connectToDB()
  .then(() => login(JSON.parse(event.body)))
  .then(session => ({
    statusCode: 200,
    body: JSON.stringify(session),
  }))
  .catch(err => ({
    statusCode: err.statusCode || 500,
    headers: { 'Content-Type': 'text/plain' },
    body: { stack: err.stack, message: err.message },
  }));

module.exports.register = async event => connectToDB()
  .then(() => register(JSON.parse(event.body)))
  .then(session => ({
    statusCode: 200,
    body: JSON.stringify(session),
  }))
  .catch(err => ({
    statusCode: err.statusCode || 500,
    headers: { 'Content-Type': 'text/plain' },
    body: err.message,
  }));

module.exports.me = async event => connectToDB()
  .then(() => me(event.requestContext.authorizer.principalId))
  .then(session => ({
    statusCode: 200,
    body: JSON.stringify(session),
  }))
  .catch(err => ({
    statusCode: err.statusCode || 500,
    headers: { 'Content-Type': 'text/plain' },
    body: { stack: err.stack, message: err.message },
  }));
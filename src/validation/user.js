export const validPassword = (eventBody) => {
  if (!(eventBody.password && eventBody.password.length >= 7)) {
    return Promise.reject(new Error('Password error. Password needs to be longer than 8 characters.'));
  }

  if (!(eventBody.name && eventBody.name.length > 5 && typeof eventBody.name === 'string')) {
    return Promise.reject(new Error('Username error. Username needs to longer than 5 characters'));
  }

  if (!(eventBody.email && typeof eventBody.name === 'string')) {
    return Promise.reject(new Error('Email error. Email must have valid characters.'));
  }

  return Promise.resolve(true);
};

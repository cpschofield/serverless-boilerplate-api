import { connectToDB } from '../service';
import { User } from '../model';

/**
 * Functions
 */
const getUsers = async () => {
  try {
    await connectToDB();
    const users = await User.find({});
    return {
      statusCode: 200,
      body: JSON.stringify(users)
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: e.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: e.message })
    };
  }
};

const someMW = (name) => async (event, ctx) => {
  // do something
  console.log(`==> MW ${name} did something`);
  // returns mutated event and contexts
  return Promise.resolve({ event, ctx });
};

const composeMiddleware = (handler, middleware = []) => async (event, ctx) => {
  console.log('run middleware');
  const results = await middleware.reduce(async (promiseChain, currentTask, index) => {
    const chainResults = await promiseChain;
    const currentResult = await currentTask(event, ctx);
    console.log(`==> current task ${index} resolved`);
    return [ ...chainResults, currentResult ];
  }, Promise.resolve([]));
  console.log('END MIDDLEWARE');
  return handler();
};

module.exports.getUsers = async (event, ctx) => composeMiddleware(getUsers, [ someMW(0), someMW(1) ])(event, ctx);

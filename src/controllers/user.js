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
      body: JSON.stringify(users),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: e.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: e.message }),
    };
  }
};

const someMW = async (event, ctx) => {
  // do something
  console.log('==> MW did something');
  // returns mutated event and contexts
  return Promise.resolve({ event, ctx });
};

export const middlewareRunnerX = async (handler, middleware = []) => async (event, ctx) => {
  console.log('run middleware');
  const results = awaitmiddleware.reduce(async (promiseChain, currentTask) => {
    const chainResults = await promiseChain;
    const currentResult = await currentTask(event, ctx);
    console.log('==> current task resolved');
    return [...chainResults, currentResult];
  }, Promise.resolve([]));

  console.log(results);
  return handler();
};

module.exports.getUsers = middlewareRunnerX(getUsers, [someMW, someMW]);

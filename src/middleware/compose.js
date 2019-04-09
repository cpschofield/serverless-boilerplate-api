export const composeMiddleware = (handler, middleware = []) => async (event, ctx) => {
  const mutated = await middleware.reduce(async (promiseChain, currentTask) => {
    const chainResults = await promiseChain;
    const currentResult = chainResults.length === 0 ? await currentTask(event, ctx) : await currentTask(chainResults[0], chainResults[1]);
    return Object.assign(chainResults, currentResult);
  }, Promise.resolve([]));
  return handler(mutated.event || event, mutated.ctx || ctx);
};

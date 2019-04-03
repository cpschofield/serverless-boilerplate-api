const chainMiddleware = async (handler, [middleware, ...otherMiddleware]) => {
  if (middleware) {
    return (event, context) => {
      try {
        return middleware(event, context, chainMiddleware(otherMiddleware));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  return handler;
};

const middlewareHandler = (handler, middlewares = []) => async (event, context) => {
  console.log(event, context);
  try {
    return chainMiddleware(handler, middlewares)(event, context);
  } catch (e) {
    return {
      statusCode: e.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: e.message }),
    };
  }
};

export const use = middlewareHandler;

// const chainMiddleware = (handler, [middleware, ...otherMiddleware]) => {
//   if (middleware) {
//     return async function(event, ctx) {
//       console.log('running middleware');
//       try {
//         const { mutatedEvent, mutatedCtx } = await middleware(event, ctx);
//         console.log('middleware returned');
//         return chainMiddleware(otherMiddleware)(mutatedEvent, mutatedCtx);
//       } catch (e) {
//         return Promise.reject(e);
//       }
//     };
//   }

//   return handler();
// };

export const middlewareRunner = (handler, middleware = []) => async (event, ctx) => {
  console.log('run middleware');
  return chainMiddleware(handler, middleware)(event, ctx);
};

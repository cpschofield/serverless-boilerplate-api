export const bodyParser = () => async (event, ctx) => {
  try {
    const mutatedEvent = Object.assign(event, { body: JSON.parse(event.body) });
    return Promise.resolve({ event: mutatedEvent, ctx });
  } catch (e) {
    return Promise.reject(new Error('Invalid JSON'));
  }
};

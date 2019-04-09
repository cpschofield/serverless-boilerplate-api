class Error {
  formatted = ({ message = 'Unknown error occured', statusCode = null }) => {
    const e = new Error(message);
    e.code = statusCode;
    return e;
  };
}

export const error = new Error();

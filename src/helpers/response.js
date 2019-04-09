class Response {
  constructor() {
    this.headers = { 'Content-Type': 'application/json' };
  }

  error = error => ({
    statusCode: error.statusCode || 500,
    headers: this.headers,
    body: JSON.stringify({ message: error.message }),
  });

  success = data => ({
    statusCode: 200,
    headers: this.headers,
    body: JSON.stringify(data),
  });
}

export const response = new Response();

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${status}] ${message}`, err.stack);
  }

  res.status(status).json({ message });
};

module.exports = errorMiddleware;

const { validationResult } = require('express-validator');

const sendError = (res, message = 'Server Error', status = 500, details = null) => {
  res.status(status).json({ success: false, message, data: details });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  sendError(res, message, status);
};

const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: 'Not Found', data: null });
};

module.exports = { errorHandler, notFound, sendError };

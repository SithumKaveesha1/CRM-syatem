const jwt = require('jsonwebtoken');
const { sendError } = require('./errorHandler');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return sendError(res, 'Unauthorized', 401);
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return sendError(res, 'Unauthorized', 401);
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = payload;
    next();
  } catch (err) {
    return sendError(res, 'Invalid token', 401);
  }
};

module.exports = auth;

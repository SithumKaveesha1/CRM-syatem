const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { sendResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findByEmail(email);
    if (existing) return sendResponse(res, false, 'Email already in use', null, 409);

    const hashed = await bcrypt.hash(password, 10);
    const userId = await User.create({ name, email, password: hashed });
    return sendResponse(res, true, 'User registered', { user_id: userId }, 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return sendResponse(res, false, 'Invalid credentials', null, 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendResponse(res, false, 'Invalid credentials', null, 401);

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return sendResponse(res, true, 'Login successful', { token }, 200);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };

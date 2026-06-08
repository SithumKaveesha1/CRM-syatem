const { body } = require('express-validator');

const registerRules = [body('email').isEmail(), body('password').isLength({ min: 6 }), body('name').notEmpty()];
const loginRules = [body('email').isEmail(), body('password').notEmpty()];

module.exports = { registerRules, loginRules };

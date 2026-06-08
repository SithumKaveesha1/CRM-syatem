const { body } = require('express-validator');

const createCustomer = [body('full_name').notEmpty(), body('email').isEmail(), body('phone').notEmpty()];

module.exports = { createCustomer };

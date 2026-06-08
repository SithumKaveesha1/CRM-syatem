const { body } = require('express-validator');

const createPayment = [body('invoice_id').isInt(), body('amount').isFloat()];

module.exports = { createPayment };

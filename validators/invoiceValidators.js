const { body } = require('express-validator');

const createInvoice = [body('invoice_no').notEmpty(), body('customer_id').isInt(), body('total_amount').isFloat()];

module.exports = { createInvoice };

const express = require('express');
const { param, body, query } = require('express-validator');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const validate = require('../middleware/validate');
const auth = require('../middleware/authMiddleware');

router.get('/', [query('page').optional().isInt({ min: 1 })], validate, paymentsController.list);
router.get('/:id', [param('id').isInt()], validate, paymentsController.getById);
router.post('/', auth, [body('invoice_id').isInt(), body('amount').isFloat(), body('payment_date').optional().isISO8601()], validate, paymentsController.create);
router.put('/:id', auth, [param('id').isInt()], validate, paymentsController.update);
router.delete('/:id', auth, [param('id').isInt()], validate, paymentsController.remove);

module.exports = router;

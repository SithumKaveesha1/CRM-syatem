const express = require('express');
const { query, param, body } = require('express-validator');
const router = express.Router();
const invoicesController = require('../controllers/invoicesController');
const validate = require('../middleware/validate');
const auth = require('../middleware/authMiddleware');

router.get('/', [query('invoice_no').optional().isString(), query('page').optional().isInt({ min: 1 })], validate, invoicesController.list);
router.get('/:id', [param('id').isInt()], validate, invoicesController.getById);
router.post('/', auth, [body('invoice_no').notEmpty(), body('customer_id').isInt(), body('total_amount').isFloat()], validate, invoicesController.create);
router.put('/:id', auth, [param('id').isInt()], validate, invoicesController.update);
router.delete('/:id', auth, [param('id').isInt()], validate, invoicesController.remove);

module.exports = router;

const express = require('express');
const { query, param, body } = require('express-validator');
const router = express.Router();
const customersController = require('../controllers/customersController');
const validate = require('../middleware/validate');
const auth = require('../middleware/authMiddleware');

router.get('/', [query('q').optional().isString(), query('page').optional().isInt({ min: 1 })], validate, customersController.list);
router.get('/:id', [param('id').isInt()], validate, customersController.getById);
router.post('/', auth, [body('full_name').notEmpty(), body('email').isEmail(), body('phone').notEmpty()], validate, customersController.create);
router.put('/:id', auth, [param('id').isInt(), body('full_name').optional(), body('email').optional().isEmail()], validate, customersController.update);
router.delete('/:id', auth, [param('id').isInt()], validate, customersController.remove);

module.exports = router;

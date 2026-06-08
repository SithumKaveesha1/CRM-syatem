const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/customers', require('./customers'));
router.use('/invoices', require('./invoices'));
router.use('/payments', require('./payments'));
router.use('/dashboard', require('./dashboard'));

router.get('/', (req, res) => res.json({ success: true, message: 'API Root' }));

module.exports = router;

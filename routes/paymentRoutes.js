const express = require('express');
const router = express.Router();
const { 
  getPayments, 
  getPaymentById, 
  createPayment, 
  deletePayment 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getPayments)
  .post(protect, createPayment);

router.route('/:id')
  .get(protect, getPaymentById)
  .delete(protect, deletePayment);

module.exports = router;

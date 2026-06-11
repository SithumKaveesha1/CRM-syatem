const db = require('../db');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
  try {
    const { invoice_id } = req.query;
    
    let query = `
      SELECT p.*, i.invoice_no, c.full_name as customer_name
      FROM payments p
      JOIN invoices i ON p.invoice_id = i.invoice_id
      JOIN customers c ON i.customer_id = c.customer_id
    `;
    let queryParams = [];

    if (invoice_id) {
      query += ' WHERE p.invoice_id = ?';
      queryParams.push(invoice_id);
    }
    
    query += ' ORDER BY p.payment_date DESC, p.created_at DESC';

    const [payments] = await db.query(query, queryParams);
    
    res.status(200).json({
      success: true,
      message: 'Payments retrieved successfully',
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res, next) => {
  try {
    const paymentId = req.params.id;

    const [payments] = await db.query(`
      SELECT p.*, i.invoice_no, c.full_name as customer_name
      FROM payments p
      JOIN invoices i ON p.invoice_id = i.invoice_id
      JOIN customers c ON i.customer_id = c.customer_id
      WHERE p.payment_id = ?
    `, [paymentId]);
    
    if (payments.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Payment retrieved successfully',
      data: payments[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { invoice_id, amount, payment_date } = req.body;

    if (!invoice_id || !amount) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const [invoices] = await connection.query('SELECT * FROM invoices WHERE invoice_id = ?', [invoice_id]);
    if (invoices.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const invoice = invoices[0];
    const newPaidAmount = parseFloat(invoice.paid_amount) + parseFloat(amount);
    const newBalanceAmount = parseFloat(invoice.total_amount) - newPaidAmount;
    
    let newStatus = invoice.status;
    if (newBalanceAmount <= 0) {
      newStatus = 'paid';
    } else if (newPaidAmount > 0) {
      newStatus = 'partial';
    }

    await connection.query(
      'UPDATE invoices SET paid_amount = ?, balance_amount = ?, status = ? WHERE invoice_id = ?',
      [newPaidAmount, newBalanceAmount, newStatus, invoice_id]
    );

    const [result] = await connection.query(
      'INSERT INTO payments (invoice_id, amount, payment_date) VALUES (?, ?, ?)',
      [invoice_id, amount, payment_date || new Date()]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: {
        payment_id: result.insertId,
        invoice_id,
        amount,
        payment_date
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Private
const deletePayment = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const paymentId = req.params.id;

    const [payments] = await connection.query('SELECT * FROM payments WHERE payment_id = ?', [paymentId]);
    if (payments.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const payment = payments[0];
    const invoiceId = payment.invoice_id;
    const amountToDeduct = parseFloat(payment.amount);

    const [invoices] = await connection.query('SELECT * FROM invoices WHERE invoice_id = ?', [invoiceId]);
    if (invoices.length > 0) {
      const invoice = invoices[0];
      const newPaidAmount = parseFloat(invoice.paid_amount) - amountToDeduct;
      const newBalanceAmount = parseFloat(invoice.total_amount) - newPaidAmount;
      
      let newStatus = invoice.status;
      if (newBalanceAmount > 0 && newPaidAmount > 0) {
        newStatus = 'partial';
      } else if (newPaidAmount <= 0 && invoice.total_amount > 0) {
        newStatus = 'pending';
      }

      await connection.query(
        'UPDATE invoices SET paid_amount = ?, balance_amount = ?, status = ? WHERE invoice_id = ?',
        [newPaidAmount, newBalanceAmount, newStatus, invoiceId]
      );
    }

    await connection.query('DELETE FROM payments WHERE payment_id = ?', [paymentId]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
      data: {}
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  deletePayment
};

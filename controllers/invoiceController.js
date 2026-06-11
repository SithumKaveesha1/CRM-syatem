const db = require('../db');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    
    let query = `
      SELECT i.*, c.full_name as customer_name, c.email as customer_email
      FROM invoices i
      JOIN customers c ON i.customer_id = c.customer_id
      WHERE 1=1
    `;
    let queryParams = [];

    if (status) {
      query += ' AND i.status = ?';
      queryParams.push(status);
    }

    if (search) {
      query += ' AND (i.invoice_no LIKE ? OR c.full_name LIKE ?)';
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern);
    }
    
    query += ' ORDER BY i.created_at DESC';

    const [invoices] = await db.query(query, queryParams);
    
    res.status(200).json({
      success: true,
      message: 'Invoices retrieved successfully',
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res, next) => {
  try {
    const invoiceId = req.params.id;

    const [invoices] = await db.query(`
      SELECT i.*, c.full_name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address
      FROM invoices i
      JOIN customers c ON i.customer_id = c.customer_id
      WHERE i.invoice_id = ?
    `, [invoiceId]);
    
    if (invoices.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const invoice = invoices[0];

    const [items] = await db.query('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoiceId]);
    
    const [payments] = await db.query('SELECT * FROM payments WHERE invoice_id = ? ORDER BY payment_date DESC', [invoiceId]);

    invoice.items = items;
    invoice.payments = payments;

    res.status(200).json({
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { 
      invoice_no, 
      customer_id, 
      invoice_date, 
      items, 
      advance_amount = 0,
      status = 'pending'
    } = req.body;

    if (!invoice_no || !customer_id || !items || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let total_amount = 0;
    items.forEach(item => {
      total_amount += (parseFloat(item.quantity) * parseFloat(item.unit_price));
    });

    const balance_amount = total_amount - parseFloat(advance_amount);

    const [invoiceResult] = await connection.query(
      `INSERT INTO invoices (invoice_no, customer_id, invoice_date, total_amount, advance_amount, paid_amount, balance_amount, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [invoice_no, customer_id, invoice_date || new Date(), total_amount, advance_amount, advance_amount, balance_amount, status]
    );

    const invoiceId = invoiceResult.insertId;

    for (let item of items) {
      const itemTotal = parseFloat(item.quantity) * parseFloat(item.unit_price);
      await connection.query(
        `INSERT INTO invoice_items (invoice_id, item_name, description, quantity, unit_price, total) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [invoiceId, item.item_name, item.description, item.quantity, item.unit_price, itemTotal]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: {
        invoice_id: invoiceId,
        invoice_no,
        total_amount,
        balance_amount
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// @desc    Update an invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const invoiceId = req.params.id;
    const { 
      invoice_no, 
      customer_id, 
      invoice_date, 
      items, 
      status 
    } = req.body;

    const [existing] = await connection.query('SELECT * FROM invoices WHERE invoice_id = ?', [invoiceId]);
    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const oldInvoice = existing[0];
    let total_amount = 0;

    if (items && items.length > 0) {
      // Calculate new total
      items.forEach(item => {
        total_amount += (parseFloat(item.quantity) * parseFloat(item.unit_price));
      });

      // Update basic fields
      const balance_amount = total_amount - parseFloat(oldInvoice.paid_amount);
      let newStatus = status || oldInvoice.status;
      if (balance_amount <= 0 && total_amount > 0) {
        newStatus = 'paid';
      }

      await connection.query(
        `UPDATE invoices SET invoice_no = ?, customer_id = ?, invoice_date = ?, total_amount = ?, balance_amount = ?, status = ? WHERE invoice_id = ?`,
        [invoice_no || oldInvoice.invoice_no, customer_id || oldInvoice.customer_id, invoice_date || oldInvoice.invoice_date, total_amount, balance_amount, newStatus, invoiceId]
      );

      // Delete old items and insert new ones
      await connection.query('DELETE FROM invoice_items WHERE invoice_id = ?', [invoiceId]);
      
      for (let item of items) {
        const itemTotal = parseFloat(item.quantity) * parseFloat(item.unit_price);
        await connection.query(
          `INSERT INTO invoice_items (invoice_id, item_name, description, quantity, unit_price, total) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [invoiceId, item.item_name, item.description, item.quantity, item.unit_price, itemTotal]
        );
      }
    } else {
      // Just update status if no items provided
      await connection.query(
        `UPDATE invoices SET status = ? WHERE invoice_id = ?`,
        [status || oldInvoice.status, invoiceId]
      );
    }

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      data: { invoice_id: invoiceId }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = async (req, res, next) => {
  try {
    const invoiceId = req.params.id;

    const [invoices] = await db.query('SELECT * FROM invoices WHERE invoice_id = ?', [invoiceId]);
    if (invoices.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Due to ON DELETE CASCADE, items and payments will also be deleted
    await db.query('DELETE FROM invoices WHERE invoice_id = ?', [invoiceId]);

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
};

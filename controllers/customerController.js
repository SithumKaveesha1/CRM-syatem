const db = require('../db');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM customers';
    let queryParams = [];

    if (search) {
      query += ' WHERE full_name LIKE ? OR email LIKE ?';
      const searchPattern = `%${search}%`;
      queryParams = [searchPattern, searchPattern];
    }
    
    query += ' ORDER BY created_at DESC';

    const [customers] = await db.query(query, queryParams);
    
    res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = async (req, res, next) => {
  try {
    const [customers] = await db.query('SELECT * FROM customers WHERE customer_id = ?', [req.params.id]);
    
    if (customers.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Customer retrieved successfully',
      data: customers[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res, next) => {
  try {
    const { full_name, email, phone, address } = req.body;

    if (!full_name) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO customers (full_name, email, phone, address) VALUES (?, ?, ?, ?)',
      [full_name, email || null, phone || null, address || null]
    );

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: {
        customer_id: result.insertId,
        full_name,
        email,
        phone,
        address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res, next) => {
  try {
    const { full_name, email, phone, address } = req.body;
    const customerId = req.params.id;

    const [customers] = await db.query('SELECT * FROM customers WHERE customer_id = ?', [customerId]);
    if (customers.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await db.query(
      'UPDATE customers SET full_name = ?, email = ?, phone = ?, address = ? WHERE customer_id = ?',
      [full_name, email || null, phone || null, address || null, customerId]
    );

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: {
        customer_id: customerId,
        full_name,
        email,
        phone,
        address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin only optionally, but standard is private)
const deleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;

    const [customers] = await db.query('SELECT * FROM customers WHERE customer_id = ?', [customerId]);
    if (customers.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await db.query('DELETE FROM customers WHERE customer_id = ?', [customerId]);

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};

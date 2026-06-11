const db = require('../db');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const [customers] = await db.query('SELECT COUNT(*) as total FROM customers');
    const [invoices] = await db.query('SELECT COUNT(*) as total FROM invoices');
    const [revenue] = await db.query('SELECT SUM(paid_amount) as total FROM invoices');
    const [balance] = await db.query('SELECT SUM(balance_amount) as total FROM invoices');
    const [paidInvoices] = await db.query('SELECT COUNT(*) as total FROM invoices WHERE status = "paid"');
    const [pendingInvoices] = await db.query('SELECT COUNT(*) as total FROM invoices WHERE status = "pending"');

    const [recentCustomers] = await db.query('SELECT * FROM customers ORDER BY created_at DESC LIMIT 5');
    
    const [recentInvoices] = await db.query(`
      SELECT i.invoice_id, i.invoice_no, i.total_amount, i.status, i.created_at, c.full_name as customer_name
      FROM invoices i
      JOIN customers c ON i.customer_id = c.customer_id
      ORDER BY i.created_at DESC LIMIT 5
    `);

    // Monthly revenue for the current year
    const [monthlyRevenue] = await db.query(`
      SELECT MONTH(payment_date) as month, SUM(amount) as revenue
      FROM payments
      WHERE YEAR(payment_date) = YEAR(CURRENT_DATE)
      GROUP BY MONTH(payment_date)
      ORDER BY month
    `);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved',
      data: {
        totalCustomers: customers[0].total || 0,
        totalInvoices: invoices[0].total || 0,
        totalRevenue: revenue[0].total || 0,
        outstandingBalance: balance[0].total || 0,
        paidInvoices: paidInvoices[0].total || 0,
        pendingInvoices: pendingInvoices[0].total || 0,
        recentCustomers,
        recentInvoices,
        monthlyRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};

const Customer = require('../models/customerModel');
const Invoice = require('../models/invoiceModel');
const Payment = require('../models/paymentModel');
const { sendResponse } = require('../utils/response');

const totals = async (req, res, next) => {
  try {
    const totalCustomers = await Customer.count();
    const totalInvoices = await Invoice.count();
    const totalRevenue = await Payment.sumAll();
    const outstanding = await Invoice.sumOutstanding();
    return sendResponse(res, true, 'Dashboard totals', { totalCustomers, totalInvoices, totalRevenue, outstanding });
  } catch (err) {
    next(err);
  }
};

const monthlyRevenue = async (req, res, next) => {
  try {
    const report = await Payment.monthlyReport();
    return sendResponse(res, true, 'Monthly revenue', report);
  } catch (err) {
    next(err);
  }
};

module.exports = { totals, monthlyRevenue };

const Invoice = require('../models/invoiceModel');
const { sendResponse } = require('../utils/response');

const list = async (req, res, next) => {
  try {
    const invoice_no = req.query.invoice_no || null;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const result = await Invoice.list({ invoice_no, page, limit });
    return sendResponse(res, true, 'Invoices fetched', result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const invoice = await Invoice.findById(id);
    if (!invoice) return sendResponse(res, false, 'Invoice not found', null, 404);
    return sendResponse(res, true, 'Invoice fetched', invoice);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const id = await Invoice.create(req.body);
    return sendResponse(res, true, 'Invoice added', { invoice_id: id }, 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    await Invoice.update(req.params.id, req.body);
    return sendResponse(res, true, 'Invoice updated', null);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await Invoice.remove(req.params.id);
    return sendResponse(res, true, 'Invoice deleted', null);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };

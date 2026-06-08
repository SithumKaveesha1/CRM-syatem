const Customer = require('../models/customerModel');
const { sendResponse } = require('../utils/response');

const list = async (req, res, next) => {
  try {
    const q = req.query.q || null;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const result = await Customer.list({ q, page, limit });
    return sendResponse(res, true, 'Customers fetched', result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findById(id);
    if (!customer) return sendResponse(res, false, 'Customer not found', null, 404);
    return sendResponse(res, true, 'Customer fetched', customer);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const payload = req.body;
    const id = await Customer.create(payload);
    return sendResponse(res, true, 'Customer added', { customer_id: id }, 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Customer.update(id, req.body);
    return sendResponse(res, true, 'Customer updated', null);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Customer.remove(id);
    return sendResponse(res, true, 'Customer deleted', null);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };

const Payment = require('../models/paymentModel');
const { sendResponse } = require('../utils/response');

const list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const result = await Payment.list({ page, limit });
    return sendResponse(res, true, 'Payments fetched', result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return sendResponse(res, false, 'Payment not found', null, 404);
    return sendResponse(res, true, 'Payment fetched', payment);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const id = await Payment.create(req.body);
    return sendResponse(res, true, 'Payment added', { payment_id: id }, 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    await Payment.update(req.params.id, req.body);
    return sendResponse(res, true, 'Payment updated', null);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await Payment.remove(req.params.id);
    return sendResponse(res, true, 'Payment deleted', null);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };

const Settings = require('../models/settingsModel');
const { sendResponse } = require('../utils/response');

const get = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    return sendResponse(res, true, 'Settings fetched', settings);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    // Only allow admin to update settings? We'll assume admin for now, or check req.user.role if we want.
    if (req.user && req.user.role !== 'admin') {
      return sendResponse(res, false, 'Admin access required', null, 403);
    }
    await Settings.updateSettings(req.body);
    return sendResponse(res, true, 'Settings updated', null);
  } catch (err) {
    next(err);
  }
};

module.exports = { get, update };

const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');

// Get settings
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const [settings] = await db.query('SELECT * FROM settings LIMIT 1');
    if (settings.length === 0) {
      await db.query('INSERT INTO settings (company_name) VALUES ("Invoice CRM")');
      const [newSettings] = await db.query('SELECT * FROM settings LIMIT 1');
      return res.status(200).json({ success: true, data: newSettings[0] });
    }
    res.status(200).json({ success: true, data: settings[0] });
  } catch (error) {
    next(error);
  }
});

// Update settings
router.put('/', protect, admin, async (req, res, next) => {
  try {
    const { company_name, company_address, contact_number, email, currency } = req.body;
    
    const [settings] = await db.query('SELECT * FROM settings LIMIT 1');
    if (settings.length === 0) {
      await db.query(
        'INSERT INTO settings (company_name, company_address, contact_number, email, currency) VALUES (?, ?, ?, ?, ?)',
        [company_name, company_address, contact_number, email, currency]
      );
    } else {
      await db.query(
        'UPDATE settings SET company_name = ?, company_address = ?, contact_number = ?, email = ?, currency = ? WHERE setting_id = ?',
        [company_name, company_address, contact_number, email, currency, settings[0].setting_id]
      );
    }
    
    res.status(200).json({ success: true, message: 'Settings updated' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const db = require('../db');

const getSettings = async () => {
  const [rows] = await db.execute('SELECT * FROM settings LIMIT 1');
  return rows[0] || null;
};

const updateSettings = async (payload) => {
  const { company_name, company_address, contact_number, email, currency, logo_url } = payload;
  await db.execute(
    `UPDATE settings SET company_name=?, company_address=?, contact_number=?, email=?, currency=?, logo_url=?`,
    [company_name, company_address, contact_number, email, currency, logo_url]
  );
};

module.exports = { getSettings, updateSettings };

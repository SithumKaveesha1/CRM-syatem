const db = require('../db');

const list = async ({ page, limit }) => {
  const offset = (page - 1) * limit;
  const [rows] = await db.execute(`SELECT * FROM payments LIMIT ${limit} OFFSET ${offset}`);
  return { rows, page, limit };
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM payments WHERE payment_id = ?', [id]);
  return rows[0] || null;
};

const create = async ({ invoice_id, amount, payment_date }) => {
  const [result] = await db.execute('INSERT INTO payments (invoice_id, amount, payment_date) VALUES (?, ?, ?)', [invoice_id, amount, payment_date || new Date()]);
  return result.insertId;
};

const update = async (id, payload) => {
  const { amount, payment_date } = payload;
  await db.execute('UPDATE payments SET amount=?, payment_date=? WHERE payment_id=?', [amount, payment_date, id]);
};

const remove = async (id) => {
  await db.execute('DELETE FROM payments WHERE payment_id = ?', [id]);
};

const sumAll = async () => {
  const [rows] = await db.execute('SELECT SUM(amount) as total FROM payments');
  return rows[0].total || 0;
};

const monthlyReport = async () => {
  const [rows] = await db.execute(
    `SELECT DATE_FORMAT(payment_date, '%Y-%m') as month, SUM(amount) as total FROM payments GROUP BY month ORDER BY month DESC LIMIT 12`
  );
  return rows;
};

module.exports = { list, findById, create, update, remove, sumAll, monthlyReport };

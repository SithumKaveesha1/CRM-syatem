const db = require('../db');

const list = async ({ invoice_no, page, limit }) => {
  const offset = (page - 1) * limit;
  if (invoice_no) {
    const [rows] = await db.execute('SELECT * FROM invoices WHERE invoice_no LIKE ? LIMIT ? OFFSET ?', [`%${invoice_no}%`, limit, offset]);
    return { rows, page, limit };
  }
  const [rows] = await db.execute('SELECT * FROM invoices LIMIT ? OFFSET ?', [limit, offset]);
  return { rows, page, limit };
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM invoices WHERE invoice_id = ?', [id]);
  return rows[0] || null;
};

const create = async (payload) => {
  const { invoice_no, customer_id, invoice_date, total_amount, advance_amount=0, paid_amount=0, balance_amount=0, status='pending' } = payload;
  const [result] = await db.execute(
    `INSERT INTO invoices (invoice_no, customer_id, invoice_date, total_amount, advance_amount, paid_amount, balance_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [invoice_no, customer_id, invoice_date, total_amount, advance_amount, paid_amount, balance_amount, status]
  );
  return result.insertId;
};

const update = async (id, payload) => {
  const { invoice_no, customer_id, invoice_date, total_amount, advance_amount, paid_amount, balance_amount, status } = payload;
  await db.execute(
    `UPDATE invoices SET invoice_no=?, customer_id=?, invoice_date=?, total_amount=?, advance_amount=?, paid_amount=?, balance_amount=?, status=? WHERE invoice_id=?`,
    [invoice_no, customer_id, invoice_date, total_amount, advance_amount, paid_amount, balance_amount, status, id]
  );
};

const remove = async (id) => {
  await db.execute('DELETE FROM invoices WHERE invoice_id = ?', [id]);
};

const count = async () => {
  const [rows] = await db.execute('SELECT COUNT(*) as cnt FROM invoices');
  return rows[0].cnt;
};

const sumOutstanding = async () => {
  const [rows] = await db.execute('SELECT SUM(balance_amount) as total FROM invoices');
  return rows[0].total || 0;
};

module.exports = { list, findById, create, update, remove, count, sumOutstanding };

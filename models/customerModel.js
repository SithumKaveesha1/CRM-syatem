const db = require('../db');

const list = async ({ q, page, limit }) => {
  const offset = (page - 1) * limit;
  if (q) {
    const [rows] = await db.execute(`SELECT * FROM customers WHERE full_name LIKE ? OR email LIKE ? LIMIT ${limit} OFFSET ${offset}`, [`%${q}%`,`%${q}%`]);
    return { rows, page, limit };
  }
  const [rows] = await db.execute(`SELECT * FROM customers LIMIT ${limit} OFFSET ${offset}`);
  return { rows, page, limit };
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM customers WHERE customer_id = ?', [id]);
  return rows[0] || null;
};

const create = async (payload) => {
  const { full_name, email, phone, address } = payload;
  const [result] = await db.execute('INSERT INTO customers (full_name, email, phone, address) VALUES (?, ?, ?, ?)', [full_name, email, phone, address]);
  return result.insertId;
};

const update = async (id, payload) => {
  const { full_name, email, phone, address } = payload;
  await db.execute('UPDATE customers SET full_name=?, email=?, phone=?, address=? WHERE customer_id=?', [full_name, email, phone, address, id]);
};

const remove = async (id) => {
  await db.execute('DELETE FROM customers WHERE customer_id = ?', [id]);
};

const count = async () => {
  const [rows] = await db.execute('SELECT COUNT(*) as cnt FROM customers');
  return rows[0].cnt;
};

module.exports = { list, findById, create, update, remove, count };

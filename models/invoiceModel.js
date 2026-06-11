const db = require('../db');

const list = async ({ invoice_no, page, limit }) => {
  const offset = (page - 1) * limit;
  if (invoice_no) {
    const [rows] = await db.execute(`SELECT * FROM invoices WHERE invoice_no LIKE ? LIMIT ${limit} OFFSET ${offset}`, [`%${invoice_no}%`]);
    return { rows, page, limit };
  }
  const [rows] = await db.execute(`SELECT * FROM invoices LIMIT ${limit} OFFSET ${offset}`);
  return { rows, page, limit };
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM invoices WHERE invoice_id = ?', [id]);
  if (rows.length === 0) return null;
  const invoice = rows[0];
  const [items] = await db.execute('SELECT * FROM invoice_items WHERE invoice_id = ?', [id]);
  invoice.items = items;
  return invoice;
};

const create = async (payload) => {
  const { invoice_no, customer_id, invoice_date, total_amount, advance_amount=0, paid_amount=0, balance_amount=0, status='pending', items = [] } = payload;
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO invoices (invoice_no, customer_id, invoice_date, total_amount, advance_amount, paid_amount, balance_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [invoice_no, customer_id, invoice_date, total_amount, advance_amount, paid_amount, balance_amount, status]
    );
    const invoiceId = result.insertId;

    for (const item of items) {
      await connection.execute(
        `INSERT INTO invoice_items (invoice_id, item_name, description, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?, ?)`,
        [invoiceId, item.item_name, item.description, item.quantity, item.unit_price, item.total]
      );
    }
    
    await connection.commit();
    return invoiceId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const update = async (id, payload) => {
  const { invoice_no, customer_id, invoice_date, total_amount, advance_amount, paid_amount, balance_amount, status, items = [] } = payload;
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE invoices SET invoice_no=?, customer_id=?, invoice_date=?, total_amount=?, advance_amount=?, paid_amount=?, balance_amount=?, status=? WHERE invoice_id=?`,
      [invoice_no, customer_id, invoice_date, total_amount, advance_amount, paid_amount, balance_amount, status, id]
    );

    // Replace items
    await connection.execute('DELETE FROM invoice_items WHERE invoice_id = ?', [id]);
    for (const item of items) {
      await connection.execute(
        `INSERT INTO invoice_items (invoice_id, item_name, description, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, item.item_name, item.description, item.quantity, item.unit_price, item.total]
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
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

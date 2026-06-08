const db = require('../db');

const findByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

const create = async ({ name, email, password }) => {
  const [result] = await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
  return result.insertId;
};

module.exports = { findByEmail, create };

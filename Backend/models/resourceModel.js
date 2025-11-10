const pool = require('../config/database');

exports.getAll = async () => {
  const [rows] = await pool.execute('SELECT * FROM resources WHERE is_active = TRUE');
  return rows;
};

exports.create = async (name, quantity) => {
  const [result] = await pool.execute(
    'INSERT INTO resources (name, quantity) VALUES (?, ?)',
    [name, quantity]
  );
  return result.insertId;
};

exports.update = async (id, name, quantity, is_active) => {
  await pool.execute(
    'UPDATE resources SET name = ?, quantity = ?, is_active = ? WHERE id = ?',
    [name, quantity, is_active, id]
  );
};

exports.delete = async (id) => {
  await pool.execute('DELETE FROM resources WHERE id = ?', [id]);
};
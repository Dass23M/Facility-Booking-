const pool = require('../config/database');

exports.getAll = async () => {
  const [rows] = await pool.execute('SELECT * FROM rooms WHERE is_active = TRUE');
  return rows;
};

exports.create = async (name, capacity) => {
  const [result] = await pool.execute(
    'INSERT INTO rooms (name, capacity) VALUES (?, ?)',
    [name, capacity]
  );
  return result.insertId;
};

exports.update = async (id, name, capacity, is_active) => {
  await pool.execute(
    'UPDATE rooms SET name = ?, capacity = ?, is_active = ? WHERE id = ?',
    [name, capacity, is_active, id]
  );
};

exports.delete = async (id) => {
  await pool.execute('DELETE FROM rooms WHERE id = ?', [id]);
};

exports.getCurrentUsage = async () => {
  // Query current in-use rooms (sessions where now() BETWEEN start and end)
  const [rows] = await pool.execute(`
    SELECT r.name, COUNT(s.id) as current_bookings 
    FROM rooms r 
    LEFT JOIN sessions s ON r.id = s.room_id AND NOW() BETWEEN s.start_time AND s.end_time 
    GROUP BY r.id
  `);
  return rows;
};
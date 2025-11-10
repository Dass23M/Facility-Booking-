const pool = require('../config/database');

exports.getAll = async (userId) => {
  let query = 'SELECT * FROM sessions s JOIN rooms r ON s.room_id = r.id WHERE 1=1';
  let params = [];
  if (userId) {  // Staff: own sessions; admin: all
    query += ' AND s.user_id = ?';
    params.push(userId);
  }
  const [rows] = await pool.execute(query, params);
  return rows;
};

exports.create = async (title, start_time, end_time, room_id, user_id) => {
  const [result] = await pool.execute(
    'INSERT INTO sessions (title, start_time, end_time, room_id, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, start_time, end_time, room_id, user_id]
  );
  return result.insertId;
};

exports.checkRoomConflict = async (room_id, start_time, end_time, excludeSessionId = null) => {
  let query = `
    SELECT id FROM sessions 
    WHERE room_id = ? AND (
      (start_time < ? AND end_time > ?) OR 
      (start_time < ? AND end_time > ?) OR 
      (start_time >= ? AND end_time <= ?)
    )
  `;
  let params = [room_id, end_time, start_time, end_time, start_time, start_time, end_time];
  if (excludeSessionId) {
    query += ' AND id != ?';
    params.push(excludeSessionId);
  }
  const [rows] = await pool.execute(query, params);
  return rows.length > 0;
};

exports.checkResourceConflict = async (resource_id, start_time, end_time, quantity_needed, excludeSessionId = null) => {
  // Count overlapping sessions' booked quantity
  let query = `
    SELECT SUM(sr.quantity_booked) as booked_qty FROM session_resources sr
    JOIN sessions s ON sr.session_id = s.id
    WHERE sr.resource_id = ? AND (
      (s.start_time < ? AND s.end_time > ?) OR 
      (s.start_time < ? AND s.end_time > ?) OR 
      (s.start_time >= ? AND s.end_time <= ?)
    )
  `;
  let params = [resource_id, end_time, start_time, end_time, start_time, start_time, end_time];
  if (excludeSessionId) {
    query += ' AND s.id != ?';
    params.push(excludeSessionId);
  }
  const [rows] = await pool.execute(query, params);
  const booked = rows[0]?.booked_qty || 0;
  const available = (await pool.execute('SELECT quantity FROM resources WHERE id = ?', [resource_id]))[0][0]?.quantity || 0;
  return (booked + quantity_needed) > available;
};

exports.assignResources = async (session_id, resource_ids) => {
  for (const item of resource_ids) {
    await pool.execute(
      'INSERT INTO session_resources (session_id, resource_id, quantity_booked) VALUES (?, ?, ?)',
      [session_id, item.id, item.quantity || 1]
    );
  }
};

exports.update = async (id, title, start_time, end_time, room_id) => {
  await pool.execute(
    'UPDATE sessions SET title = ?, start_time = ?, end_time = ?, room_id = ? WHERE id = ?',
    [title, start_time, end_time, room_id, id]
  );
};

exports.delete = async (id, user_id) => {
  await pool.execute('DELETE FROM sessions WHERE id = ? AND user_id = ?', [id, user_id]);
};
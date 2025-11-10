const pool = require('../config/database');

exports.logAction = async (userId, action, details) => {
  await pool.execute(
    'INSERT INTO audit_log (user_id, action, details) VALUES (?, ?, ?)',
    [userId, action, details]
  );
};
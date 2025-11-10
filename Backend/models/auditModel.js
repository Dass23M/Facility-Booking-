// Optional: Direct audit queries if needed beyond logger
const pool = require('../config/database');

exports.getLogs = async () => {
  const [rows] = await pool.execute('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 100');
  return rows;
};
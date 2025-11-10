const validateSignup = (req, res, next) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password too short' });
  }
  next();
};

const validateSession = (req, res, next) => {
  const { title, start_time, end_time, room_id } = req.body;
  if (!title || !start_time || !end_time || !room_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (new Date(end_time) <= new Date(start_time)) {
    return res.status(400).json({ error: 'End time must be after start time' });
  }
  next();
};

module.exports = { validateSignup, validateSession };
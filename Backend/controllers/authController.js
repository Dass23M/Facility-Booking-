const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { logAction } = require('../utils/logger');
const userModel = require('../models/userModel');

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!['admin', 'staff'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(username, email, hashedPassword, role);
    await logAction(userId, 'signup', `User ${username} signed up`);
    res.status(201).json({ message: 'User created', userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    await logAction(user.id, 'login', `User ${user.username} logged in`);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
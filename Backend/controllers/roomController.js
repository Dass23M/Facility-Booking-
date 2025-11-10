const pool = require('../config/database');
const { logAction } = require('../utils/logger');
const roomModel = require('../models/roomModel');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await roomModel.getAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const roomId = await roomModel.create(name, capacity);
    await logAction(req.user.id, 'create_room', `Room ${name} created`);
    res.status(201).json({ message: 'Room created', roomId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, is_active } = req.body;
    await roomModel.update(id, name, capacity, is_active);
    await logAction(req.user.id, 'update_room', `Room ${id} updated`);
    res.json({ message: 'Room updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await roomModel.delete(id);
    await logAction(req.user.id, 'delete_room', `Room ${id} deleted`);
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentUsage = async (req, res) => {
  try {
    const usage = await roomModel.getCurrentUsage();
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
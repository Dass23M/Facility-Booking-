const pool = require('../config/database');
const { logAction } = require('../utils/logger');
const resourceModel = require('../models/resourceModel');

exports.getAllResources = async (req, res) => {
  try {
    const resources = await resourceModel.getAll();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const resourceId = await resourceModel.create(name, quantity);
    await logAction(req.user.id, 'create_resource', `Resource ${name} created`);
    res.status(201).json({ message: 'Resource created', resourceId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, is_active } = req.body;
    await resourceModel.update(id, name, quantity, is_active);
    await logAction(req.user.id, 'update_resource', `Resource ${id} updated`);
    res.json({ message: 'Resource updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    await resourceModel.delete(id);
    await logAction(req.user.id, 'delete_resource', `Resource ${id} deleted`);
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const pool = require('../config/database');
const { logAction } = require('../utils/logger');
const sessionModel = require('../models/sessionModel');

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionModel.getAll(req.user.id);  // Staff sees own, admin sees all
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { title, start_time, end_time, room_id, resource_ids } = req.body;  // resource_ids: array of {id, quantity}
    
    // Check room availability
    const roomConflict = await sessionModel.checkRoomConflict(room_id, start_time, end_time);
    if (roomConflict) {
      return res.status(409).json({ error: 'Room is already booked during this time' });
    }
    
    // Check resource availability (quantity)
    for (const resItem of resource_ids || []) {
      const resourceConflict = await sessionModel.checkResourceConflict(resItem.id, start_time, end_time, resItem.quantity);
      if (resourceConflict) {
        return res.status(409).json({ error: `Resource ${resItem.id} unavailable (quantity: ${resItem.quantity})` });
      }
    }
    
    const sessionId = await sessionModel.create(title, start_time, end_time, room_id, req.user.id);
    
    // Assign resources
    if (resource_ids && resource_ids.length > 0) {
      await sessionModel.assignResources(sessionId, resource_ids);
    }
    
    await logAction(req.user.id, 'create_session', `Session ${title} booked for Room ${room_id}`);
    res.status(201).json({ message: 'Session created', sessionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, start_time, end_time, room_id, resource_ids } = req.body;
    
    // Re-check conflicts (simplified; in prod, remove old assignments first)
    const roomConflict = await sessionModel.checkRoomConflict(room_id, start_time, end_time, id);
    if (roomConflict) {
      return res.status(409).json({ error: 'Room conflict' });
    }
    // Similar resource checks...
    
    await sessionModel.update(id, title, start_time, end_time, room_id);
    // Update resources if provided...
    
    await logAction(req.user.id, 'update_session', `Session ${id} updated`);
    res.json({ message: 'Session updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    await sessionModel.delete(id, req.user.id);
    await logAction(req.user.id, 'delete_session', `Session ${id} deleted`);
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { getAllRooms, createRoom, updateRoom, deleteRoom, getCurrentUsage } = require('../controllers/roomController');

const router = express.Router();

router.use(requireAdmin);  // All room ops admin-only

router.get('/', getAllRooms);
router.get('/usage', getCurrentUsage);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
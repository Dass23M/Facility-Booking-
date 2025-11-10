const express = require('express');
const auth = require('../middleware/auth');
const { validateSession } = require('../middleware/validation');
const { getAllSessions, createSession, updateSession, deleteSession } = require('../controllers/sessionController');

const router = express.Router();

router.use(auth);  // All sessions require auth

// Staff can manage own, admin all
router.get('/', getAllSessions);
router.post('/', validateSession, createSession);
router.put('/:id', validateSession, updateSession);
router.delete('/:id', deleteSession);

module.exports = router;
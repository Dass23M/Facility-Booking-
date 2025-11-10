const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { getAllResources, createResource, updateResource, deleteResource } = require('../controllers/resourceController');

const router = express.Router();

router.use(requireAdmin);

router.get('/', getAllResources);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

module.exports = router;
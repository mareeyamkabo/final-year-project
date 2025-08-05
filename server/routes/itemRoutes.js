// server/routes/itemRoutes.js

const express = require('express');
const router = express.Router();

// ✅ Import controllers
const {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

// ✅ Import middleware
const {
  verifyToken,
  requireRole,
} = require('../middleware/authMiddleware'); // <- THIS IS THE MOST LIKELY CULPRIT

// ✅ Routes
router.get('/', verifyToken, getAllItems);
router.post('/', verifyToken, createItem); 
router.put('/:id', verifyToken, requireRole('admin'), updateItem);
router.delete('/:id', verifyToken, requireRole('admin'), deleteItem);

module.exports = router;

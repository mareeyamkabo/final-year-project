const express = require('express');
const router = express.Router();
const { createItem, getAllItems } = require('../controllers/itemController');

router.post('/items', createItem);
router.get('/items', getAllItems);

module.exports = router;

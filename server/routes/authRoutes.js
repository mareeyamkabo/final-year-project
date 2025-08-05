// server/routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Controller functions
const { register, login } = require('../controllers/authController');

// Students register themselves
router.post('/register', register);

// Admins or students login
router.post('/login', login);

module.exports = router;

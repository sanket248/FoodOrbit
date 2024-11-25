const express = require('express');
const { login, getUser, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to check JWT
const router = express.Router();

// Login route
router.post('/login', login);

// Get single user (Protected route)
router.get('/getuser/:id', authMiddleware, getUser);

// Get all users (Protected route)
router.get('/getallusers', authMiddleware, getAllUsers);

module.exports = router;

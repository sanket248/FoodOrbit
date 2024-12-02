const express = require("express");
const {
  login,
  getUser,
  getAllUsers,
} = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware to check JWT
const router = express.Router();

// Login route
router.post("/login", login);

// Get single user
router.get("/getuser/:id", authMiddleware, getUser);

// Get all users
router.get("/getallusers", authMiddleware, getAllUsers);

module.exports = router;

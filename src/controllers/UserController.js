const User = require("../models/UserSchema"); // Import User model
const jwt = require("jsonwebtoken");

// Login Controller
const login = async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      // If user doesn't exist, create a new one
      user = await User.create({ name: "New User", mobileNumber });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get User Controller
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get All Users Controller
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

module.exports = { login, getUser, getAllUsers };

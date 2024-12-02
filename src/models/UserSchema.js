const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile_no: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
  },
  {
    timestamps: true,
  }
);

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;

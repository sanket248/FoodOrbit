const mongoose = require('mongoose');

// Define the Food schema
const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shop_name: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    review: {
      type: String,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User schema
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the Food model
const Food = mongoose.model('Food', foodSchema);

module.exports = Food;

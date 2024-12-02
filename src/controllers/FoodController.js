const Food = require("../models/FoodSchema"); // Import Food model
const Review = require("../models/ReviewSchema");

// Create a food item
const createFood = async (req, res) => {
  const {
    name,
    shop_name,
    category,
    description,
    address,
    rating,
    review,
    latitude,
    longitude,
  } = req.body;
  const userId = req.user_id;

  try {
    if (name && address && latitude && longitude) {
      const newFood = await Food.create({
        name,
        shop_name,
        category,
        description,
        address,
        rating,
        latitude,
        longitude,
        userId,
      });

      const newReview = await Review.create({
        rating,
        review,
        user_id: userId,
        food_id: newFood._id,
      });

      res.status(201).json({
        success: true,
        message: "Food item created successfully",
        data: newFood,
      });
    } else {
      res.status(500).json({ success: false, message: "Missing inputs" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

const editFood = async (req, res) => {
  try {
    const { id } = req.params; // Get food ID from URL params
    const updates = req.body; // Get updated fields from request body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required.",
      });
    }

    // Find the food item by ID and update it
    const updatedFood = await Food.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food updated successfully.",
      data: updatedFood,
    });
  } catch (error) {
    console.error("Error updating food:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

// Get all food items
const getAllFoods = async (req, res) => {
  try {
    // Extract page and limit from query parameters, set defaults if not provided
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 20; // Default to 20 results per page

    // Calculate the starting index for the results
    const startIndex = (page - 1) * limit;

    // Query the database with pagination
    const foods = await Food.find().skip(startIndex).limit(limit);

    // Get total document count for pagination metadata
    const total = await Food.countDocuments();

    // Response with paginated data
    res.status(200).json({
      success: true,
      data: foods,
      pagination: {
        total, // Total number of documents
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: startIndex + limit < total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get a food item by ID
const getFoodById = async (req, res) => {
  const { id } = req.params;

  try {
    const food = await Food.findById(id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found" });
    }
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

const getNearbyFoods = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required.",
      });
    }

    const userLatitude = parseFloat(latitude);
    const userLongitude = parseFloat(longitude);
    const radiusInKm = 5; // Radius in kilometers
    const earthRadiusInKm = 6378.1; // Earth's radius in kilometers

    // Convert radius to radians
    const radiusInRadians = radiusInKm / earthRadiusInKm;

    // Find foods within the radius using Haversine formula
    const nearbyFoods = await Food.find({
      $expr: {
        $lte: [
          {
            $sqrt: {
              $add: [
                {
                  $pow: [
                    { $subtract: [{ $toDouble: "$latitude" }, userLatitude] },
                    2,
                  ],
                },
                {
                  $pow: [
                    { $subtract: [{ $toDouble: "$longitude" }, userLongitude] },
                    2,
                  ],
                },
              ],
            },
          },
          radiusInRadians,
        ],
      },
    });

    res.status(200).json({
      success: true,
      data: nearbyFoods,
    });
  } catch (error) {
    console.error("Error finding nearby foods:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

const getFoodByUser = async (req, res) => {
  try {
    const { userId } = req.params; // Get the user ID from the request parameters

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Find all foods associated with the given user ID
    const userFoods = await Food.find({ user_id: userId });

    // Check if the user has added any foods
    if (userFoods.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No foods found for the given user.",
      });
    }

    res.status(200).json({
      success: true,
      data: userFoods,
    });
  } catch (error) {
    console.error("Error fetching foods by user:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

const searchFood = async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from request query parameters

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    // Perform a case-insensitive search on `name`, `category`, and `shop_name` fields
    const matchedFoods = await Food.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { shop_name: { $regex: query, $options: "i" } },
      ],
    });

    // Check if any foods were found
    if (matchedFoods.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No foods matched your search.",
      });
    }

    res.status(200).json({
      success: true,
      data: matchedFoods,
    });
  } catch (error) {
    console.error("Error searching for foods:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

const deleteFood = async (req, res) => {
  try {
    const { id } = req.params; // Get food ID from the URL params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required.",
      });
    }

    // Find and delete the food item
    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

module.exports = {
  createFood,
  getAllFoods,
  getFoodById,
  getNearbyFoods,
  getFoodByUser,
  searchFood,
  editFood,
  deleteFood,
};

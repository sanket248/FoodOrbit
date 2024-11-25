const Review = require('../models/ReviewSchema'); // Import Review model

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user_id', 'name');
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

// Get reviews by user ID
const getReviewsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await Review.find({ user_id: userId });
    if (!reviews.length) {
      return res.status(404).json({ success: false, message: 'No reviews found for this user' });
    }
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

// Get reviews by food ID
const getReviewsByFoodId = async (req, res) => {
  const { foodId } = req.params;

  try {
    const reviews = await Review.find({ food_id: foodId });
    if (!reviews.length) {
      return res.status(404).json({ success: false, message: 'No reviews found for this food' });
    }
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

// Add a new review
const addReview = async (req, res) => {
  const { rating, review, food_id, user_id } = req.body;

  try {
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 0 and 5' });
    }

    const newReview = await Review.create({
      rating,
      review,
      user_id,
      food_id,
    });

    res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params; // Review ID to update
    const { rating, review } = req.body; // Data to update

    if (!rating && !review) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (rating or review) must be provided to update.',
      });
    }

    // Validate that rating is within allowed range if provided
    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5.',
      });
    }

    // Find and update the review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, review },
      { new: true } // Return the updated document
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully.',
      data: updatedReview,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params; // Review ID to delete

    // Find and delete the review
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
      data: deletedReview,
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};


module.exports = {
  getAllReviews,
  getReviewsByUserId,
  getReviewsByFoodId,
  addReview,
  updateReview,
  deleteReview
};

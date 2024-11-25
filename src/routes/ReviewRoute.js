const express = require('express');
const { getAllReviews, getReviewsByUserId, getReviewsByFoodId, addReview, updateReview, deleteReview } = require('../controllers/ReviewController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for JWT authentication
const router = express.Router();

// Get all reviews
router.get('/getall', getAllReviews);

// Get reviews by user ID
router.get('/user/:userId', authMiddleware, getReviewsByUserId);

// Get reviews by food ID
router.get('/food/:foodId', authMiddleware, getReviewsByFoodId);

// Add a new review
router.post('/add', authMiddleware, addReview);

// edit review
router.put('/edit/:id', updateReview);

//delete review
router.delete('/delete/:id', deleteReview);

module.exports = router;

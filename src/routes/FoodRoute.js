const express = require('express');
const { createFood, getAllFoods, getFoodById, getNearbyFoods, getFoodByUser, searchFood, editFood, deleteFood } = require('../controllers/FoodController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for JWT authentication
const router = express.Router();

// Create a new food item
router.post('/create', createFood);

// edit food
router.put('/edit/:id', editFood);

//delete food
router.delete('/delete/:id', deleteFood);

// Get all food items
router.get('/getall', getAllFoods);

// Get near by food items
router.get('/getnearbyfood', getNearbyFoods);

// Get food by user
router.get('/fetfoodbyuser', getFoodByUser);

// searh food
router.get('/search', searchFood);

// Get a food item by ID
router.get('/get/:id', getFoodById);

module.exports = router;

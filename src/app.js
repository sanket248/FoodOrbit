require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// import routes
const userRoute = require('./routes/UserRoute');
const foodRoute = require('./routes/FoodRoute');
const reviewRoute = require('./routes/ReviewRoute');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
connectDB();

// Routes
app.use('/api/user', userRoute);
app.use('/api/food', foodRoute);
app.use('/api/review', reviewRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

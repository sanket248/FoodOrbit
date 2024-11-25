const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Bearer <token>'

  // Check if token exists
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // Store decoded user information in request for future use
    req.user = decoded;
    next(); // Pass control to the next middleware or route handler
  });
};

module.exports = verifyToken;

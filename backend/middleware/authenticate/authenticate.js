const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Authentication middleware
const authenticate = (req, res, next) => {
  // Get token from request headers
  const token = req.headers.authorization;
  // const token = req.headers.authorization.split(' ')[1];

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user ID to request object
    req.user = decoded;

    // Proceed to next middleware/route handler
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = authenticate;

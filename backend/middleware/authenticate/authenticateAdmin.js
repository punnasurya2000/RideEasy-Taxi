const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticateAdmin = (req, res, next) => {
  // Get token from request headers
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the decoded token contains adminId
    if (!decoded.adminId) {
      throw new Error('Invalid token - Admin ID not found');
    }

    // Attach admin ID to request object
    req.adminId = decoded.adminId;

    // Proceed to next middleware/route handler
    next();
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = authenticateAdmin;

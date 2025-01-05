const pool = require('../../config/db');

const authenticateCustomer = async (req, res, next) => {
  const userId = req.user.userId; // Assuming the user ID is attached to the request object by the authentication middleware

  try {
    // Query the database to retrieve the user type for the given user ID
    const userTypeQuery =
      'SELECT USER_TYPE_NAME FROM USER_TYPES WHERE USER_TYPE_ID = (SELECT USER_TYPE_ID FROM USERS WHERE USER_ID = ?)';
    const [userTypeResult] = await pool.query(userTypeQuery, [userId]);

    // Check if user type is 'customer'
    if (
      userTypeResult &&
      userTypeResult.length > 0 &&
      userTypeResult[0].USER_TYPE_NAME === 'customer'
    ) {
      // User is authenticated as a customer, proceed to the next middleware/route handler
      next();
    } else {
      // User is not authenticated as a customer, return unauthorized error
      return res.status(401).json({
        error:
          'Unauthorized - Only authenticated customers can access this endpoint',
      });
    }
  } catch (error) {
    console.error('Error authenticating customer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authenticateCustomer;

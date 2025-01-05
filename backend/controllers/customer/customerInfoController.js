const pool = require('../../config/db');

exports.getCustomerData = async (req, res) => {
  const userId = req.user.userId;
  const userType = req.user.userType;

  try {
    // Query customer data based on user ID from USERS table
    if (userType !== 'customer') {
      return res.status(404).json({ message: 'Customer data not found' });
    }
    const userTypeQuery =
      'SELECT USER_TYPE_ID FROM USER_TYPES WHERE USER_TYPE_NAME = ?';
    const [userTypeResult] = await pool.query(userTypeQuery, [userType]);
    const userTypeId = userTypeResult[0].USER_TYPE_ID;
    const customerQuery =
      'SELECT * FROM USERS WHERE USER_ID = ? AND USER_TYPE_ID=?';
    const [customerData] = await pool.query(customerQuery, [
      userId,
      userTypeId,
    ]);

    if (!customerData || customerData.length === 0) {
      return res.status(404).json({ message: 'Customer data not found' });
    }

    return res.status(200).json({ customerData });
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCustomerProfile = async (req, res) => {
  const userId = req.user.userId;
  const { firstName, lastName } = req.body;

  try {
    // Check if the user exists
    const userExistsQuery = 'SELECT * FROM USERS WHERE USER_ID = ?';
    const [existingUser] = await pool.query(userExistsQuery, [userId]);

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve existing card details
    const { FIRST_NAME: prevFirstName, LAST_NAME: prevLastName } =
      existingUser[0];

    const updatedFirstName = firstName || prevFirstName;
    const updatedLastName = lastName || prevLastName;

    const updateQuery =
      'UPDATE USERS SET FIRST_NAME=?, LAST_NAME=? WHERE USER_ID=?';

    // Execute the update query
    await pool.query(updateQuery, [updatedFirstName, updatedLastName, userId]);

    return res
      .status(200)
      .json({ message: 'Customer profile updated successfully' });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const pool = require('../../../config/db');

exports.getCustomerCurrentRideDetails = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const getCurrentRideQuery = `
      SELECT R.RIDE_ID, R.DRIVER_ID, U.FIRST_NAME AS DRIVER_FIRST_NAME, R.SOURCE_LOCATION, R.DEST_LOCATION, R.FARE, R.DISTANCE
      FROM RIDE R
      JOIN USERS U ON R.DRIVER_ID = U.USER_ID
      WHERE R.CUSTOMER_ID = ? AND R.RIDE_STATUS = 'In Progress'
    `;
    const [rideDetails] = await pool.query(getCurrentRideQuery, [customerId]);

    if (rideDetails.length > 0) {
      const ride = rideDetails[0];
      res.status(200).json({ ride });
    } else {
      res.status(404).json({ error: 'No ride in progress for the customer' });
    }
  } catch (error) {
    console.error('Error fetching current ride details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

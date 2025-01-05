const pool = require('../../../config/db');

exports.getRidesByDriver = async (req, res) => {
  try {
    const driverId = req.user.userId;
    // Fetch completed rides by driver with customer names
    const getRidesQuery = `
      SELECT R.RIDE_ID, R.CUSTOMER_ID, C.FIRST_NAME AS CUSTOMER_FIRST_NAME, C.LAST_NAME AS CUSTOMER_LAST_NAME, R.SOURCE_LOCATION, R.DEST_LOCATION, R.FARE, R.RIDE_STATUS, R.CREATED_AT
      FROM RIDE R
      JOIN USERS D ON R.DRIVER_ID = D.USER_ID
      JOIN USERS C ON R.CUSTOMER_ID = C.USER_ID
      WHERE R.DRIVER_ID = ? AND R.RIDE_STATUS = 'Completed'
    `;
    const [driverRides] = await pool.query(getRidesQuery, [driverId]);

    res.status(200).json({ driverRides });
  } catch (error) {
    console.error('Error fetching rides by driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

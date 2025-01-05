const pool = require('../../../config/db');

// exports.getRidesByCustomer = async (req, res) => {
//   try {
//     const customerId = req.user.userId; // Assuming the customer ID is attached to the request object by the authentication middleware

//     // Query completed rides by customer
//     const selectQuery = `
//       SELECT * FROM RIDE WHERE CUSTOMER_ID = ? AND RIDE_STATUS = 'Completed'
//     `;
//     const [completedRides] = await pool.query(selectQuery, [customerId]);

//     res.status(200).json({ completedRides });
//   } catch (error) {
//     console.error('Error getting completed rides:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.getRidesByCustomer = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const selectQuery = `
      SELECT 
        R.RIDE_ID, 
        R.CUSTOMER_ID, 
        CU.FIRST_NAME AS CUSTOMER_FIRST_NAME, 
        CU.LAST_NAME AS CUSTOMER_LAST_NAME,
        R.DRIVER_ID, 
        DU.FIRST_NAME AS DRIVER_FIRST_NAME, 
        DU.LAST_NAME AS DRIVER_LAST_NAME,
        R.SOURCE_LOCATION, 
        R.DEST_LOCATION, 
        R.FARE, 
        R.RIDE_STATUS,
        R.CREATED_AT
      FROM 
        RIDE R
      JOIN 
        USERS CU ON R.CUSTOMER_ID = CU.USER_ID
      JOIN 
        USERS DU ON R.DRIVER_ID = DU.USER_ID
      WHERE 
        R.CUSTOMER_ID = ?;
    `;
    const [rides] = await pool.query(selectQuery, [customerId]);

    res.status(200).json({ rides });
  } catch (error) {
    console.error('Error fetching rides by customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

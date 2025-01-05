const pool = require('../../../config/db');

exports.setDriverAvailability = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { availability } = req.body;

    // Check if availability details are provided
    if (!availability) {
      return res.status(400).json({ error: 'Availability status is required' });
    }

    // Check the status of the driver's details
    const driverStatusQuery =
      'SELECT DRIVER_STATUS FROM DRIVER_DETAILS WHERE USER_ID = ?';
    const [driverStatusResult] = await pool.query(driverStatusQuery, [userId]);

    if (driverStatusResult.length > 0) {
      const driverStatus = driverStatusResult[0].DRIVER_STATUS;

      if (driverStatus === 'Approved') {
        // Proceed to update the driver's availability
        let query = 'SELECT * FROM DRIVER_AVAILABILITY WHERE USER_ID = ?';
        let [existingAvailability] = await pool.query(query, [userId]);

        if (existingAvailability.length > 0) {
          // Update the driver's availability
          query =
            'UPDATE DRIVER_AVAILABILITY SET AVAIL_STATUS = ? WHERE USER_ID = ?';
          await pool.query(query, [availability, userId]);
        } else {
          // Insert new availability record for the driver
          query =
            'INSERT INTO DRIVER_AVAILABILITY (USER_ID, AVAIL_STATUS) VALUES (?, ?)';
          await pool.query(query, [userId, availability]);
        }

        res
          .status(200)
          .json({ message: 'Driver availability updated successfully' });
      } else {
        res.status(403).json({
          error: 'Driver details are pending approval or have been rejected',
        });
      }
    } else {
      res.status(404).json({ error: 'Driver details not found' });
    }
  } catch (error) {
    console.error('Error setting driver availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDriverAvailability = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Query driver availability from the database
    const query =
      'SELECT AVAIL_STATUS FROM DRIVER_AVAILABILITY WHERE USER_ID = ?';
    const [driverAvailability] = await pool.query(query, [userId]);

    if (driverAvailability.length > 0) {
      // Return the driver's availability status
      const { AVAIL_STATUS } = driverAvailability[0];
      res.status(200).json({ availability: AVAIL_STATUS });
    } else {
      res.status(404).json({ error: 'Driver availability not found' });
    }
  } catch (error) {
    console.error('Error fetching driver availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

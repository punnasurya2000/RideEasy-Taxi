const pool = require('../../../config/db');

async function checkDriverAvailability(driverId) {
  try {
    // Query the database to check if the driver is available
    const availabilityQuery =
      'SELECT AVAIL_STATUS FROM DRIVER_AVAILABILITY WHERE USER_ID = ?';
    const [result] = await pool.query(availabilityQuery, [driverId]);

    if (result && result.length > 0) {
      // Check the driver's availability status
      return result[0].AVAIL_STATUS === 'Available';
    } else {
      // Driver availability record not found
      return false;
    }
  } catch (error) {
    console.error('Error checking driver availability:', error);
    throw error;
  }
}

module.exports = checkDriverAvailability;

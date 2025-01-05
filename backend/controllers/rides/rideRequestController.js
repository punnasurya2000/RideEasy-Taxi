const pool = require('../../config/db');

exports.createRideRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pendingRequestQuery = `
      SELECT * FROM RIDE_REQUEST WHERE USER_ID = ? AND REQUEST_STATUS = 'Pending'
    `;
    const [pendingRequests] = await pool.query(pendingRequestQuery, [userId]);

    if (pendingRequests.length > 0) {
      const deleteQuery = `
        DELETE FROM RIDE_REQUEST WHERE USER_ID = ? AND REQUEST_STATUS = 'Pending'
      `;
      await pool.query(deleteQuery, [userId]);
    }
    const { sourceLocation, destLocation, fare, distance } = req.body;
    if (!sourceLocation || !destLocation || !fare || !distance) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const insertQuery = `
      INSERT INTO RIDE_REQUEST (SOURCE_LOCATION, DEST_LOCATION, USER_ID, FARE,DISTANCE,  REQUEST_STATUS)
      VALUES (?, ?, ?, ?,?, 'Pending')
    `;
    await pool.query(insertQuery, [
      sourceLocation,
      destLocation,
      userId,
      fare,
      distance,
    ]);

    res.status(201).json({ message: 'Ride request submitted successfully' });
  } catch (error) {
    console.error('Error requesting ride:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPendingRideRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const selectQuery = `
      SELECT * FROM RIDE_REQUEST WHERE USER_ID = ? AND REQUEST_STATUS = 'Pending'
    `;
    const [rideRequests] = await pool.query(selectQuery, [userId]);

    res.status(200).json({ rideRequests });
  } catch (error) {
    console.error('Error getting pending ride requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.cancelRideRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requestId = req.params.requestId;

    const checkRequestQuery = `
      SELECT * FROM RIDE_REQUEST WHERE REQUEST_ID = ? AND USER_ID = ? AND REQUEST_STATUS = 'Pending'
    `;
    const [requestedRide] = await pool.query(checkRequestQuery, [
      requestId,
      userId,
    ]);

    if (requestedRide.length > 0) {
      const deleteQuery = `
        DELETE FROM RIDE_REQUEST WHERE REQUEST_ID = ?
      `;
      await pool.query(deleteQuery, [requestId]);
      res
        .status(200)
        .json({ message: 'Pending ride request cancelled successfully' });
    } else {
      res.status(404).json({
        error: 'Pending ride request not found or does not belong to the user',
      });
    }
  } catch (error) {
    console.error('Error cancelling ride request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllPendingRideRequests = async (req, res) => {
  try {
    const driverUserId = req.user.userId;

    const checkAvailabilityQuery = `
      SELECT AVAIL_STATUS FROM DRIVER_AVAILABILITY WHERE USER_ID = ? AND AVAIL_STATUS = 'Available'
    `;
    const [availabilityResult] = await pool.query(checkAvailabilityQuery, [
      driverUserId,
    ]);

    if (availabilityResult.length > 0) {
      const query = 'SELECT * FROM RIDE_REQUEST WHERE REQUEST_STATUS = ?';

      const [pendingRequests] = await pool.query(query, ['Pending']);

      res.status(200).json({ pendingRequests });
    } else {
      res.status(403).json({ error: 'Driver is not available' });
    }
  } catch (error) {
    console.error('Error fetching pending ride requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

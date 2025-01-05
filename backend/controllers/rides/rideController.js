const pool = require('../../config/db');

exports.acceptRideRequest = async (req, res) => {
  try {
    const driverId = req.user.userId;
    const requestId = req.params.requestId;

    const checkAvailabilityQuery = `
      SELECT * FROM DRIVER_AVAILABILITY WHERE USER_ID = ? AND AVAIL_STATUS = 'Available'
    `;
    const [driverAvailability] = await pool.query(checkAvailabilityQuery, [
      driverId,
    ]);

    // If the driver is available, proceed to accept the ride request
    if (driverAvailability.length > 0) {
      const checkRequestQuery = `
        SELECT * FROM RIDE_REQUEST WHERE REQUEST_ID = ? AND REQUEST_STATUS = 'Pending'
      `;
      const [requestedRide] = await pool.query(checkRequestQuery, [requestId]);

      if (requestedRide.length > 0) {
        const { SOURCE_LOCATION, DEST_LOCATION, FARE, USER_ID, DISTANCE } =
          requestedRide[0];

        // Retrieve the card ID associated with the user
        const getCardQuery = `
          SELECT CARD_ID FROM CARD_DETAILS WHERE USER_ID = ?
        `;
        const [cardResult] = await pool.query(getCardQuery, [USER_ID]);

        if (cardResult.length > 0) {
          const cardId = cardResult[0].CARD_ID;

          // Insert ride details into the RIDE table
          const insertRideQuery = `
            INSERT INTO RIDE (CUSTOMER_ID, DRIVER_ID, SOURCE_LOCATION, DEST_LOCATION, FARE, DISTANCE, RIDE_STATUS)
            VALUES (?, ?, ?, ?, ?, ?, 'In Progress')
          `;
          const [rideInsertResult] = await pool.query(insertRideQuery, [
            USER_ID,
            driverId,
            SOURCE_LOCATION,
            DEST_LOCATION,
            FARE,
            DISTANCE,
          ]);

          // Retrieve the generated rideId
          const rideId = rideInsertResult.insertId;

          // Insert a pending payment record with the card ID
          const insertPaymentQuery = `
            INSERT INTO PAYMENT (RIDE_ID, CARD_ID, AMOUNT, STATUS)
            VALUES (?, ?, ?, 'Pending')
          `;
          await pool.query(insertPaymentQuery, [rideId, cardId, FARE]);

          // Delete the ride request from the RIDE_REQUEST table
          const deleteRequestQuery = `
            DELETE FROM RIDE_REQUEST WHERE REQUEST_ID = ?
          `;
          await pool.query(deleteRequestQuery, [requestId]);

          // Update driver availability to 'Not Available'
          const updateAvailabilityQuery = `
            UPDATE DRIVER_AVAILABILITY SET AVAIL_STATUS = 'Not Available' WHERE USER_ID = ?
          `;
          await pool.query(updateAvailabilityQuery, [driverId]);

          res
            .status(200)
            .json({ message: 'Ride request accepted successfully' });
        } else {
          res
            .status(404)
            .json({ error: 'Card details not found for the user' });
        }
      } else {
        // If the requested ride is not found or is not pending, return an error
        res.status(404).json({
          error: 'Pending ride request not found or has already been accepted',
        });
      }
    } else {
      // If the driver is not available, return an error
      res.status(403).json({
        error: 'You are not currently available to accept ride requests',
      });
    }
  } catch (error) {
    console.error('Error accepting ride request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// exports.acceptRideRequest = async (req, res) => {
//   try {
//     const driverId = req.user.userId;
//     const requestId = req.params.requestId;

//     const checkAvailabilityQuery = `
//       SELECT * FROM DRIVER_AVAILABILITY WHERE USER_ID = ? AND AVAIL_STATUS = 'Available'
//     `;
//     const [driverAvailability] = await pool.query(checkAvailabilityQuery, [
//       driverId,
//     ]);

//     // If the driver is available, proceed to accept the ride request
//     if (driverAvailability.length > 0) {
//       const checkRequestQuery = `
//         SELECT * FROM RIDE_REQUEST WHERE REQUEST_ID = ? AND REQUEST_STATUS = 'Pending'
//       `;
//       const [requestedRide] = await pool.query(checkRequestQuery, [requestId]);

//       if (requestedRide.length > 0) {
//         const { SOURCE_LOCATION, DEST_LOCATION, FARE, USER_ID, DISTANCE } =
//           requestedRide[0];

//         // Retrieve the card ID associated with the user
//         const getCardQuery = `
//           SELECT CARD_ID FROM CARD_DETAILS WHERE USER_ID = ?
//         `;
//         const [cardResult] = await pool.query(getCardQuery, [USER_ID]);

//         if (cardResult.length > 0) {
//           const cardId = cardResult[0].CARD_ID;

//           // Insert ride details into the RIDE table
//           const insertRideQuery = `
//             INSERT INTO RIDE (CUSTOMER_ID, DRIVER_ID, SOURCE_LOCATION, DEST_LOCATION, FARE, DISTANCE, RIDE_STATUS)
//             VALUES (?, ?, ?, ?, ?, ?, 'In Progress')
//           `;
//           const [rideInsertResult] = await pool.query(insertRideQuery, [
//             USER_ID,
//             driverId,
//             SOURCE_LOCATION,
//             DEST_LOCATION,
//             FARE,
//             DISTANCE,
//           ]);

//           // Retrieve the generated rideId
//           const rideId = rideInsertResult.insertId;

//           // Insert a pending payment record with the card ID
//           const insertPaymentQuery = `
//             INSERT INTO PAYMENT (RIDE_ID, CARD_ID, AMOUNT, STATUS)
//             VALUES (?, ?, ?, 'Pending')
//           `;
//           await pool.query(insertPaymentQuery, [rideId, cardId, FARE]);

//           // Delete the ride request from the RIDE_REQUEST table
//           const deleteRequestQuery = `
//             DELETE FROM RIDE_REQUEST WHERE REQUEST_ID = ?
//           `;
//           await pool.query(deleteRequestQuery, [requestId]);

//           res
//             .status(200)
//             .json({ message: 'Ride request accepted successfully' });
//         } else {
//           res
//             .status(404)
//             .json({ error: 'Card details not found for the user' });
//         }
//       } else {
//         // If the requested ride is not found or is not pending, return an error
//         res.status(404).json({
//           error: 'Pending ride request not found or has already been accepted',
//         });
//       }
//     } else {
//       // If the driver is not available, return an error
//       res.status(403).json({
//         error: 'You are not currently available to accept ride requests',
//       });
//     }
//   } catch (error) {
//     console.error('Error accepting ride request:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.getDriverCurrentRideDetails = async (req, res) => {
  try {
    const driverId = req.user.userId; // Assuming the driver ID is attached to the request object by the authentication middleware

    // Fetch details of the current in-progress ride and the associated customer
    const getCurrentRideQuery = `
    SELECT R.RIDE_ID, R.CUSTOMER_ID, U.FIRST_NAME AS CUSTOMER_FIRST_NAME, R.SOURCE_LOCATION, R.DEST_LOCATION, R.FARE, R.DISTANCE
    FROM RIDE R
    JOIN USERS U ON R.CUSTOMER_ID = U.USER_ID
    WHERE R.DRIVER_ID = ? AND R.RIDE_STATUS = 'In Progress'
    `;
    const [rideDetails] = await pool.query(getCurrentRideQuery, [driverId]);

    // Check if there's a ride in progress for the driver
    if (rideDetails.length > 0) {
      const ride = rideDetails[0];
      res.status(200).json({ ride });
    } else {
      // If there's no ride in progress for the driver, return an error
      res.status(404).json({ error: 'No ride in progress for the driver' });
    }
  } catch (error) {
    console.error('Error fetching current ride details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.completeRide = async (req, res) => {
  try {
    const driverId = req.user.userId; // Assuming the driver ID is attached to the request object by the authentication middleware
    const rideId = req.params.rideId; // Extracting the ride ID from the URL parameters

    // Fetch the ride details based on the provided ride ID
    const getRideQuery = `
      SELECT RIDE_ID, DRIVER_ID, DEST_LOCATION, RIDE_STATUS FROM RIDE WHERE RIDE_ID = ? AND DRIVER_ID = ?
    `;
    const [rideResult] = await pool.query(getRideQuery, [rideId, driverId]);

    // Check if a ride with the provided ride ID and driver ID exists
    if (rideResult.length > 0) {
      const { RIDE_ID, DEST_LOCATION, RIDE_STATUS } = rideResult[0];

      // Check if the ride status is "In Progress"
      if (RIDE_STATUS === 'In Progress') {
        const { currentLocation } = req.body; // Assuming the current location of the driver is still passed in the request body

        // // Check if the current location matches the destination location
        // if (currentLocation === DEST_LOCATION) {
        // Update ride status to "Completed"
        const updateRideQuery = `
            UPDATE RIDE SET RIDE_STATUS = 'Completed' WHERE RIDE_ID = ? AND RIDE_STATUS = 'In Progress'
          `;
        const [updateResult] = await pool.query(updateRideQuery, [RIDE_ID]);

        if (updateResult.affectedRows > 0) {
          // Update payment status to "Completed"
          const updatePaymentQuery = `
              UPDATE PAYMENT SET STATUS = 'Completed' WHERE RIDE_ID = ?
            `;
          await pool.query(updatePaymentQuery, [RIDE_ID]);

          // Update driver availability status to "Available"
          const updateDriverAvailabilityQuery = `
              UPDATE DRIVER_AVAILABILITY SET AVAIL_STATUS = 'Available' WHERE USER_ID = ?
            `;
          await pool.query(updateDriverAvailabilityQuery, [driverId]);

          res.status(200).json({ message: 'Ride completed successfully' });
        } else {
          res.status(404).json({ error: 'No ride in progress for the driver' });
        }
        // } else {
        //   res.status(400).json({
        //     error: 'Current location does not match destination location',
        //   });
        // }
      } else {
        res.status(400).json({ error: 'Ride is not in progress' });
      }
    } else {
      res
        .status(404)
        .json({ error: 'No ride found with the provided ID for the driver' });
    }
  } catch (error) {
    console.error('Error completing ride:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

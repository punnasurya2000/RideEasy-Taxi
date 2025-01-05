const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate/authenticate');
const authenticateDriver = require('../../middleware/authenticate/authenticateDriver');
const rideRequestController = require('../../controllers/rides/rideRequestController');
const driverAvailabilityController = require('../../controllers/rides/driver/driverAvailabilityController');
const rideController = require('../../controllers/rides/rideController');

// Route for setting driver availability
router.put(
  '/driver/availability',
  authenticate,
  authenticateDriver,
  driverAvailabilityController.setDriverAvailability
);

// Route for fetching driver availability
router.get(
  '/driver/availability',
  authenticate,
  authenticateDriver,
  driverAvailabilityController.getDriverAvailability
);

// Route for fetching pending ride requests for available drivers
router.get(
  '/ride-requests',
  authenticate,
  authenticateDriver,
  rideRequestController.getAllPendingRideRequests
);

router.put(
  '/ride-request/:requestId/accept',
  authenticate,
  authenticateDriver,
  rideController.acceptRideRequest
);

module.exports = router;

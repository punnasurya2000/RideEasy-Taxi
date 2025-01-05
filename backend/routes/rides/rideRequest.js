const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate/authenticate');
const authenticateCustomer = require('../../middleware/authenticate/authenticateCustomer');
const rideRequestController = require('../../controllers/rides/rideRequestController');

router.post(
  '/ride-request',
  authenticate,
  authenticateCustomer,
  rideRequestController.createRideRequest
);

router.get(
  '/ride-request',
  authenticate,
  authenticateCustomer,
  rideRequestController.getPendingRideRequests
);

router.delete(
  '/cancel/:requestId',
  authenticate,
  authenticateCustomer,
  rideRequestController.cancelRideRequest
);

module.exports = router;

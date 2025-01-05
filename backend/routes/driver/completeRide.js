const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate/authenticate');
const rideController = require('../../controllers/rides/rideController');
const authenticateDriver = require('../../middleware/authenticate/authenticateDriver');

router.get(
  '/',
  authenticate,
  authenticateDriver,
  rideController.getDriverCurrentRideDetails
);

router.put(
  '/completeride/:rideId',
  authenticate,
  authenticateDriver,
  rideController.completeRide
);

module.exports = router;

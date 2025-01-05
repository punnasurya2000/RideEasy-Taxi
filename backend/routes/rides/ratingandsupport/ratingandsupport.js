const express = require('express');
const router = express.Router();
const rideRatingController = require('../../../controllers/rides/ratingandsupport/ratingandSupportController');
const authenticate = require('../../../middleware/authenticate/authenticate');
const authenticateCustomer = require('../../../middleware/authenticate/authenticateCustomer');

router.post(
  '/:rideId/ride-rating',
  authenticate,
  authenticateCustomer,
  rideRatingController.addOrUpdateRideRating
);

router.get(
  '/:rideId/ride-rating',
  authenticate,
  authenticateCustomer,
  rideRatingController.getRideRating
);

router.post(
  '/:rideId/support',
  authenticate,
  authenticateCustomer,
  rideRatingController.addOrUpdateSupportRequest
);

router.get(
  '/:rideId/support',
  authenticate,
  authenticateCustomer,
  rideRatingController.getRideSupport
);

module.exports = router;

module.exports = router;

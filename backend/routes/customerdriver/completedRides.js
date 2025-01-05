const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate/authenticate');
const customerRidesController = require('../../controllers/rides/customerdriver/customerRidesController');
const driverRidesController = require('../../controllers/rides/customerdriver/driverRidesController');
const authenticateCustomer = require('../../middleware/authenticate/authenticateCustomer');
const authenticateDriver = require('../../middleware/authenticate/authenticateDriver');

router.get(
  '/customer-rides',
  authenticate,
  authenticateCustomer,
  customerRidesController.getRidesByCustomer
);

router.get(
  '/driver-rides',
  authenticate,
  authenticateDriver,
  driverRidesController.getRidesByDriver
);

module.exports = router;

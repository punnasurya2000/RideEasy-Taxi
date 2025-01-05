const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate/authenticate');
const customerCurrentRideController = require('../../controllers/rides/customer/customerCurrentRideController');
const authenticateCustomer = require('../../middleware/authenticate/authenticateCustomer');

router.get(
  '/',
  authenticate,
  authenticateCustomer,
  customerCurrentRideController.getCustomerCurrentRideDetails
);

module.exports = router;

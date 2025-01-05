const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/customer/customerController');
const customerInfoController = require('../../controllers/customer/customerInfoController');
const authenticate = require('../../middleware/authenticate/authenticate');
router.post('/registration', customerController.saveCustomerUser);

router.post('/login', customerController.customerLogin);

router.get(
  '/customer-data',
  authenticate,
  customerInfoController.getCustomerData
);

router.post(
  '/updateprofile',
  authenticate,
  customerInfoController.updateCustomerProfile
);

module.exports = router;

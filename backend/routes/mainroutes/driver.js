const express = require('express');
const router = express.Router();
const driverController = require('../../controllers/driver/driverController');
const driverDetailsController = require('../../controllers/driver/driverDetailsController');
const authenticate = require('../../middleware/authenticate/authenticate');
const authenticateDriver = require('../../middleware/authenticate/authenticateDriver');

router.post('/registration', driverController.saveDriverUser);
router.post('/login', driverController.driverLogin);
router.get('/driver-info', authenticate, driverDetailsController.getDriverInfo);

router.post(
  '/details',
  authenticate,
  authenticateDriver,
  driverDetailsController.saveOrUpdateDriverDetails
);

router.put(
  '/details',
  authenticate,
  authenticateDriver,
  driverDetailsController.saveOrUpdateDriverDetails
);

router.get(
  '/details',
  authenticate,
  authenticateDriver,
  driverDetailsController.getDriverDetails
);

module.exports = router;

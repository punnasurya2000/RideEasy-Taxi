const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const authenticateAdmin = require('../../middleware/authenticate/authenticateAdmin');

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

router.get(
  '/pending-drivers',
  authenticateAdmin,
  adminController.getPendingDrivers
);

router.put(
  '/approve-driver/:driverId',
  authenticateAdmin,
  adminController.approveDriver
);

module.exports = router;

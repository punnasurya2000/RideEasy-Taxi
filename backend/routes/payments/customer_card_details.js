const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate/authenticate');
const cardController = require('../../controllers/payments/cardController');

// router.post('/add', authenticate, cardController.addCardDetails);

router.post('/update', authenticate, cardController.saveOrUpdateCardDetails);

router.delete(
  '/delete/:cardId',
  authenticate,
  cardController.deleteCardDetails
);
router.get('/', authenticate, cardController.getCardDetails);

module.exports = router;

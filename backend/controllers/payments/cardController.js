const pool = require('../../config/db');
const { validationResult } = require('express-validator');

exports.getCardDetails = async (req, res) => {
  const userId = req.user.userId; // Extracting user ID from authenticated user

  try {
    const query = 'SELECT * FROM CARD_DETAILS WHERE USER_ID = ?';
    const [cardDetails] = await pool.query(query, [userId]);

    // Check if card details exist
    if (!cardDetails || cardDetails.length === 0) {
      return res.status(404).json({ message: 'Card details not found' });
    }

    // Return card details
    return res.status(200).json({ cardDetails });
  } catch (error) {
    console.error('Error fetching card details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.saveOrUpdateCardDetails = async (req, res) => {
  const userId = req.user.userId;
  const { cardNumber, cvv, cardExpiry, fullName, zipCode, country } = req.body;

  // Validate card details
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if card already exists
    const existingCardQuery = 'SELECT * FROM CARD_DETAILS WHERE USER_ID = ?';
    const [existingCard] = await pool.query(existingCardQuery, [userId]);

    if (existingCard.length === 0) {
      // Insert card details into database if card doesn't exist
      const insertQuery = `
        INSERT INTO CARD_DETAILS (USER_ID, CARD_NUMBER, CVV, CARD_EXPIRY, FULL_NAME, ZIP_CODE, COUNTRY)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.query(insertQuery, [
        userId,
        cardNumber,
        cvv,
        cardExpiry,
        fullName,
        zipCode,
        country,
      ]);

      return res
        .status(201)
        .json({ message: 'Card details added successfully' });
    } else {
      // Prepare updated values
      const updatedValues = {
        CARD_NUMBER: cardNumber || existingCard[0].CARD_NUMBER,
        CVV: cvv || existingCard[0].CVV,
        CARD_EXPIRY: cardExpiry || existingCard[0].CARD_EXPIRY,
        FULL_NAME: fullName || existingCard[0].FULL_NAME,
        ZIP_CODE: zipCode || existingCard[0].ZIP_CODE,
        COUNTRY: country || existingCard[0].COUNTRY,
      };

      // Build the update query dynamically based on the provided fields
      let updateQuery = 'UPDATE CARD_DETAILS SET ';
      const updateFields = Object.keys(updatedValues).map(
        (key) => `${key} = ?`
      );
      updateQuery += updateFields.join(', ');
      updateQuery += ' WHERE USER_ID = ?';

      // Extract values from the updatedValues object
      const updateValues = [...Object.values(updatedValues), userId];

      // Execute the update query
      await pool.query(updateQuery, updateValues);

      return res
        .status(200)
        .json({ message: 'Card details updated successfully' });
    }
  } catch (error) {
    console.error('Error saving or updating card details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// exports.saveOrUpdateCardDetails = async (req, res) => {
//   const userId = req.user.userId;
//   const cardId = req.params.cardId; // Retrieve cardId from request parameters
//   const { cardNumber, cvv, cardExpiry, fullName, zipCode, country } = req.body;

//   // Validate card details
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     // Check if card exists
//     const existingCardQuery =
//       'SELECT * FROM CARD_DETAILS WHERE CARD_ID = ? AND USER_ID = ?';
//     const [existingCard] = await pool.query(existingCardQuery, [
//       cardId,
//       userId,
//     ]);

//     if (existingCard.length === 0) {
//       // If card doesn't exist, insert new card details
//       const insertQuery = `
//         INSERT INTO CARD_DETAILS (USER_ID, CARD_NUMBER, CVV, CARD_EXPIRY, FULL_NAME, ZIP_CODE, COUNTRY)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;
//       await pool.query(insertQuery, [
//         userId,
//         cardNumber,
//         cvv,
//         cardExpiry,
//         fullName,
//         zipCode,
//         country,
//       ]);

//       return res
//         .status(201)
//         .json({ message: 'Card details added successfully' });
//     } else {
//       // If card exists, update card details
//       const updateQuery = `
//         UPDATE CARD_DETAILS
//         SET CARD_NUMBER = ?, CVV = ?, CARD_EXPIRY = ?, FULL_NAME = ?, ZIP_CODE = ?, COUNTRY = ?
//         WHERE CARD_ID = ? AND USER_ID = ?
//       `;
//       await pool.query(updateQuery, [
//         cardNumber,
//         cvv,
//         cardExpiry,
//         fullName,
//         zipCode,
//         country,
//         cardId,
//         userId,
//       ]);

//       return res
//         .status(200)
//         .json({ message: 'Card details updated successfully' });
//     }
//   } catch (error) {
//     console.error('Error saving/updating card details:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.addCardDetails = async (req, res) => {
//   const userId = req.user.userId;
//   const { cardNumber, cvv, cardExpiry, fullName, zipCode, country } = req.body;

//   // Validate card details
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     // Check if card already exists
//     const existingCardQuery =
//       'SELECT * FROM CARD_DETAILS WHERE USER_ID = ? AND CARD_NUMBER = ?';
//     const [existingCard] = await pool.query(existingCardQuery, [
//       userId,
//       cardNumber,
//     ]);

//     if (existingCard.length > 0) {
//       return res.status(400).json({ error: 'Card already exists' });
//     }

//     // Insert card details into database
//     const insertQuery = `
//       INSERT INTO CARD_DETAILS (USER_ID, CARD_NUMBER, CVV, CARD_EXPIRY, FULL_NAME, ZIP_CODE, COUNTRY)
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;
//     await pool.query(insertQuery, [
//       userId,
//       cardNumber,
//       cvv,
//       cardExpiry,
//       fullName,
//       zipCode,
//       country,
//     ]);

//     return res.status(201).json({ message: 'Card details added successfully' });
//   } catch (error) {
//     console.error('Error adding card details:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.updateCardDetails = async (req, res) => {
//   const userId = req.user.userId;
//   const cardId = req.params.cardId; // Retrieve cardId from request parameters
//   const { cardNumber, cvv, cardExpiry, fullName, zipCode, country } = req.body;

//   // Validate card details
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     // Check if card exists
//     const existingCardQuery =
//       'SELECT * FROM CARD_DETAILS WHERE CARD_ID = ? AND USER_ID = ?';
//     const [existingCard] = await pool.query(existingCardQuery, [
//       cardId,
//       userId,
//     ]);

//     if (existingCard.length === 0) {
//       return res.status(404).json({ error: 'Card not found' });
//     }

//     // Retrieve existing card details
//     const {
//       CARD_NUMBER: prevCardNumber,
//       CVV: prevCvv,
//       CARD_EXPIRY: prevCardExpiry,
//       FULL_NAME: prevFullName,
//       ZIP_CODE: prevZipCode,
//       COUNTRY: prevCountry,
//     } = existingCard[0];

//     // Update card details only if new values are provided, otherwise retain previous values
//     const updatedCardNumber = cardNumber || prevCardNumber;
//     const updatedCvv = cvv || prevCvv;
//     const updatedCardExpiry = cardExpiry || prevCardExpiry;
//     const updatedFullName = fullName || prevFullName;
//     const updatedZipCode = zipCode || prevZipCode;
//     const updatedCountry = country || prevCountry;

//     // Update card details in database
//     const updateQuery = `
//       UPDATE CARD_DETAILS
//       SET CARD_NUMBER = ?, CVV = ?, CARD_EXPIRY = ?, FULL_NAME = ?, ZIP_CODE = ?, COUNTRY = ?
//       WHERE CARD_ID = ? AND USER_ID = ?
//     `;
//     await pool.query(updateQuery, [
//       updatedCardNumber,
//       updatedCvv,
//       updatedCardExpiry,
//       updatedFullName,
//       updatedZipCode,
//       updatedCountry,
//       cardId,
//       userId,
//     ]);

//     return res
//       .status(200)
//       .json({ message: 'Card details updated successfully' });
//   } catch (error) {
//     console.error('Error updating card details:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.deleteCardDetails = async (req, res) => {
  const userId = req.user.userId;
  const cardId = req.params.id;

  try {
    // Check if card exists
    const existingCardQuery =
      'SELECT * FROM CARD_DETAILS WHERE CARD_ID = ? AND USER_ID = ?';
    const [existingCard] = await pool.query(existingCardQuery, [
      cardId,
      userId,
    ]);

    if (existingCard.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Delete card details from database
    const deleteQuery =
      'DELETE FROM CARD_DETAILS WHERE CARD_ID = ? AND USER_ID = ?';
    await pool.query(deleteQuery, [cardId, userId]);

    return res
      .status(200)
      .json({ message: 'Card details deleted successfully' });
  } catch (error) {
    console.error('Error deleting card details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

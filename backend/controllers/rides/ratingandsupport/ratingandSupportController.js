const pool = require('../../../config/db');

exports.addOrUpdateRideRating = async (req, res) => {
  const { rideId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.userId;

  if (rating < 0 || rating > 5 || !rating) {
    return res
      .status(400)
      .json({ error: 'Invalid rating. Rating must be between 0 and 5.' });
  }
  try {
    const [rideDetails] = await pool.query(
      'SELECT * FROM RIDE WHERE RIDE_ID = ? AND CUSTOMER_ID = ?',
      [rideId, userId]
    );
    if (rideDetails.length === 0) {
      return res.status(404).json({
        error: 'Ride not found or you are not authorized to rate this ride.',
      });
    }

    const [existingRating] = await pool.query(
      'SELECT * FROM RIDE_RATING WHERE RIDE_ID = ?',
      [rideId]
    );
    if (existingRating.length > 0) {
      await pool.query(
        'UPDATE RIDE_RATING SET RATING = ?, COMMENT = ? WHERE RIDE_ID = ?',
        [rating, comment, rideId]
      );
      return res
        .status(200)
        .json({ message: 'Ride rating updated successfully.' });
    } else {
      await pool.query(
        'INSERT INTO RIDE_RATING (RIDE_ID, RATING, COMMENT, CREATED_AT) VALUES (?, ?, ?, NOW())',
        [rideId, rating, comment]
      );
      return res
        .status(201)
        .json({ message: 'Ride rating added successfully.' });
    }
  } catch (error) {
    console.error('Error adding/updating ride rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRideRating = async (req, res) => {
  const userId = req.user.userId;
  const { rideId } = req.params;

  try {
    const [rideDetails] = await pool.query(
      'SELECT * FROM RIDE WHERE RIDE_ID = ? AND CUSTOMER_ID = ?',
      [rideId, userId]
    );
    if (rideDetails.length === 0) {
      return res.status(404).json({
        error:
          'Ride not found or you are not authorized to access the rating for this ride.',
      });
    }

    const [rating] = await pool.query(
      'SELECT RATING, COMMENT FROM RIDE_RATING WHERE RIDE_ID = ?',
      [rideId]
    );
    if (rating.length === 0) {
      return res.status(404).json({ error: 'Rating not found for this ride.' });
    }

    res.status(200).json({ rating: rating[0] });
  } catch (error) {
    console.error('Error fetching ride rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addOrUpdateSupportRequest = async (req, res) => {
  const { rideId } = req.params;
  const { description } = req.body;
  const userId = req.user.userId;

  if (!description) {
    return res.status(400).json({ error: 'Description cannot be empty.' });
  }

  try {
    const [rideDetails] = await pool.query(
      'SELECT * FROM RIDE WHERE RIDE_ID = ? AND CUSTOMER_ID = ?',
      [rideId, userId]
    );
    if (rideDetails.length === 0) {
      return res.status(404).json({
        error:
          'Ride not found or you are not authorized to submit a support request for this ride.',
      });
    }

    const [existingSupport] = await pool.query(
      'SELECT * FROM RIDE_SUPPORT WHERE RIDE_ID = ?',
      [rideId]
    );
    if (existingSupport.length > 0) {
      await pool.query(
        'UPDATE RIDE_SUPPORT SET DESCRIPTION = ? WHERE RIDE_ID = ?',
        [description, rideId]
      );
      return res
        .status(200)
        .json({ message: 'Support request updated successfully.' });
    } else {
      await pool.query(
        'INSERT INTO RIDE_SUPPORT (RIDE_ID, DESCRIPTION, SUPPORT_STATUS, CREATED_AT) VALUES (?, ?, ?, NOW())',
        [rideId, description, 'Open']
      );
      return res
        .status(201)
        .json({ message: 'Support request added successfully.' });
    }
  } catch (error) {
    console.error('Error adding/updating support request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRideSupport = async (req, res) => {
  const { rideId } = req.params;
  const userId = req.user.userId;
  try {
    // Check if the ride exists and was taken by the authenticated user
    const [rideDetails] = await pool.query(
      'SELECT * FROM RIDE WHERE RIDE_ID = ? AND CUSTOMER_ID = ?',
      [rideId, userId]
    );
    if (rideDetails.length === 0) {
      return res.status(404).json({
        error:
          'Ride not found or you are not authorized to access support requests for this ride.',
      });
    }

    const getSupportQuery = 'SELECT * FROM RIDE_SUPPORT WHERE RIDE_ID=?';
    const [supportResult] = await pool.query(getSupportQuery, [rideId]);

    res.status(200).json({
      supportResult,
    });
  } catch (err) {
    console.error('error getting support requested', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

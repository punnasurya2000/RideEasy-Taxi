const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

exports.saveDriverUser = async (req, res) => {
  const { email, phone, password, first_name, last_name } = req.body;

  try {
    // Input validation
    if (!email || !phone || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const driverExistsQuery = 'SELECT * FROM USERS WHERE EMAIL=? OR PHONE=?';
    const [existingUser] = await pool.query(driverExistsQuery, [email, phone]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userTypeQuery =
      'SELECT USER_TYPE_ID FROM USER_TYPES WHERE USER_TYPE_NAME=?';
    const [userTypeResult] = await pool.query(userTypeQuery, 'driver');
    const userTypeID = userTypeResult[0].USER_TYPE_ID;

    const hashedPassword = await bcrypt.hash(password, 10);

    const driverInsertQuery =
      'INSERT INTO USERS (EMAIL, PHONE, PASSWORD, USER_TYPE_ID, FIRST_NAME, LAST_NAME) VALUES(?,?,?,?,?,?)';
    await pool.query(driverInsertQuery, [
      email,
      phone,
      hashedPassword,
      userTypeID,
      first_name,
      last_name,
    ]);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering driver', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.driverLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database to retrieve the driver record
    const driverQuery =
      'SELECT * FROM USERS WHERE (EMAIL=? OR PHONE=?) AND USER_TYPE_ID = (SELECT USER_TYPE_ID FROM USER_TYPES WHERE USER_TYPE_NAME = "driver")';
    const [driver] = await pool.query(driverQuery, [username, username]);

    // If driver not found or incorrect password
    if (
      !driver ||
      driver.length === 0 ||
      !(await bcrypt.compare(password, driver[0].PASSWORD))
    ) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: driver[0].USER_ID, userType: 'driver' },
      secretKey,
      { expiresIn: '24h' }
    );

    // Successful login
    return res.status(200).json({ message: 'Driver login successful', token });
  } catch (err) {
    console.error('Error logging in as driver:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

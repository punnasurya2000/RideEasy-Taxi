const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

exports.saveCustomerUser = async (req, res) => {
  const { email, phone, password, first_name, last_name } = req.body;

  const userTypeQuery =
    'SELECT USER_TYPE_ID FROM USER_TYPES WHERE USER_TYPE_NAME=?';
  const userTyperesult = await pool.query(userTypeQuery, 'customer');
  const userTypeID = userTyperesult[0][0].USER_TYPE_ID;

  try {
    if (!email || !phone || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const UserExistsQuery = 'SELECT * FROM USERS WHERE EMAIL = ? OR PHONE = ?';
    const [UserExistsResult] = await pool.query(UserExistsQuery, [
      email,
      phone,
    ]);

    if (UserExistsResult.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userInsertQuery =
      'INSERT INTO USERS (EMAIL, PHONE, PASSWORD, USER_TYPE_ID, FIRST_NAME, LAST_NAME) VALUES(?,?,?,?,?,?)';
    await pool.query(userInsertQuery, [
      email,
      phone,
      hashedPassword,
      userTypeID,
      first_name,
      last_name,
    ]);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.customerLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const customerQuery =
      'SELECT * FROM USERS WHERE (EMAIL=? OR PHONE=?) AND USER_TYPE_ID = (SELECT USER_TYPE_ID FROM USER_TYPES WHERE USER_TYPE_NAME = "customer")';
    const [customer] = await pool.query(customerQuery, [username, username]);

    if (
      !customer ||
      customer.length === 0 ||
      !(await bcrypt.compare(password, customer[0].PASSWORD))
    ) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: customer[0].USER_ID, userType: 'customer' },
      secretKey,
      { expiresIn: '24h' }
    );

    return res
      .status(200)
      .json({ message: 'Customer login successful', token });
  } catch (err) {
    console.error('Error logging in as customer:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

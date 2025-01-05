const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

exports.registerAdmin = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const adminExistsQuery =
      'SELECT * FROM ADMIN_USERS WHERE EMAIL = ? OR PHONE = ?';

    const [existingAdmin] = await pool.query(adminExistsQuery, [email, phone]);

    if (existingAdmin.length > 0) {
      return res.status(400).json({ error: 'admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO ADMIN_USERS (EMAIL, PHONE, PASSWORD, FIRST_NAME, LAST_NAME)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [
      email,
      phone,
      hashedPassword,
      firstName,
      lastName,
    ]);

    return res
      .status(201)
      .json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminQuery = 'SELECT * FROM ADMIN_USERS WHERE EMAIL = ? OR PHONE = ?';
    const [admin] = await pool.query(adminQuery, [username, username]);
    const passwordMatch = await bcrypt.compare(password, admin[0].PASSWORD);

    if (!admin || admin.length == 0 || !passwordMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokenPayload = {
      adminId: admin[0].ADMIN_ID,
      email: admin[0].EMAIL,
      firstName: admin[0].FIRST_NAME,
      lastName: admin[0].LAST_NAME,
    };

    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '24h' });

    return res.status(200).json({ token });
  } catch (err) {
    console.error('error authenticating admin', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPendingDrivers = async (req, res) => {
  try {
    const pendingDriversQuery = `
      SELECT u.*, dd.* 
      FROM USERS u 
      JOIN DRIVER_DETAILS dd ON u.USER_ID=dd.USER_ID 
      WHERE dd.DRIVER_STATUS = 'Pending'
    `;
    const [pendingDrivers] = await pool.query(pendingDriversQuery);

    return res.status(200).json({ pendingDrivers });
  } catch (error) {
    console.error('Error fetching pending drivers:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.approveDriver = async (req, res) => {
  try {
    const adminId = req.adminId;
    const driverId = req.params.driverId;

    const approveDriverQuery = `
      UPDATE DRIVER_DETAILS 
      SET DRIVER_STATUS = 'Approved', APPROVED_BY_ADMIN_ID = ?
      WHERE USER_ID = ? AND DRIVER_STATUS = 'Pending'
    `;
    const [updateResult] = await pool.query(approveDriverQuery, [
      adminId,
      driverId,
    ]);

    if (updateResult.affectedRows > 0) {
      res
        .status(200)
        .json({ message: 'Driver application approved successfully' });
    } else {
      res
        .status(404)
        .json({ error: 'Driver application not found or already approved' });
    }
  } catch (error) {
    console.error('Error approving driver application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

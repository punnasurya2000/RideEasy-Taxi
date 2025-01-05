const pool = require('../../config/db');

exports.getDriverInfo = async (req, res) => {
  const userId = req.user.userId;
  const userType = req.user.userType;

  try {
    if (userType !== 'driver') {
      return res.status(404).json({ message: 'Driver data not found' });
    }
    const userTypeQuery =
      'SELECT USER_TYPE_ID FROM USER_TYPES WHERE USER_TYPE_NAME = ?';
    const [userTypeResult] = await pool.query(userTypeQuery, [userType]);
    const userTypeId = userTypeResult[0].USER_TYPE_ID;
    const driverQuery =
      'SELECT * FROM USERS WHERE USER_ID = ? AND USER_TYPE_ID=?';
    const [driverData] = await pool.query(driverQuery, [userId, userTypeId]);

    if (!driverData || driverData.length === 0) {
      return res.status(404).json({ message: 'Driver data not found' });
    }

    return res.status(200).json({ driverData });
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.saveOrUpdateDriverDetails = async (req, res) => {
  const {
    first_name,
    last_name,
    street_address,
    city,
    state,
    zip_code,
    county,
    country,
    vehicle_no,
    license_no,
    license_expiration,
  } = req.body;

  const { userId } = req.user; // Extracting userId from authenticated user

  try {
    // Check if driver details exist
    const existingDetailsQuery =
      'SELECT * FROM DRIVER_DETAILS WHERE USER_ID = ?';
    const [existingDetails] = await pool.query(existingDetailsQuery, [userId]);

    let updateStatus = false;

    // Check if any details have actually been updated
    if (existingDetails.length > 0) {
      const {
        STREET_ADDRESS: oldStreetAddress,
        CITY: oldCity,
        STATE: oldState,
        ZIP_CODE: oldZipCode,
        COUNTY: oldCounty,
        COUNTRY: oldCountry,
        VEHICLE_NO: oldVehicleNo,
        LICENSE_NO: oldLicenseNo,
      } = existingDetails[0];

      if (
        street_address !== oldStreetAddress ||
        city !== oldCity ||
        state !== oldState ||
        zip_code !== oldZipCode ||
        county !== oldCounty ||
        country !== oldCountry ||
        vehicle_no !== oldVehicleNo ||
        license_no !== oldLicenseNo
      ) {
        updateStatus = true;
      }
    } else {
      // If details don't exist, set updateStatus to true
      updateStatus = true;
    }

    if (!updateStatus) {
      // If no updates detected, set driver status to 'Available' and return success message
      const updateAvailabilityQuery =
        'UPDATE DRIVER_AVAILABILITY SET AVAIL_STATUS = ? WHERE USER_ID = ?';
      await pool.query(updateAvailabilityQuery, ['Available', userId]);

      return res.status(200).json({ message: 'Driver details unchanged' });
    }

    const updateUserQuery = `
      UPDATE USERS
      SET FIRST_NAME = COALESCE(?, FIRST_NAME), LAST_NAME = COALESCE(?, LAST_NAME)
      WHERE USER_ID = ?
    `;
    await pool.query(updateUserQuery, [
      first_name || null,
      last_name || null,
      userId,
    ]);

    if (existingDetails.length === 0) {
      // If details don't exist, insert new driver details
      const insertQuery = `
        INSERT INTO DRIVER_DETAILS (USER_ID, STREET_ADDRESS, CITY, STATE, ZIP_CODE, COUNTY, COUNTRY, VEHICLE_NO, LICENSE_NO, LICENSE_EXPIRATION, DRIVER_STATUS)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
      `;
      await pool.query(insertQuery, [
        userId,
        street_address,
        city,
        state,
        zip_code,
        county,
        country,
        vehicle_no,
        license_no,
        license_expiration,
      ]);

      return res
        .status(201)
        .json({ message: 'Driver details saved successfully' });
    } else {
      // If details exist, update driver details
      const updateQuery = `
        UPDATE DRIVER_DETAILS 
        SET STREET_ADDRESS = ?, CITY = ?, STATE = ?, ZIP_CODE = ?, COUNTY = ?, COUNTRY = ?, VEHICLE_NO = ?, LICENSE_NO = ?, LICENSE_EXPIRATION = ?, DRIVER_STATUS = 'Pending'
        WHERE USER_ID = ?
      `;
      await pool.query(updateQuery, [
        street_address || existingDetails[0].STREET_ADDRESS,
        city || existingDetails[0].CITY,
        state || existingDetails[0].STATE,
        zip_code || existingDetails[0].ZIP_CODE,
        county || existingDetails[0].COUNTY,
        country || existingDetails[0].COUNTRY,
        vehicle_no || existingDetails[0].VEHICLE_NO,
        license_no || existingDetails[0].LICENSE_NO,
        license_expiration || existingDetails[0].LICENSE_EXPIRATION,
        userId,
      ]);

      return res
        .status(200)
        .json({ message: 'Driver details updated successfully' });
    }
  } catch (error) {
    console.error('Error saving or updating driver details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// exports.saveOrUpdateDriverDetails = async (req, res) => {
//   const {
//     first_name,
//     last_name,
//     street_address,
//     city,
//     state,
//     zip_code,
//     county,
//     country,
//     vehicle_no,
//     license_no,
//     license_expiration,
//   } = req.body;

//   const { userId } = req.user; // Extracting userId from authenticated user

//   try {
//     const updateUserQuery = `
//       UPDATE USERS
//       SET FIRST_NAME = COALESCE(?, FIRST_NAME), LAST_NAME = COALESCE(?, LAST_NAME)
//       WHERE USER_ID = ?
//     `;
//     await pool.query(updateUserQuery, [
//       first_name || null,
//       last_name || null,
//       userId,
//     ]);
//     // Check if driver details exist
//     const existingDetailsQuery =
//       'SELECT * FROM DRIVER_DETAILS WHERE USER_ID = ?';
//     const [existingDetails] = await pool.query(existingDetailsQuery, [userId]);

//     if (existingDetails.length === 0) {
//       // If details don't exist, insert new driver details
//       const insertQuery = `
//         INSERT INTO DRIVER_DETAILS (USER_ID, STREET_ADDRESS, CITY, STATE, ZIP_CODE, COUNTY, COUNTRY, VEHICLE_NO, LICENSE_NO, LICENSE_EXPIRATION, DRIVER_STATUS)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
//       `;
//       await pool.query(insertQuery, [
//         userId,
//         street_address,
//         city,
//         state,
//         zip_code,
//         county,
//         country,
//         vehicle_no,
//         license_no,
//         license_expiration,
//       ]);

//       return res
//         .status(201)
//         .json({ message: 'Driver details saved successfully' });
//     } else {
//       // If details exist, update driver details
//       const updateQuery = `
//         UPDATE DRIVER_DETAILS
//         SET STREET_ADDRESS = ?, CITY = ?, STATE = ?, ZIP_CODE = ?, COUNTY = ?, COUNTRY = ?, VEHICLE_NO = ?, LICENSE_NO = ?, LICENSE_EXPIRATION = ?, DRIVER_STATUS = 'Pending'
//         WHERE USER_ID = ?
//       `;
//       await pool.query(updateQuery, [
//         street_address || existingDetails[0].STREET_ADDRESS,
//         city || existingDetails[0].CITY,
//         state || existingDetails[0].STATE,
//         zip_code || existingDetails[0].ZIP_CODE,
//         county || existingDetails[0].COUNTY,
//         country || existingDetails[0].COUNTRY,
//         vehicle_no || existingDetails[0].VEHICLE_NO,
//         license_no || existingDetails[0].LICENSE_NO,
//         license_expiration || existingDetails[0].LICENSE_EXPIRATION,
//         userId,
//       ]);

//       return res
//         .status(200)
//         .json({ message: 'Driver details updated successfully' });
//     }
//   } catch (error) {
//     console.error('Error saving or updating driver details:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.saveDriverDetails = async (req, res) => {
//   const {
//     street_address,
//     city,
//     state,
//     zip_code,
//     county,
//     country,
//     vehicle_no,
//     license_no,
//     license_expiration,
//   } = req.body;

//   const { userId } = req.user;
//   try {
//     // Check if driver details already exist
//     const existingDetailsQuery =
//       'SELECT * FROM DRIVER_DETAILS WHERE USER_ID = ?';
//     const [existingDetails] = await pool.query(existingDetailsQuery, [userId]);

//     if (existingDetails.length > 0) {
//       // If details already exist, return error
//       return res.status(400).json({ message: 'Driver details already exist' });
//     }

//     // Insert new driver details
//     const insertQuery = `
//       INSERT INTO DRIVER_DETAILS (USER_ID, STREET_ADDRESS, CITY, STATE, ZIP_CODE, COUNTY, COUNTRY, VEHICLE_NO, LICENSE_NO,LICENSE_EXPIRATION, DRIVER_STATUS)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
//     `;
//     await pool.query(insertQuery, [
//       userId,
//       street_address,
//       city,
//       state,
//       zip_code,
//       county,
//       country,
//       vehicle_no,
//       license_no,
//       license_expiration,
//     ]);

//     res.status(201).json({ message: 'Driver details saved successfully' });
//   } catch (err) {
//     console.error('error saving driver details', err);
//     return res.status(400).json({ error: 'Internal server error' });
//   }
// };

// exports.updateDriverDetails = async (req, res) => {
//   const {
//     street_address,
//     city,
//     state,
//     zip_code,
//     county,
//     country,
//     vehicle_no,
//     license_no,
//     license_expiration,
//   } = req.body;

//   const { userId } = req.user; // Extracting userId from authenticated user

//   try {
//     // Check if driver details exist
//     const existingDetailsQuery =
//       'SELECT * FROM DRIVER_DETAILS WHERE USER_ID = ?';
//     const [existingDetails] = await pool.query(existingDetailsQuery, [userId]);

//     if (existingDetails.length === 0) {
//       // If details don't exist, return error
//       return res.status(404).json({ message: 'Driver details not found' });
//     }

//     // Update driver details
//     const updateQuery = `
//       UPDATE DRIVER_DETAILS
//       SET STREET_ADDRESS = ?, CITY = ?, STATE = ?, ZIP_CODE = ?, COUNTY = ?, COUNTRY = ?, VEHICLE_NO = ?, LICENSE_NO = ?, LICENSE_EXPIRATION = ?, DRIVER_STATUS = 'Pending'
//       WHERE USER_ID = ?
//     `;
//     await pool.query(updateQuery, [
//       street_address || existingDetails[0].STREET_ADDRESS,
//       city || existingDetails[0].CITY,
//       state || existingDetails[0].STATE,
//       zip_code || existingDetails[0].ZIP_CODE, // Corrected to zip_code
//       county || existingDetails[0].COUNTY, // Added county
//       country || existingDetails[0].COUNTRY,
//       vehicle_no || existingDetails[0].VEHICLE_NO,
//       license_no || existingDetails[0].LICENSE_NO,
//       license_expiration || existingDetails[0].LICENSE_EXPIRATION,
//       userId,
//     ]);

//     return res
//       .status(200)
//       .json({ message: 'Driver details updated successfully' });
//   } catch (error) {
//     console.error('Error updating driver details:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.updateDriverDetails = async (req, res) => {
//   const {
//     street_address,
//     city,
//     state,
//     postal_code,
//     country,
//     vehicle_no,
//     license_no,
//     license_expiration,
//   } = req.body;

//   const { userId } = req.user; // Extracting userId from authenticated user

//   try {
//     // Check if driver details exist
//     const existingDetailsQuery =
//       'SELECT * FROM DRIVER_DETAILS WHERE USER_ID = ?';
//     const [existingDetails] = await pool.query(existingDetailsQuery, [userId]);

//     if (existingDetails.length === 0) {
//       // If details don't exist, return error
//       return res.status(404).json({ message: 'Driver details not found' });
//     }

//     // Update driver details
//     const updateQuery = `
//       UPDATE DRIVER_DETAILS
//       SET STREET_ADDRESS = ?, CITY = ?, STATE = ?, ZIP_CODE = ?, COUNTRY = ?, VEHICLE_NO = ?, LICENSE_NO = ?, LICENSE_EXPIRATION = ?, DRIVER_STATUS = 'Pending'
//       WHERE USER_ID = ?
//     `;
//     await pool.query(updateQuery, [
//       street_address || existingDetails[0].STREET_ADDRESS,
//       city || existingDetails[0].CITY,
//       state || existingDetails[0].STATE,
//       postal_code || existingDetails[0].ZIP_CODE,
//       country || existingDetails[0].COUNTRY,
//       vehicle_no || existingDetails[0].VEHICLE_NO,
//       license_no || existingDetails[0].LICENSE_NO,
//       license_expiration || existingDetails[0].LICENSE_EXPIRATION,
//       userId,
//     ]);

//     return res
//       .status(200)
//       .json({ message: 'Driver details updated successfully' });
//   } catch (error) {
//     console.error('Error updating driver details:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.getDriverDetails = async (req, res) => {
  const userId = req.user.userId; // Assuming the driver ID is attached to the request object by the authentication middleware

  try {
    const driverDetailsQuery = `
      SELECT U.*, DD.*
      FROM USERS U
      LEFT JOIN DRIVER_DETAILS DD ON U.USER_ID = DD.USER_ID
      WHERE U.USER_ID = ?
    `;
    const [driverData] = await pool.query(driverDetailsQuery, [userId]);

    if (!driverData || driverData.length === 0) {
      return res.status(404).json({ message: 'Driver data not found' });
    }

    const [driverInfo] = driverData;

    return res.status(200).json({ driverInfo });
  } catch (error) {
    console.error('Error fetching driver details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// exports.getDriverDetails = async (req, res) => {
//   const userId = req.user.userId; // Assuming the driver ID is attached to the request object by the authentication middleware

//   try {
//     const driverDetailsQuery = `
//       SELECT U.*, DD.*
//       FROM USERS U
//       JOIN DRIVER_DETAILS DD ON U.USER_ID = DD.USER_ID
//       WHERE U.USER_ID = ?
//     `;
//     const [driverData] = await pool.query(driverDetailsQuery, [userId]);

//     if (!driverData || driverData.length === 0) {
//       return res.status(404).json({ message: 'Driver data not found' });
//     }

//     const [driverInfo] = driverData;

//     return res.status(200).json({ driverInfo });
//   } catch (error) {
//     console.error('Error fetching driver details:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

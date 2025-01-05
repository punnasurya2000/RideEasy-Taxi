const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Nani1122',
  database: 'TAXI_MANAGEMENT',
};

const pool = mysql.createPool(dbConfig);

// Using async/await syntax
(async () => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    console.log('Connected to database successfully');
    // Release the connection
    connection.release();
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
})();

module.exports = pool;

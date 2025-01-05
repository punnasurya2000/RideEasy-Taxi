require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const pool = require('./config/db');
const cors = require('cors');

app.use(cors());

app.use('/api/customer', require('./routes/mainroutes/customer'));
app.use('/api/driver', require('./routes/mainroutes/driver'));
app.use('/api/admin', require('./routes/mainroutes/admin'));

app.use('/api/rides', require('./routes/rides/rideRequest'));
app.use('/api/rides', require('./routes/driver/driverAvailability'));

app.use('/api/driver/currentride', require('./routes/driver/completeRide'));
app.use(
  '/api/customer/currentride',
  require('./routes/customer/currentRideProgress')
);

app.use('/api/rides', require('./routes/customerdriver/completedRides'));
app.use(
  '/api/rides',
  require('./routes/rides/ratingandsupport/ratingandsupport')
);

app.use('/api/card', require('./routes/payments/customer_card_details'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

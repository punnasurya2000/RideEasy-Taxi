import { useState } from 'react';
import MapWithSearch from '../MapWithSearch'; // Import the MapWithSearch component
import Loader from '../common_components/Loader';
import RideRequest from './RideRequest';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserHomePage = () => {
  const [rideSearchDetails, setRideSearchDetails] = useState({
    pickup: { value: '', isError: false },
    dropoff: { value: '', isError: false },
  });
  const [distance, setDistance] = useState({ value: '', isError: false });
  const [fare, setFare] = useState(0);
  const [loader, setLoader] = useState(0);
  const [rideRequest, setRideRequest] = useState(false);

  const navigate = useNavigate();

  const handleChange = (key, event) => {
    setRideSearchDetails((prev) => ({
      ...prev,
      [key]: {
        value: event.target.value,
        isError: false,
      },
    }));
  };

  // Event handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    const requestData = {
      sourceLocation: rideSearchDetails.pickup.value,
      destLocation: rideSearchDetails.dropoff.value,
      fare: fare,
      distance: distance,
    };

    // Make API call to send user data for login
    const token = localStorage.getItem('token');
    axios
      .post('http://localhost:5001/api/rides/ride-request', requestData, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log('ride requesting successful---', res);
        setRideRequest(true);
        setLoader(true);
      })
      .catch((err) => {
        console.log('err making ride request---', err);
        setLoader(false);
      });
    console.log('Submitting form data:', rideSearchDetails);

    // // Reset form fields after submission
    // setRideSearchDetails({
    //   pickup: { value: '', isError: false },
    //   dropoff: { value: '', isError: false },
    // });
  };

  const handleCheck = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5001/api/card/',{
      headers: {
        Authorization: token,
      },
    }).then(res=>{
      console.log('user has card details---', res);
      handleSubmit(event);
    }).catch(err=>{
      navigate('/user/payment');
      console.log('err---', err);
    })
  }

  

  const handleDistanceCalculated = (distance) => {
    const numericalDistance = parseFloat(
      distance.replace(/,/g, '').match(/\d+(\.\d+)?/)[0]
    );
    if (!isNaN(numericalDistance)) {
      setDistance(numericalDistance);

      if (numericalDistance < 20) {
        const randomFare = (Math.random() * 0.5 + 1) * numericalDistance;
        setFare(randomFare.toFixed(2));
      } else if (numericalDistance >= 20 && numericalDistance < 50) {
        const randomFare = (Math.random() * 0.2 + 1) * numericalDistance;
        setFare(randomFare.toFixed(2));
      } else if (numericalDistance >= 50 && numericalDistance < 100) {
        const randomFare = (Math.random() * 0.1 + 1) * numericalDistance;
        setFare(randomFare.toFixed(2));
      } else {
        setFare(numericalDistance.toFixed(2));
      }
    } else {
      console.error('Invalid distance format:', distance);
    }
  };

  const handleRideLoader = (seeRideRequest) => {
    console.log(seeRideRequest);
    setLoader(seeRideRequest);
    setRideRequest(seeRideRequest);
  };

  const handleLoader = () => {
    if (loader) {
      return (
        <div>
          <span className='fs-3'>Finding your ride... {'   '}</span>
          <Loader />
        </div>
      );
    }
    return 'See Rides';
  };

  return (
    <div
      className='container mt-5'
      style={{ minHeight: '87vh', overflowY: 'auto' }}
    >
      <div className='row justify-content-between'>
        <div className='col-md-5 h-65vh d-flex flex-column  align-items-center justify-content-center'>
          <div className='card rounded-5 p-5 w-100 '>
            <div className='card-body'>
              <h2 className='card-title fs-1 text-center mb-5'>
                Book a ride with Us
              </h2>
              <form className=''>
                <div className='mb-3'>
                  <label htmlFor='pickup' className='form-label fs-3'>
                    Pickup Location
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-lg fs-3'
                    id='pickup'
                    placeholder='Enter pickup location'
                    onChange={(event) => {
                      handleChange('pickup', event);
                    }}
                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor='dropoff' className='form-label fs-3'>
                    Drop-off Location
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-lg fs-3'
                    id='dropoff'
                    placeholder='Enter drop-off location'
                    onChange={(event) => {
                      handleChange('dropoff', event);
                    }}
                  />
                </div>
                <div className='d-grid mt-5'>
                  <button
                    type='submit'
                    className='btn btn-dark btn-lg cus-lg-button fs-3'
                    onClick={handleCheck}
                  >
                    {handleLoader()}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className='col-md-6 text-center fs-1'>
          {/* Integrate MapWithSearch component here */}
          <MapWithSearch
            pickup={rideSearchDetails.pickup.value}
            dropoff={rideSearchDetails.dropoff.value}
            onDistanceCalculated={handleDistanceCalculated}
          />
        </div>
      </div>
      {rideRequest && <RideRequest onRideLoader={handleRideLoader} />}
    </div>
  );
};

export default UserHomePage;

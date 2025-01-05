import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const RideRequest = ({ onRideLoader }) => {
  const [rideDetails, setRideDetails] = useState({
    pickup: { value: '', isError: false },
    dropoff: { value: '', isError: false },
    fare: { value: '', isError: false },
    distance: { value: '', isError: false },
    requestStatus: { value: '', isError: false },
    requestId: { value: '', isError: false },
  });
  const [seeRideRequest, setSeeRideRequest] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/rides/ride-request', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const {
          DEST_LOCATION,
          DISTANCE,
          FARE,
          REQUEST_ID,
          REQUEST_STATUS,
          SOURCE_LOCATION,
        } = res?.data?.rideRequests?.[0];

        const data = {
          pickup: { value: SOURCE_LOCATION, isError: false },
          dropoff: { value: DEST_LOCATION, isError: false },
          fare: { value: FARE, isError: false },
          distance: { value: DISTANCE, isError: false },
          requestStatus: { value: REQUEST_STATUS, isError: false },
          requestId: { value: REQUEST_ID, isError: false },
        };
        setRideDetails({ ...data });
        setSeeRideRequest(true);
      })
      .catch((err) => {
        console.error('Error fetching ride request', err);
        setSeeRideRequest(false);
      });
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Perform API call
        console.log('in use effect---')
        const response = await axios.get('http://localhost:5001/api/customer/currentride/',{
          headers: {
            Authorization: token,
          },
        });
        // Handle response data
        console.log('ride accepted',response.data);
        navigate('/user/current-ride');

      } catch (error) {
        // Handle error
        console.error('Error fetching data:', error);
      }
    };

    // Call fetchData immediately when component mounts
    fetchData();

    // Set interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup function to clear interval when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  });

  const handleCancelRide = () => {
    const requestId = rideDetails.requestId.value;
    axios
      .delete(`http://localhost:5001/api/rides/cancel/${requestId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setSeeRideRequest(false);
        console.log(res);
        onRideLoader(false);
      })
      .catch((err) => {
        console.error('Error cancelling ride request', err);
      });
  };

  return (
    <div className='my-4'>
      {seeRideRequest && (
        <div
          className='d-flex flex-column rounded-4'
          style={{
            minHeight: '20vh',
            boxShadow: '1px 0px 5px #aaa',
          }}
        >
          <h3 className='m-5 mt-4 mb-1'>Ride requesting is successful</h3>
          <div className='m-5 row justify-content-between'>
            <div className='col'>
              <div className='mb-3'>
                <h5 className='fs-4'>Pickup Location:</h5>
                <p className='fs-4'>{rideDetails?.pickup?.value}</p>
              </div>
            </div>
            <div className='col'>
              <div className='mb-3'>
                <h5 className='fs-4'>Distance:</h5>
                <p className='fs-4'>{rideDetails?.distance?.value} miles</p>
              </div>
            </div>
            <div className='col'>
              <div className='mb-3'>
                <h5 className='fs-4'>Drop-Off Location:</h5>
                <p className='fs-4'>{rideDetails?.dropoff?.value}</p>
              </div>
            </div>
            <div className='col'>
              <div className='mb-3'>
                <h5 className='fs-4'>Fare:</h5>
                <p className='fs-4'>{rideDetails?.fare?.value}</p>
              </div>
            </div>
            <div className='col-auto'>
              <button
                className='btn btn-danger fs-5'
                onClick={handleCancelRide}
              >
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideRequest;

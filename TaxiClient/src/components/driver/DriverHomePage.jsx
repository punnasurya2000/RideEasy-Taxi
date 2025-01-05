import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DriverHomePage = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const [isChecked, setChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5001/api/rides/ride-requests', {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          console.log('res----', res?.data?.pendingRequests);
          const rideRequests = res?.data?.pendingRequests || [];
          setRideRequests([...rideRequests]);
        })
        .catch((err) => {
          console.log('err---', err);
          setErrorMessage(err?.response?.data?.error);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        });

      axios
        .get('http://localhost:5001/api/rides/driver/availability', {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          const finalState =
            res?.data?.availability === 'Available' ? true : false;
          setChecked(finalState);
        })
        .catch((err) => {
          console.log('err---', err);
          setErrorMessage(err?.response?.data?.error);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        });
    }
  }, [isChecked]);

  const handleToggle = () => {
    const token = localStorage.getItem('token');
    const availability = !isChecked ? 'Available' : 'Not Available';
    const data = {
      availability: availability,
      availLocation: '8181',
    };
    axios
      .put('http://localhost:5001/api/rides/driver/availability', data, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log('res----', res);
        setChecked((prev) => !prev);
        setRideRequests([]);
      })
      .catch((err) => {
        console.log('err----', err);
        setErrorMessage(err?.response?.data?.error);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  const handleAccept = (rideDetails) => {
    const token = localStorage.getItem('token');
    axios
      .put(
        `http://localhost:5001/api/rides//ride-request/${rideDetails?.REQUEST_ID}/accept`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log('res----', res);
        // sessionStorage.setItem('rideDetails', JSON.stringify(rideDetails));
        navigate('/driver/current-ride');
      })
      .catch((err) => {
        console.log('err while accepting ride', err);
        setErrorMessage(err?.response?.data?.error);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  const toolTip = isChecked ? 'Available' : 'Not Available';
  console.log('ss', isChecked);

  return (
    <div className='container my-5'>
      {errorMessage && (
        <div
          className='alert alert-danger position-fixed top-0 end-0 fs-3 rounded-3 mt-6 me-3 h-5'
          role='alert'
        >
          {errorMessage}
        </div>
      )}
      <h1 className='text-center fs-1 mb-4'>Ride Requests</h1>
      <div className='form-check form-switch d-flex flex-column w-100 justify-content-end align-items-end h-5'>
        <input
          className='form-check-input fs-2  text-center'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          title={toolTip}
          type='checkbox'
          id='flexSwitchCheckDefault'
          checked={isChecked}
          onClick={handleToggle}
        />
        <p className='fs-5 mt-3'>
          Your status is <span className='text-primary'>({toolTip})</span>
        </p>
      </div>
      <div className='row row-cols-1 row-cols-md-1 g-4'>
        {rideRequests.map((request) => (
          <div className='col' key={request.REQUEST_ID}>
            <div className='card h-100 shadow p-4'>
              <div className='card-body'>
                <div className='row mb-3'>
                  <div className='col-md-6 d-flex column align-items-start'>
                    <p className='card-text fw-bold fs-3 mb-0 me-3'>Source:</p>
                    <p className='card-text fs-4 mt-1 text-capitalize'>
                      {request.SOURCE_LOCATION}
                    </p>
                  </div>
                  <div className='col-md-6 d-flex column align-items-start'>
                    <p className='card-text fw-bold fs-3 mb-0 me-3'>
                      Destination:
                    </p>
                    <p className='card-text fs-4 mt-1 text-capitalize'>
                      {request.DEST_LOCATION}
                    </p>
                  </div>
                </div>
                <div className='row mb-3'>
                  <div className='col-md-6 d-flex column align-items-start'>
                    <p className='card-text fw-bold fs-3 mb-0 me-3'>Fare:</p>
                    <p className='card-text fs-4 mt-1'>${request.FARE}</p>
                  </div>
                  <div className='col-md-6 d-flex column align-items-start'>
                    <p className='card-text fw-bold fs-3 mb-0 me-3'>Status:</p>
                    <p className='card-text fs-4 mt-1'>
                      {request.REQUEST_STATUS}
                    </p>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-6 d-flex column align-items-start'>
                    <p className='card-text fw-bold fs-3 mb-0 me-3'>
                      Distance:
                    </p>
                    <p className='card-text fs-4 mt-1'>
                      {request.DISTANCE} miles
                    </p>
                  </div>
                  <div className='col-md-6 d-flex justify-content-end'>
                    {/* <button className="btn btn-outline-dark me-2 fs-4">Cancel</button> */}
                    <button
                      className='btn btn-dark fs-4'
                      onClick={() => handleAccept(request)}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {rideRequests?.length === 0 && (
          <div className='d-flex flex-column justify-content-center align-items-center fs-2 h-50vh'>
            <img src='https://static.vecteezy.com/system/resources/thumbnails/007/872/974/small/file-not-found-illustration-with-confused-people-holding-big-magnifier-search-no-result-data-not-found-concept-can-be-used-for-website-landing-page-animation-etc-vector.jpg' />
            <p>No Current Ride Requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverHomePage;

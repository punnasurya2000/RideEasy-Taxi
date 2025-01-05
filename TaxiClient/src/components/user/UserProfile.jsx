import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardDetails from './CardDetails';
import axios from 'axios';

const UserProfile = () => {
  const navigate = useNavigate();
  // Define state variables for editable fields
  const [updateDetails, setUpdateDetails] = useState({
    firstName: { value: '', isError: false },
    lastName: { value: '', isError: false },
    email: { value: '', isError: false },
    phnNum: { value: '', isError: false },
  });

  const handleChange = (key, event) => {
    setUpdateDetails((prev) => ({
      ...prev,
      [key]: {
        value: event.target.value,
        isError: false,
      },
    }));
  };

  // UpdateUser function
  const handleUpdateProfile = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const { firstName, lastName } = updateDetails;
    const requestData = {
      firstName: firstName.value,
      lastName: lastName.value,
    };
    axios
      .post('http://localhost:5001/api/customer/updateprofile', requestData, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log('Submitting user profile form data:', updateDetails);

    // navigate(`/user/home`);
  };

  const { firstName, lastName, email, phnNum } = updateDetails;

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get(`http://localhost:5001/api/customer/customer-data`, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          const { FIRST_NAME, LAST_NAME, EMAIL, PHONE } =
            res?.data?.customerData?.[0];

          const data = {
            firstName: { value: FIRST_NAME, isError: false },
            lastName: { value: LAST_NAME, isError: false },
            email: { value: EMAIL, isError: false },
            phnNum: { value: PHONE, isError: false },
          };
          setUpdateDetails(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, []);

  return (
    <div className='container my-5'>
      <button
        className='btn btn-dark btn-lg position-absolute top-0 start-0 m-3 fs-4'
        onClick={() => navigate(`/user/home`)}
      >
        <svg
          className='w-2 h-2 text-gray-800 dark:text-white'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='m15 19-7-7 7-7'
          />
        </svg>
        Back
      </button>
      <div className='row justify-content-center align-items-center'>
        <div className='col-md-4 w-35vw'>
          <div className='card rounded-5 p-5'>
            <div className='card-body'>
              <h2 className='card-title fs-2 mb-4 text-center text-capitalize'>
                Update your Profile
              </h2>
              {/* First Name */}
              <div className='mb-3'>
                <label htmlFor='firstName' className='form-label fs-3'>
                  First Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg fs-3'
                  id='firstName'
                  defaultValue={firstName?.value}
                  onChange={(event) => {
                    handleChange('firstName', event);
                  }}
                />
              </div>
              {/* Last Name */}
              <div className='mb-3'>
                <label htmlFor='lastName' className='form-label fs-3'>
                  Last Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg fs-3'
                  id='lastName'
                  defaultValue={lastName?.value}
                  onChange={(event) => {
                    handleChange('lastName', event);
                  }}
                />
              </div>
              {/* Email (readonly) */}
              <div className='mb-3'>
                <label htmlFor='email' className='form-label fs-3'>
                  Email
                </label>
                <input
                  type='email'
                  className='form-control form-control-lg fs-3'
                  id='email'
                  defaultValue={email?.value}
                  readOnly
                />
              </div>
              {/* Phone Number (readonly) */}
              <div className='mb-3'>
                <label htmlFor='phnNum' className='form-label fs-3'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  className='form-control form-control-lg fs-3'
                  id='phnNum'
                  defaultValue={phnNum?.value}
                  readOnly
                />
              </div>
              {/* Password
              <div className='mb-3'>
                <label htmlFor='password' className='form-label fs-3'>
                  Password
                </label>
                <input
                  type='password'
                  className='form-control form-control-lg fs-3'
                  id='password'
                  defaultValue={password?.value}
                  onChange={(event) => {
                    handleChange('password', event);
                  }}
                />
              </div> */}
              {/* Update button */}
              <div className='d-grid mt-5'>
                <button
                  className='cus-lg-button fs-3 btn btn-dark btn-lg w-100'
                  onClick={handleUpdateProfile}
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-8 w-50'>
          <CardDetails />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

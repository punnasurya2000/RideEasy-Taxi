import { useEffect, useState } from 'react';
import AccountsNavbar from '../AccountsNavbar';
import { useNavigate } from 'react-router-dom';
import '../../styles/general.css';
import axios from 'axios';
import RideEasy from '../../assets/RideEasy.jpeg';

const Login = (props) => {
  const [loginDetails, setLoginDetails] = useState({
    username: { value: '', isError: false },
    password: { value: '', isError: false },
  });
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      navigate(`/${user}/home`);
    }
  });

  const navigate = useNavigate();
  const { user } = props;
  // handle change is a common function to update the states of all fields
  const handleChange = (key, event) => {
    setLoginDetails((prev) => ({
      ...prev,
      [key]: {
        value: event.target.value,
        isError: false,
      },
    }));
  };

  // Event handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    let handleRoutes = user;
    if (user !== 'admin') {
      handleRoutes = user === 'driver' ? 'driver' : 'customer';
    }
    const formData = {
      username: loginDetails?.username.value,
      password: loginDetails?.password.value,
    };

    axios
      .post(`http://localhost:5001/api/${handleRoutes}/login`, formData)
      .then((res) => {
        localStorage.setItem('token', res?.data?.token);
        console.log(res?.data?.token);
        // Navigate to the dashboard or desired page after successful login
        navigate(`/${user}/home`);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err?.response?.data?.error);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });

    // Make API call to send user data for login
    // Replace the following code with your API call implementation
    console.log('Submitting form data:', loginDetails);
  };
  return (
    <div>
      <AccountsNavbar /> {/* Including the navbar component */}
      <div className='container mt-10'>
        {errorMessage && (
          <div
            className='alert alert-danger position-fixed top-0 end-0 fs-3 rounded-3 mt-6 me-3 h-5'
            role='alert'
          >
            {errorMessage}
          </div>
        )}
        <div className='row justify-content-center align-items-center'>
          {' '}
          {/* Centering the form vertically */}
          <div className='col-md-5'>
            {' '}
            {/* Adjusting column width */}
            <h1 className='mb-4 fs-1'>Welcome to RideEasy</h1>{' '}
            {/* Adding additional heading */}
            <h2 className='mb-4 fs-2'>Login to your {user} account</h2>{' '}
            {/* Adding additional heading */}
            <form
              className='border rounded-4 p-5'
              onSubmit={handleSubmit}
              id='cus-form-accounts'
            >
              <div className='mb-4'>
                <label htmlFor='username' className='form-label fs-3'>
                  Username
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg fs-3 '
                  id='username'
                  placeholder='Enter email/phone number'
                  onChange={(event) => handleChange('username', event)}
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='password' className='form-label fs-3'>
                  Password
                </label>
                <input
                  type='password'
                  className='form-control form-control-lg fs-3'
                  id='password'
                  placeholder='Enter password'
                  onChange={(event) => handleChange('password', event)}
                  required
                />
              </div>
              <div className='text-center mt-5 pt-3'>
                <button
                  type='submit'
                  className='cus-lg-button btn btn-dark btn-lg w-100 fs-3'
                >
                  Login
                </button>{' '}
                {/* Adjusting button width */}
              </div>
            </form>
            {user !== 'admin' && (
              <div className='mt-3 fs-3'>
                <p>
                  {`Don't have an account?`}{' '}
                  <a href={`/${user}/signup`}>Signup</a>
                </p>{' '}
                {/* Link to the signup page */}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="position-fixed bottom-0 end-0">
        <img src={RideEasy} className="w-30vw h-30 " />
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import AccountsNavbar from '../AccountsNavbar';
import { useNavigate } from 'react-router-dom';
import '../../styles/general.css';
import axios from 'axios';
import RideEasy from '../../assets/RideEasy.jpeg';

const Signup = (props) => {
  const [signupDetails, setSignupDeatils] = useState({
    first_name: { value: '', isError: false },
    last_name: { value: '', isError: false },
    email: { value: '', isError: false },
    phone: { value: '', isError: false },
    password: { value: '', isError: false },
  });
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { user } = props;
  // handle change is a common function to update the states of all fields
  const handleChange = (key, event) => {
    setSignupDeatils((prev) => ({
      ...prev,
      [key]: {
        value: event.target.value,
        isError: false,
      },
    }));
    console.log('handleChange----', setSignupDeatils);
  };
  // Event handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = {
      email: signupDetails.email.value,
      phone: signupDetails.phone.value,
      password: signupDetails.password.value,
      first_name: signupDetails.first_name.value,
      last_name: signupDetails.last_name.value,
    };
    console.log('data-----', signupDetails);
    const handleRoutes = user === 'user' ? 'customer' : 'driver';
    axios
      .post(`http://localhost:5001/api/${handleRoutes}/registration`, formData)
      .then((res) => {
        console.log(res);
        navigate(`/${user}/login`);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err?.response?.data?.error);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
    // Make API call to send user data for signup
    // Replace the following code with your API call implementation
    console.log('Submitting form data:', signupDetails);
  };
  return (
    <div>
      <AccountsNavbar /> {/* Including the navbar component */}
      <div className='container mt-6'>
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
            <h2 className='mb-4 fs-2'>Sign up as {user} to get started</h2>{' '}
            {/* Adding additional heading */}
            <form
              className='border rounded-4 p-5'
              id='cus-form-accounts'
              onSubmit={handleSubmit}
            >
              <div className='mb-4'>
                <label htmlFor='firstname' className='form-label fs-3'>
                  Firstname
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg fs-3 '
                  id='firstname'
                  placeholder='Enter firstname'
                  onChange={(event) => handleChange('first_name', event)}
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='lastname' className='form-label fs-3'>
                  Lastname
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg fs-3 '
                  id='lastname'
                  placeholder='Enter lastname'
                  onChange={(event) => handleChange('last_name', event)}
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='email' className='form-label fs-3'>
                  Email
                </label>
                <input
                  type='email'
                  className='form-control form-control-lg fs-3'
                  id='email'
                  placeholder='Enter email'
                  onChange={(event) => handleChange('email', event)}
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='phnNum' className='form-label fs-3'>
                  Phone Number
                </label>
                <input
                  type='number'
                  className='form-control form-control-lg fs-3'
                  id='phnNum'
                  placeholder='Enter phone number'
                  onChange={(event) => handleChange('phone', event)}
                  max={9999999999}
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
                  className='cus-lg-button fs-3 btn btn-dark btn-lg w-100'
                >
                  Signup
                </button>{' '}
                {/* Adjusting button width */}
              </div>
            </form>
            <div className='mt-3 fs-3'>
              <p>
                Already have an account? <a href={`/${user}/login`}>Login</a>
              </p>{' '}
              {/* Link to the login page */}
            </div>
          </div>
        </div>
      </div>
      <div className='position-fixed bottom-0 end-0'>
        <img
          src={RideEasy}
          className='w-30vw h-30 '
        />
      </div>
    </div>
  );
};

export default Signup;

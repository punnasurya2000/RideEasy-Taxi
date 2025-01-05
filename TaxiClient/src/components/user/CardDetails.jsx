import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CardDetails = () => {
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({
    name: { value: '', isError: false },
    cardNumber: { value: '', isError: false },
    expiryDate: { value: '', isError: false },
    cvv: { value: '', isError: false },
    zipCode: { value: '', isError: false },
    country: { value: '', isError: false },
  });

  const handleChange = (key, event) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [key]: {
        value: event.target.value,
        isError: false,
      },
    }));
  };

  const handleEdit = () => {
    // Redirect to the profile page for editing
    // console.log('----data', paymentDetails);
    console.log(paymentDetails);
    const { name, cardNumber, expiryDate, cvv, zipCode, country } = paymentDetails;
    const requestData = {
      fullName: name.value,
      cardNumber: cardNumber.value,
      cardExpiry: expiryDate.value,
      cvv: cvv.value,
      zipCode: zipCode.value,
      country: country.value
    };

    const token = localStorage.getItem('token');
    axios.post('http://localhost:5001/api/card/update', requestData, {
      headers: {
        Authorization: token,
      },
    }).then(res=>{
      console.log('card details added--', res);
      navigate('/user/home');
    }).catch(err=>{
      console.log('err while adding card---', err);
    });
    // navigate('/user/profile');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5001/api/card/', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const { CARD_NUMBER, CVV, CARD_EXPIRY, FULL_NAME, ZIP_CODE, COUNTRY } =
          res?.data?.cardDetails?.[0];
        const data = {
          name: { value: FULL_NAME, isError: false },
          cardNumber: { value: CARD_NUMBER, isError: false },
          expiryDate: {
            value: new Date(CARD_EXPIRY).toISOString().split('T')[0],
            isError: false,
          },
          cvv: { value: CVV, isError: false },
          zipCode: { value: ZIP_CODE, isError: false },
          country: { value: COUNTRY, isError: false },
        };
        setPaymentDetails({ ...data });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const { name, expiryDate, cardNumber, cvv , zipCode, country} = paymentDetails;

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <h5 className='card-title text-center fs-1 mb-5'>Card Details</h5>
        <div className='col-md-6 w-75'>
          <div className='card p-4 rounded-4'>
            <form className='w-100'>
              <div className='mb-3'>
                <label htmlFor='cardHolderName' className='form-label fs-3'>
                  Card Holder Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg fs-3'
                  id='cardHolderName'
                  defaultValue={name?.value}
                  onChange={(event) => {
                    handleChange('name', event);
                  }}
                />
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='cardNumber'
                  className='form-label fs-3 text-start'
                >
                  Card Number
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg fs-3'
                  id='cardNumber'
                  defaultValue={cardNumber?.value}
                  onChange={(event) => {
                    handleChange('cardNumber', event);
                  }}
                />
              </div>
              <div className='row mb-3'>
                <div className='col'>
                  <label htmlFor='expiryDate' className='form-label fs-3'>
                    Expiry Date
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-lg fs-3'
                    id='expiryDate'
                    defaultValue={expiryDate?.value}
                    onChange={(event) => {
                      handleChange('expiryDate', event);
                    }}
                  />
                </div>
                <div className='col'>
                  <label htmlFor='cvv' className='form-label fs-3'>
                    CVV
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-lg fs-3'
                    id='cvv'
                    defaultValue={cvv?.value}
                    onChange={(event) => {
                      handleChange('cvv', event);
                    }}
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col'>
                  <label htmlFor='zipCode' className='form-label fs-3'>
                    Zip Code
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-lg fs-3'
                    id='zipCode'
                    defaultValue={zipCode?.value}
                    onChange={(event) => {
                      handleChange('zipCode', event);
                    }}
                  />
                </div>
                <div className='col'>
                  <label htmlFor='country' className='form-label fs-3'>
                    Country
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-lg fs-3'
                    id='country'
                    defaultValue={country?.value}
                    onChange={(event) => {
                      handleChange('country', event);
                    }}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className='text-end mt-4'>
            {/* <button
              type='button'
              className='btn btn-dark btn-lg w-25 fs-4'
              onClick={handleEdit}
            >
              Delete Card
            </button>
            <button
              type='button'
              className='btn btn-dark btn-lg w-25 fs-4'
              onClick={handleEdit}
            >
              Update Card
            </button> */}
            <button
              type='button'
              className='btn btn-dark btn-lg w-25 fs-4'
              onClick={handleEdit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;

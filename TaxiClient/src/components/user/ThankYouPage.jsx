import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
    const navigate = useNavigate();
    return (<div className='text-center h-50vh d-flex flex-column justify-content-center align-items-center'><div className="fs-1" >Thank You for choosing RideEasy!!</div>
        <div className="fs-3 mt-5">{'Your ride completed...Have a Nice Day :)'}</div>
        <button
              type='button'
              className='btn btn-dark btn-lg w-10 fs-4 mt-5'
              onClick={()=>{navigate('/user/home')}}
            >
              Home
            </button>
    </div>);
}

export default ThankYouPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const DriverDetails = () => {
    const navigate = useNavigate();
    // Define state variables for editable fields
    const [updateDetails, setUpdateDeatils] = useState({
        firstName: { value: '', isError: false },
        lastName: { value: '', isError: false },
        email: { value: '', isError: false },
        phnNum: { value: '', isError: false },
        vehicleNum: { value: '', isError: false },
        licenseNum: { value: '', isError: false },
        city: { value: '', isError: false },
        country: { value: '', isError: false },
        county: { value: '', isError: false },
        state: { value: '', isError: false },
        streetAddress: { value: '', isError: false },
        zipCode: { value: '', isError: false },
    });
    const [isAproved, setIsAproved] = useState(false);

    useEffect(() => {
        const driverDetails = JSON.parse(sessionStorage.getItem('driverDetails'));
        const { FIRST_NAME, LAST_NAME, VEHICLE_NO, LICENSE_NO, EMAIL, PHONE, DRIVER_STATUS,  CITY, COUNTRY, COUNTY, STATE, STREET_ADDRESS, ZIP_CODE } = driverDetails;
        const data = {
            firstName: { value: FIRST_NAME, isError: false },
            lastName: { value: LAST_NAME, isError: false },
            email: { value: EMAIL, isError: false },
            phnNum: { value: PHONE, isError: false },
            vehicleNum: { value: VEHICLE_NO, isError: false },
            licenseNum: { value: LICENSE_NO, isError: false },
            city: { value: CITY || '', isError: false },
            country: { value: COUNTRY || '', isError: false },
            county: { value: COUNTY || '', isError: false },
            state: { value: STATE || '', isError: false },
            streetAddress: { value: STREET_ADDRESS || '', isError: false },
            zipCode: { value: ZIP_CODE || '', isError: false },
        }
        const status = DRIVER_STATUS !== 'Pending' ? true : false;
        setIsAproved(status);
        setUpdateDeatils({ ...data });
        console.log('driver details-----dgsh', driverDetails)
    }, [])


    // Update profile function
    const handleApprove = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const driverDetails = JSON.parse(sessionStorage.getItem('driverDetails'));
        const token = localStorage.getItem('token');
        const { USER_ID } = driverDetails;
        // Make API call to send user data for signup
        // Replace the following code with your API call implementation
        console.log("Submitting form data:", updateDetails);
        axios.put(`http://localhost:5001/api/admin/approve-driver/${USER_ID}`, {}, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(res => {
                console.log('success---', res);
                navigate('/admin/home');
            })
            .catch(err => {
                console.log('err----', err);
            });

    };

    const handleReject = () => {
        console.log('rejected');
        navigate('/admin/home');
    }

    const { firstName, lastName, email, phnNum, vehicleNum, licenseNum, city, country, county, state, streetAddress, zipCode } = updateDetails;
    const disable = isAproved ? 'disabled' : '';
    return (
        <div className="container my-5">
            <button className="btn btn-dark btn-lg position-absolute top-0 start-0 m-3 fs-4" onClick={() => navigate('/admin/home')}>
                <svg class="w-2 h-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
                </svg>
                Back
            </button>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card rounded-5 p-5">
                        <div className="card-body">
                            <h2 className="card-title fs-2 mb-4 text-center text-capitalize">Driver Onboarding Details</h2>
                            {/* First Name */}
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label fs-3">First Name</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="form-control form-control-lg fs-3"
                                    id="firstName"
                                    defaultValue={firstName?.value}
                                />
                            </div>
                            {/* Last Name */}
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label fs-3">Last Name</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="form-control form-control-lg fs-3"
                                    id="lastName"
                                    defaultValue={lastName?.value}
                                />
                            </div>
                             {/* Email (readonly) */}
                             <div className="mb-3">
                                <label htmlFor="email" className="form-label fs-3">Email</label>
                                <input
                                    readOnly
                                    type="email"
                                    className="form-control form-control-lg fs-3"
                                    id="email"
                                    defaultValue={email?.value}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="streetAddress" className="form-label fs-3">Street Address</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg fs-3"
                                    id="streetAddress"
                                    defaultValue={streetAddress?.value}
                                    readOnly
                                />
                            </div>
                            <div className="mb-3 row">
                                <div className="col-md-6">
                                    <label htmlFor="vehicleNum" className="form-label fs-3">Vehicle Number</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-3"
                                        id="vehicleNum"
                                        defaultValue={vehicleNum?.value}
                                        readOnly                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="licenseNum" className="form-label fs-3">License Number</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-3"
                                        id="licenseNum"
                                        defaultValue={licenseNum?.value}
                                        readOnly                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <div className="col-md-6">
                                    <label htmlFor="city" className="form-label fs-3">City</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-3"
                                        id="city"
                                        defaultValue={city?.value}
                                        readOnly                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="county" className="form-label fs-3">County</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-3"
                                        id="county"
                                        defaultValue={county?.value}
                                        readOnly                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <div className="col-md-6">
                                    <label htmlFor="country" className="form-label fs-3">Country</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-3"
                                        id="country"
                                        defaultValue={country?.value}
                                        readOnly                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="state" className="form-label fs-3">State</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-3"
                                        id="state"
                                        defaultValue={state?.value}
                                        readOnly                                    />
                                </div>
                            </div>
                            {/* Phone Number (readonly) */}
                            <div className="mb-3 row">
                                <div className="col-md-6">
                                    <label htmlFor="phnNum" className="form-label fs-3">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control form-control-lg fs-3"
                                        id="phnNum"
                                        defaultValue={phnNum?.value}
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="zipCode" className="form-label fs-3">Zip Code</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-3"
                                        id="zipCode"
                                        defaultValue={zipCode?.value}
                                        readOnly                                    />
                                </div>
                            </div>
                            {/* Update button */}
                            <div className="d-grid mt-5 d-flex flex-row justify-content-end">
                                <button className={`fs-4 btn btn-dark btn-lg w-40 me-4 ${isAproved}?'disabled': ''`} onClick={handleApprove}>
                                    Approve
                                </button>
                                <button className={`fs-4 btn btn-dark btn-lg w-40 ${isAproved}?'disabled': ''`} onClick={handleReject}>
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DriverDetails;

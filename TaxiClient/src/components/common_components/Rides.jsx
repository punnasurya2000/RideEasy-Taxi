import React, { useEffect, useState } from "react";
import axios from 'axios';

const Rides = (props) => {
    const { user } = props;
    const [completedRides, setCompletedRides] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const url = user === 'driver' ? 'http://localhost:5001/api/rides/driver-rides' : 'http://localhost:5001/api/rides/customer-rides';
        axios.get(url, {
            headers: {
                Authorization: token,
            }
        }).then(res => {
            console.log('res----', res);
            const ridesData = res?.data?.driverRides || res?.data?.rides || []
            setCompletedRides([...ridesData])

        }).catch(err => {
            console.log('err----', err);
        })
    }, [])

    return (
        <div className="container my-5">
            {errorMessage && (
                <div className="alert alert-danger position-fixed top-0 end-0" role="alert">
                    {errorMessage}
                </div>
            )}
            <h1 className="text-center fs-1 mb-4">Your Rides</h1>
            <div className="row row-cols-1 row-cols-md-1 g-4">
                {completedRides?.map((request) => (
                    <div className="col" key={request.REQUEST_ID}>
                        <div className="card h-100 shadow p-4">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-md-6 d-flex column align-items-start">
                                        <p className="card-text fw-bold fs-3 mb-0 me-3">Source:</p>
                                        <p className="card-text fs-4 mt-1 text-capitalize">{request.SOURCE_LOCATION}</p>
                                    </div>
                                    <div className="col-md-6 d-flex column align-items-start">
                                        <p className="card-text fw-bold fs-3 mb-0 me-3">Destination:</p>
                                        <p className="card-text fs-4 mt-1 text-capitalize">{request.DEST_LOCATION}</p>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6 d-flex column align-items-start">
                                        <p className="card-text fw-bold fs-3 mb-0 me-3">Fare:</p>
                                        <p className="card-text fs-4 mt-1">${request.FARE}</p>
                                    </div>
                                    <div className="col-md-6 d-flex column align-items-start">
                                        <p className="card-text fw-bold fs-3 mb-0 me-3">Status:</p>
                                        <p className="card-text fs-4 mt-1">{request.RIDE_STATUS}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 d-flex column align-items-start">
                                        <p className="card-text fw-bold fs-3 mb-0 me-3">Name:</p>
                                        <p className="card-text fs-4 mt-1 text-capitalize">{request?.CUSTOMER_FIRST_NAME}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {
                    (completedRides?.length === 0) && <div className="d-flex flex-column justify-content-center align-items-center fs-2 h-50vh">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/007/872/974/small/file-not-found-illustration-with-confused-people-holding-big-magnifier-search-no-result-data-not-found-concept-can-be-used-for-website-landing-page-animation-etc-vector.jpg" />
                        <p>No completed rides found</p>
                    </div>
                }
            </div>
        </div>
    );
}

export default Rides;

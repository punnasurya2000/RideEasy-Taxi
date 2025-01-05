import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const DriverRide = () => {
    const [request, setRequest] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        // const rideDetails = JSON.parse(sessionStorage.getItem('rideDetails'));
        axios.get('http://localhost:5001/api/driver/currentride',{
            headers: {
              Authorization: token,
            }
          }).then(res=>{
            console.log('res of current ride----', res?.data?.ride);
            const rideData = res?.data?.ride || {};
            setRequest({...rideData});

          }).catch(err=>{
            console.log('err in getting current ride--', err)
          })
        // setRequest(rideDetails);
    }, []);

    const handleClick = () => {
        const token = localStorage.getItem('token');
        axios.put(`http://localhost:5001/api/driver/currentride/completeride/${request?.RIDE_ID}`, {}, {
            headers: {
                Authorization: token,
            }
        }).then(res => {
            console.log('res------', res);
            navigate('/driver/home');
        }).catch(err => {
            console.log('err in completing ride', err);
        });
    }

    return (<div className="container">
        <div className="fs-1 text-center ">Current Ride</div>
        <div className="row row-cols-1 row-cols-md-1 g-4  mt-5">

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
                            <p className="card-text fs-4 mt-1">In Progress</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 d-flex column align-items-start">
                            <p className="card-text fw-bold fs-3 mb-0 me-3">Distance:</p>
                            <p className="card-text fs-4 mt-1">{request.DISTANCE} miles</p>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end">
                            {/* <button className="btn btn-outline-dark me-2 fs-4">Cancel</button> */}
                            <button className="btn btn-dark fs-4" onClick={handleClick}>Complete Ride</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>);
}

export default DriverRide;

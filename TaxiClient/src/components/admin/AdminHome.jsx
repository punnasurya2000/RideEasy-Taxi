import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AdminHome = () => {
  const [pendingDriversList, setPendingDriversList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5001/api/admin/pending-drivers', { headers: { Authorization: `${token}` } }).then(res => {
      // console.log('res of pending drivers---', res?.data?.pendingDrivers);
      setPendingDriversList(res?.data?.pendingDrivers || []);
    }).catch(err => {
      console.log('pending drivers err---', err);
    });
  }, [])

  const handleRowClick = (userDetails) => {
    console.log('user details----', userDetails);
    sessionStorage.setItem('driverDetails', JSON.stringify(userDetails));
    navigate('/admin/driver-details')

  }
  console.log('state pending---', pendingDriversList)
  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 fs-1">Driver Details</h1>
      <div className="table-responsive rounded-4 fs-3">
        {(pendingDriversList?.length !== 0) && <table className="table">
          <thead className="table-dark">
            <tr className="h-5">
              <th className="ps-4">ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingDriversList?.map((user) => (
              <tr key={user.id} className="h-5 point" onClick={() => handleRowClick(user)}>
                <td className="ps-4">{user.USER_ID}</td>
                <td>{user.FIRST_NAME}</td>
                <td>{user.LAST_NAME}</td>
                <td>{user.EMAIL}</td>
                <td>{user.DRIVER_STATUS}</td>
              </tr>
            ))}
          </tbody>
        </table> ||
          (<div className="d-flex flex-column justify-content-center align-items-center fs-2 h-50vh">
            <img src="https://static.vecteezy.com/system/resources/thumbnails/007/872/974/small/file-not-found-illustration-with-confused-people-holding-big-magnifier-search-no-result-data-not-found-concept-can-be-used-for-website-landing-page-animation-etc-vector.jpg" />
            <p>No Pending Drivers Found</p>
          </div>)}
      </div>
    </div>
  );
};

export default AdminHome;

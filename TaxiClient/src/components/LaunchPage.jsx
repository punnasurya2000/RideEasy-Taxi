import React from "react";
import { Link } from "react-router-dom";
import AccountsNavbar from "./AccountsNavbar";
import "../styles/launchPage.css"; // Import custom CSS for LaunchPage
import '../styles/general.css';
import RideEasy from '../assets/RideEasy.jpeg';

const LaunchPage = () => {
    return (
        <div>
            <AccountsNavbar />
            <h1 className="mt-10 fs-1 text-center">Welcome to RideEasy</h1> {/* Adding additional heading */}
            <div className="container h-65vh  d-flex justify-content-center align-items-center">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col ms-10">
                                <Link to="/user/login" className="card mb-3 bg-dark text-white hover-scale rounded-5 me-5" style={{ height: "20vh", width: '30vw', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                        <h2 className="card-title fs-1">Join as a Rider</h2>
                                        <p className="card-text fs-2">Login as a rider or explore our services</p>
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                        </svg>

                                    </div>
                                </Link>
                            </div>
                            <div className="col">
                                <Link to="/driver/login" className="card mb-3 bg-dark text-white hover-scale rounded-5" style={{ height: "20vh", width: '30vw', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                        <h2 className="card-title fs-1">Join as a Driver</h2>
                                        <p className="card-text fs-2">Login as a driver or join our fleet</p>
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                        </svg>

                                    </div>
                                </Link>
                            </div>
                            <div className="col">
                                <div className="w-80  d-flex flex-row justify-content-center mt-7 ">
                                    <Link to="/admin/login" className="card mb-3 bg-dark text-white hover-scale rounded-5" style={{ height: "20vh", width: '30vw', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                            <h2 className="card-title fs-1">Admin</h2>
                                            <p className="card-text fs-2">Manage fleet user accounts</p>
                                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                            </svg>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="position-fixed bottom-0 end-0">
                <img src={RideEasy} className="w-30vw h-30 " />
            </div>
        </div>
    );
};

export default LaunchPage;
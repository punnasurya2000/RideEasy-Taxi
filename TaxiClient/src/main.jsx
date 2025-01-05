import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './UserApp.jsx';
import './index.css';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import ErrorPage from './components/Errorpage.jsx';
import Map from './components/Map.jsx';
import MapWithSearch from './components/MapWithSearch.jsx';
import './styles/general.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LaunchPage from './components/LaunchPage.jsx';
import UserLogin from './components/user/UserLogin.jsx';
import UserSignup from './components/user/UserSignUp.jsx';
import DriverLogin from './components/driver/DriverLogin.jsx';
import DriverSignup from './components/driver/DriverSignUp.jsx';
import Profile from './components/common_components/Profile.jsx';
import DriverApp from './DriverApp.jsx';
import PaymentPage from './components/user/CardDetails.jsx';
import UserHomePage from './components/user/UserHomePage.jsx';
import AdminLogin from './components/admin/AdminLogin.jsx';
import AdminHome from './components/admin/AdminHome.jsx';
import AdminApp from './AdminApp.jsx';
import DriverDetails from './components/admin/DriverDetails.jsx';
import UserProfile from './components/user/UserProfile.jsx';
import DriverHomePage from './components/driver/DriverHomePage.jsx';
import DriverRide from './components/driver/DriverRide.jsx';
import Rides from './components/common_components/Rides.jsx';
import UserCurrentRide from './components/user/UserCurrentRide.jsx';
import ThankYouPage from './components/user/ThankYouPage.jsx';

const router = createBrowserRouter([
  {
    path: '/user',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/user/home',
        element: <UserHomePage />,
      },
      {
        path: '/user/map',
        element: <Map />,
      },
      {
        path: '/user/ownmap',
        element: <MapWithSearch />,
      },
      {
        path: '/user/profile',
        element: <UserProfile />,
      },
      {
        path: '/user/payment',
        element: <PaymentPage />,
      },
      {
        path: '/user/rides',
        element: <Rides user='user' />,
      },
      {
        path: '/user/current-ride',
        element: <UserCurrentRide />,
      },
      {
        path: '/user/thank-you',
        element: <ThankYouPage />,
      },
    ],
  },
  {
    path: '/driver',
    element: <DriverApp />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/driver/home',
        element: <DriverHomePage />,
      },
      {
        path: '/driver/map',
        element: <Map />,
      },
      {
        path: '/driver/ownmap',
        element: <MapWithSearch />,
      },
      {
        path: '/driver/current-ride',
        element: <DriverRide />,
      },
      {
        path: '/driver/profile',
        element: <Profile user={'driver'} />,
      },
      {
        path: '/driver/rides',
        element: <Rides user='driver' />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminApp />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/admin/home',
        element: <AdminHome />,
      },
      {
        path: '/admin/driver-details',
        element: <DriverDetails />,
      },
    ],
  },
  {
    path: '/',
    element: <LaunchPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/user/signup',
    element: <UserSignup />,
  },
  {
    path: '/user/login',
    element: <UserLogin />,
  },
  {
    path: '/driver/signup',
    element: <DriverSignup />,
  },
  {
    path: '/driver/login',
    element: <DriverLogin />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

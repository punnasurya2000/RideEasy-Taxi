import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useEffect } from 'react';


function DriverApp() {
  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem('token') || '';
    if(!token) navigate('/');
  },[]);
  return (
    <div>
      <Navbar user={'driver'} />
      <div style={{ minHeight: '69vh', overflowY: 'auto' }} className='layout-container'>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default DriverApp;

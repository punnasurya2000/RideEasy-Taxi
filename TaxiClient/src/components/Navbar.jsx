import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const DashboardNavbar = (props) => {
  const navigate = useNavigate();
  const { user } = props;

  const logOut = () => {
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark h-6'>
      {' '}
      {/* Changed bg-primary to bg-dark */}
      <div className='container-fluid container'>
        <Link
          to={`/${user}/home`}
          className='navbar-brand text-light fs-1 hover-effect'
        >
          RideEasy
        </Link>{' '}
        {/* Changed text color to text-light */}
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div
          className='collapse navbar-collapse justify-content-between'
          id='navbarNav'
        >
          {user !== 'admin' && (
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <Link
                  to={`/${user}/rides`}
                  className='nav-link text-light fs-4 hover-effect ms-5'
                >
                  Rides
                </Link>{' '}
                {/* Changed text color to text-light */}
              </li>
              
            </ul>
          )}
          <div className='d-flex justify-content-end align-items-center w-100'>
            <div>
              {user !== 'admin' && (
                <button
                  className='btn btn-outline-light me-2 border border-dark'
                  onClick={() => {
                    navigate(`/${user}/profile`);
                  }}
                >
                  <ion-icon
                    name='person-circle-outline'
                    size='small'
                  ></ion-icon>
                </button>
              )}
              <Link
                to='/'
                className='btn btn-lg btn-outline-light fs-4'
                onClick={logOut}
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;

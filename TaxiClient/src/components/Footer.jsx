import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light pt-5 pb-2 "> {/* Added fixed-bottom class */}
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 className='fs-2'>About Us</h5>
            <p className='fs-4'>RideEasy is your trusted partner for hassle-free urban transportation. With a focus on convenience, reliability, and affordability, we're dedicated to making every ride a seamless experience for our customers.</p>
          </div>
          <div className="col-md-3">
            {/* <h5 className='fs-2'>Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className='fs-4'>Home</a></li>
              <li><a href="#" className='fs-4'>Services</a></li>
              <li><a href="#" className='fs-4'>About</a></li>
              <li><a href="#" className='fs-4'>Contact</a></li>
            </ul> */}
          </div>
          <div className="col-md-4">
            <h5 className='fs-2'>Contact Us</h5>
            <ul className="list-unstyled">
              <li className='fs-4'>4300 Martin Luther King Blvd, Houston, TX 77204</li>
              <li className='fs-4'>rideeasy@gmail.com</li>
              <li className='fs-4'>(123) 456-7890</li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-12 text-center">
            <p className='fs-4'>&copy; 2024 RideEasy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import '../styles/map.css';

const Map = () => {
  return (
    <div className='map-location'>
      <div className='map-section'>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13860.49376077536!2d-95.34162640000001!3d29.716183399999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1711570481677!5m2!1sen!2sus'
          width='600'
          height='450'
          style={{ border: '0' }}
          allowfullscreen=''
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          className='g-map'
        ></iframe>
      </div>
    </div>
  );
};

export default Map;

import React, { useState, useEffect } from 'react';

const MapWithSearch = ({ pickup, dropoff, onDistanceCalculated }) => {
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState('');
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const API_KEY = 'AIzaSyBBA6Yhvv0ksp9jRPzEF4QB09710f8wRM8';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    const mapInstance = new window.google.maps.Map(
      document.getElementById('map'),
      {
        center: { lat: 29.7604, lng: -95.3698 },
        zoom: 12,
      }
    );
    setMap(mapInstance);
    setDirectionsRenderer(new window.google.maps.DirectionsRenderer());
  };

  useEffect(() => {
    if (map && pickup && dropoff) {
      // Calculate distance between pickup and dropoff locations
      const distanceService = new window.google.maps.DistanceMatrixService();
      distanceService.getDistanceMatrix(
        {
          origins: [pickup],
          destinations: [dropoff],
          travelMode: 'DRIVING',
          unitSystem: window.google.maps.UnitSystem.IMPERIAL, // Specify unit system as IMPERIAL for miles
        },
        (response, status) => {
          if (status === 'OK') {
            const distanceValue = response.rows[0].elements[0].distance.text;
            setDistance(distanceValue);

            onDistanceCalculated(distanceValue);
            // Fetch and render the route between pickup and dropoff locations
            const directionsService =
              new window.google.maps.DirectionsService();
            directionsService.route(
              {
                origin: pickup,
                destination: dropoff,
                travelMode: 'DRIVING',
              },
              (result, status) => {
                if (status === 'OK') {
                  directionsRenderer.setDirections(result);
                  directionsRenderer.setMap(map);
                } else {
                  console.error('Error fetching directions:', status);
                }
              }
            );
          } else {
            console.error('Error calculating distance:', status);
          }
        }
      );
    }
  }, [map, pickup, dropoff, directionsRenderer]);

  return (
    <div className=' h-65vh d-flex flex-column  align-items-center justify-content-center'>
      <div id='map' style={{ width: '100%', height: '65vh' }}></div>
      {distance && <p>Distance: {distance}</p>}
    </div>
  );
};

export default MapWithSearch;

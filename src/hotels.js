import Navbar from './navbar/navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import M from 'materialize-css';

function HotelPage() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/hotel')
      .then(response => {
        const updatedHotels = response.data.hotels.map(hotel => ({
          ...hotel,
          images: hotel.images.map(image => `http://localhost:8000/${image}`)
        }));
        setHotels(updatedHotels);
        M.AutoInit();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    // Cambiar de imagen automáticamente cada 5 segundos
    const intervalId = setInterval(() => {
      M.Carousel.getInstance(document.querySelector('.carousel')).next();
    }, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
    <Navbar/>
    <div className="container">
      <h1>Hoteles</h1>
      {hotels.map(hotel => (
        <div className="card" key={hotel.id}>
          <div className="card-image">
            <div className="carousel carousel-slider">
              {hotel.images.map(image => (
                <a className="carousel-item" href="#!" key={image}>
                  <img src={image} alt="Hotel" />
                </a>
              ))}
            </div>
            <span className="card-title" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', fontWeight: 'bold', fontSize: '3em' }}>{hotel.name}</span>
          </div>
          <div className="card-content">
            <p>{hotel.description}</p>
            <h5>Comodidades</h5>
            <ul>
              {hotel.amenities.map(amenity => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}

export default HotelPage;

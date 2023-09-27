import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar/navbar';

function ConfirmReservation() {
  const history = useHistory();
  const location = useLocation();
  const requestData = location.state && location.state.requestData;
  const [token, setToken] = useState('');
  const [hotelInfo, setHotelInfo] = useState(null);

  useEffect(() => {
    // Verificar si hay un token almacenado en el almacenamiento local (localStorage)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      // Redireccionar a la página de inicio de sesión si no hay token almacenado
      history.push('/login', { requestData });
    }

    const getHotelInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/hotel/${requestData.hotel_id}`);
        const hotelData = response.data;
        setHotelInfo(hotelData);
      } catch (error) {
        console.error('Error al obtener la información del hotel:', error);
      }
    };
    getHotelInfo();
  }, [history, requestData]);

  const adjustedData = {
    hotel_id: parseInt(requestData.hotel_id),
    initial_date: requestData.initial_date,
    final_date: requestData.final_date
  };

  const handleConfirmReservation = () => {
    axios
      .post('http://localhost:5000/reservation', adjustedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Reserva confirmada:', response.data);
        // Redireccionar a /reservations y mostrar un modal
        history.push('/reservations', { newReservation: true });
      })
      .catch(error => {
        console.error('Error al confirmar la reserva:', error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col s12 m6 offset-m3">
            {hotelInfo && (
              <div className="card">
                <div className="card-image">
                  <img src={`http://localhost:8000/${hotelInfo.images[0]}`} alt="Hotel" />
                  <span className="card-title">{hotelInfo.name}</span>
                </div>
                <div className="card-content">
                  <p>{hotelInfo.description}</p>
                  <p>
                    <strong>Comodidades:</strong> {hotelInfo.amenities.join(', ')}
                  </p>
                  <p>
                    <strong>Fecha Inicio:</strong> {requestData.initial_date}
                  </p>
                  <p>
                    <strong>Fecha Final:</strong> {requestData.final_date}
                  </p>
                </div>
                <div className="card-action">
                  <button
                    className="btn waves-effect waves-light grey darken-3"
                    onClick={handleConfirmReservation}
                  >
                    Confirmar Reserva
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmReservation;

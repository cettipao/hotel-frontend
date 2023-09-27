import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './navbar/navbar';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import M from 'materialize-css'

const AdminReservations = () => {
  const history = useHistory();
  const location = useLocation();
  const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [token, setToken] = useState('');
  const [reservationConfirmed, setReservationConfirmed] = useState('');
  

  const fetchReservations = useCallback(() => {
    const params = {};

    if (selectedHotel) {
      params.hotel_id = selectedHotel;
    }
    if (startDate) {
      params.start_date = startDate;
    }
    if (endDate) {
      params.end_date = endDate;
    }

    if (!token) {
      return
    }

    axios.get('http://localhost:5000/my-reservations', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: params
    })
      .then(response => {
        const data = response.data;
        const reservations = data.reservations || [];
        setReservations(reservations);
      })
      .catch(error => {
        alert(error)
        alert(token)
        console.error('Error:', error);
      });
  }, [selectedHotel, startDate, endDate, token]);

  useEffect(() => {
    // Verificar si hay un token almacenado en el almacenamiento local (localStorage)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      // Redireccionar a la página de inicio de sesión si no hay token almacenado
      history.push('/login');
    }

    if (location.state && location.state.newReservation && !reservationConfirmed) {
      M.toast({ html: '¡Reserva confirmada exitosamente!', classes: 'green' });
      setReservationConfirmed(true);
    }

    axios.get('http://localhost:5000/hotel')
      .then(response => {
        setHotels(response.data.hotels);
        M.AutoInit()
      })
      .catch(error => {
        console.error('Error:', error);
      });

    fetchReservations();
  }, [fetchReservations, history, token, reservationConfirmed, location]);

  const handleFormSubmit = e => {
    e.preventDefault();
    fetchReservations();
  };

  return (
    <>
      <Navbar />

      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <form onSubmit={handleFormSubmit}>
              <div className="row">
                <div className="input-field col s12 m6 l4">
                  <div className='grey-text'>Hotel</div>
                  <select
                    className="icons"
                    name="hotel_id"
                    required
                    value={selectedHotel}
                    onChange={e => setSelectedHotel(e.target.value)}
                  >
                    <option value="">Ningun Hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-field col s12 m6 l4">
                  <div className='grey-text'>Fecha Inicio</div>
                  <input
                    type="date"
                    name="start_date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
                <div className="input-field col s12 m6 l4">
                  <div className='grey-text'>Fecha Final</div>
                  <input
                    type="date"
                    name="end_date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </form>

            <h2>Mis Reservas</h2>
            <table>
              <thead>
                <tr>
                  <th>Reservation ID</th>
                  <th>Hotel</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Final</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation.reservation_id}>
                    <td>{reservation.reservation_id}</td>
                    <td>{reservation.name}</td>
                    <td>{reservation.initial_date}</td>
                    <td>{reservation.final_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReservations;

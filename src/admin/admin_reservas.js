import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../navbar/navbar';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import M from 'materialize-css'

const AdminReservations = () => {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [token, setToken] = useState('');

  const fetchReservations = useCallback(() => {
    const params = {};

    if (selectedHotel) {
      params.hotel_id = selectedHotel;
    }
    if (selectedUser) {
      params.user_id = selectedUser;
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

    axios.get('http://localhost:5000/reservation', {
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
  }, [selectedHotel, selectedUser, startDate, endDate, token]);

  useEffect(() => {
    // Verificar si hay un token almacenado en el almacenamiento local (localStorage)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      // Redireccionar a la página de inicio de sesión si no hay token almacenado
      history.push('/login');
    }

    // Verificar si el usuario es administrador
    axios.get('http://localhost:5000/myuser', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(response => {
        if (response.data.admin === 0) {
          // Redireccionar al inicio si el usuario no es administrador
          history.push('/');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        history.push('/');
      });

    axios.get('http://localhost:5000/hotel')
      .then(response => {
        setHotels(response.data.hotels);
        M.AutoInit()
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.get('http://localhost:5000/user', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(response => {
        setUsers(response.data.users);
        M.AutoInit()
      })
      .catch(error => {
        console.error('Error:', error);
      });

    fetchReservations();
  }, [fetchReservations, history, token]);

  const handleFormSubmit = e => {
    e.preventDefault();
    fetchReservations();
  };

  const handleDeleteReservation = (reservationId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      axios.delete(`http://localhost:5000/reservation/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('Reserva eliminada:', response.data);
          // Volver a cargar las reservas después de eliminar
          M.toast({ html: '¡Reserva eliminada exitosamente!', classes: 'green' });
          fetchReservations();
        })
        .catch(error => {
          console.error('Error al eliminar la reserva:', error);
        });
    }
  };
  

  return (
    <>
      <Navbar />

      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <form onSubmit={handleFormSubmit}>
              <div className="row">
                <div className="input-field col s12 m6 l3">
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
                <div className="input-field col s12 m6 l3">
                  <div className='grey-text'>Usuario</div>
                  <select
                    className="icons"
                    name="user_id"
                    required
                    value={selectedUser}
                    onChange={e => setSelectedUser(e.target.value)}
                  >
                    <option value="">Ningun Usuario</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-field col s12 m6 l3">
                  <div className='grey-text'>Fecha Inicio</div>
                  <input
                    type="date"
                    name="start_date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
                <div className="input-field col s12 m6 l3">
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

            <h2>Reservas</h2>
            <table>
              <thead>
                <tr>
                  <th>Reservation ID</th>
                  <th>Nombre</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Final</th>
                  <th>Nombre de Usuario</th>
                  <th>Apellido de Usuario</th>
                  <th>DNI de Usuario</th>
                  <th>Email de Usuario</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation.reservation_id}>
                    <td>{reservation.reservation_id}</td>
                    <td>{reservation.name}</td>
                    <td>{reservation.initial_date}</td>
                    <td>{reservation.final_date}</td>
                    <td>{reservation.user_name}</td>
                    <td>{reservation.user_last_name}</td>
                    <td>{reservation.user_dni}</td>
                    <td>{reservation.user_email}</td>
                    <td>
                      <button
                        className="btn waves-effect waves-light red"
                        onClick={() => handleDeleteReservation(reservation.reservation_id)}
                      >
                        Eliminar
                      </button>
                    </td>
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

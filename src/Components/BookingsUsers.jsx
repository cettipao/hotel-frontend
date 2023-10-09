import React, { useState, useEffect } from 'react';
import { BASE_URL } from "../configs";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

const BookingsUsers = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('Todos los hoteles');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    getBookings();
    getUsers();
    getHotels();
  }, []);

  const getBookings = async () => {
    const response = await fetch(`${BASE_URL}/bookings`);
    const data = await response.json();
    setBookings(data.bookings);
  };

  const getUsers = async () => {
    const response = await fetch(`${BASE_URL}/users`);
    const data = await response.json();
    setUsers(data);
    console.log(data);
  };

  const getHotels = async () => {
    const response = await fetch(`${BASE_URL}/hotels`);
    const data = await response.json();
    setHotels(data.hotels);
  };

  const getUsernameById = (userId) => {
    if (!users || users.length === 0) {
      return ''; // Si los datos de usuarios no están disponibles aún, retorna una cadena vacía
    }
    const user = users.find((user) => user.id === userId);
    return user ? user.user_name : '';
  };

  const getHotelNameById = (hotelId) => {
    if (!hotels || hotels.length === 0) {
      return ''; // Si los datos de hoteles no están disponibles aún, retorna una cadena vacía
    }
    const hotel = hotels.find((hotel) => hotel.id === hotelId);
    return hotel ? hotel.name : '';
  };

  const handleHotelSelection = (event) => {
    setSelectedHotel(event.target.value);
  };

  const handleDateChange = (event) => {
    setSearchDate(event.target.value);
  };

  const filteredBookings = bookings.filter((booking) => {
    const hotelName = getHotelNameById(booking.hotel_id);
    const fromDate = new Date(booking.date_from);
    const toDate = new Date(booking.date_to);
    const searchFromDate = new Date(searchDate);
    const searchToDate = new Date(searchDate);

    // Filtrar por hotel seleccionado
    if (selectedHotel !== 'Todos los hoteles' && hotelName !== selectedHotel) {
      return false;
    }

    // Filtrar por fecha
    if (searchDate && (fromDate > searchToDate || toDate < searchFromDate)) {
      return false;
    }

    return true;
  });

  const sortedBookings = filteredBookings.sort((a, b) => {
    const dateA = new Date(a.date_from);
    const dateB = new Date(b.date_from);
    return dateA.getTime() - dateB.getTime();
  });

  //me ordena las reservas por las fechas

  return (
    <div>
      <Select
        value={selectedHotel}
        onChange={handleHotelSelection}
      >
        <MenuItem value="Todos los hoteles">Todos los hoteles</MenuItem>
        {hotels.map((hotel) => (
          <MenuItem key={hotel.id} value={hotel.name}>
            {hotel.name}
          </MenuItem>
        ))}
      </Select>

      <TextField
        label="Fecha"
        type="date"
        value={searchDate}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <table>
        <thead>
          <tr>
            <th>Fecha desde</th>
            <th>Fecha hasta</th>
            <th>User</th>
            <th>Hotel</th>
          </tr>
        </thead>
        <tbody>
          {sortedBookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.date_from}</td>
              <td>{booking.date_to}</td>
              <td>{getUsernameById(booking.user_id)}</td>
              <td>{getHotelNameById(booking.hotel_id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsUsers;

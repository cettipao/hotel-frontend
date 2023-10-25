import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthContextProvider";
import { BASE_URL } from "../configs";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const ProfilePage = () => {
  const { user, getUserBookings } = useContext(AuthContext);

  const [userBookings, setUserBookings] = useState([]);
  const [hotelNames, setHotelNames] = useState({});
  const [selectedHotel, setSelectedHotel] = useState("all");
  const [filterFromDate, setFilterFromDate] = useState("");

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        if (user) {
          const bookingData = await getUserBookings(user.id);
          console.log("User Bookings:", bookingData);
          setUserBookings(bookingData);
          fetchHotelNames(bookingData.bookings);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserBookings();
    setSelectedHotel("all"); // Establecer "Todos los hoteles" como opción predeterminada
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, getUserBookings]);

  const fetchHotelNames = async (bookings) => {
    const hotelIds = bookings.map((booking) => booking.hotel_id);
    const uniqueHotelIds = [...new Set(hotelIds)]; // Eliminar duplicados

    try {
      const hotelNamesMap = {};

      for (const hotelId of uniqueHotelIds) {
        const response = await fetch(`${BASE_URL}/hotel/${hotelId}`);
        const data = await response.json();
        hotelNamesMap[hotelId] = data.name;
      }

      setHotelNames(hotelNamesMap);
    } catch (error) {
      console.error("Error al obtener los nombres de los hoteles:", error);
    }
  };

  const handleHotelChange = (event) => {
    setSelectedHotel(event.target.value);
    const hotelId = Object.keys(hotelNames).find((key) => hotelNames[key] === event.target.value);
    const hotelName = hotelNames[hotelId] || "Todos los hoteles";
    console.log("Hotel seleccionado:", hotelName);
  };

  const handleFilterFromDateChange = (event) => {
    setFilterFromDate(event.target.value);
  };

  const filteredBookings = userBookings?.bookings?.filter((booking) => {
    const hotelName = hotelNames[booking.hotel_id];
    const fromDate = new Date(booking.date_from);

    if (selectedHotel !== "all" && hotelName !== selectedHotel) {
      return false;
    }

    if (filterFromDate && fromDate < new Date(filterFromDate)) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p>Nombre: {user?.name}</p>
      <p>Apellido: {user?.last_name}</p>
      <p>Email: {user?.email}</p>
      <h3>Reservas:</h3>
      <div>
        <Select value={selectedHotel} onChange={handleHotelChange}>
          <MenuItem value="all">Todos los hoteles</MenuItem>
          {Object.keys(hotelNames).map((hotelId) => (
            <MenuItem key={hotelId} value={hotelNames[hotelId]}>
              {hotelNames[hotelId]}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Fecha"
          type="date"
          value={filterFromDate}
          onChange={handleFilterFromDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      {userBookings && (
        <ul>
          {filteredBookings?.map((booking) => (
            <li key={booking.id}>
              <p>ID de reserva: {booking.id}</p>
              <p>Hotel: {hotelNames[booking.hotel_id]}</p>
              <p>Fecha de ingreso: {booking.date_from}</p>
              <p>Fecha de salida: {booking.date_to}</p>
              <p>------------------</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfilePage;
import React, { useEffect, useState } from "react";
import { MenuItem, Button, InputLabel, Select } from "@mui/material";
import { BASE_URL } from "../configs";
import Swal from "sweetalert2";

const HotelsAmenitiesForm = () => {
  const [hotels, setHotels] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");

  const getHotels = async () => {
    try {
      const response = await fetch(`${BASE_URL}/hotels`);
      const data = await response.json();
      setHotels(data.hotels);
    } catch (error) {
      console.error('Error al obtener los hoteles:', error);
      Swal.fire({
        text: `Error al obtener los hoteles existentes`,
        icon: "error",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
      });
    }
  };

  const getAmenities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/amenities`);
      const data = await response.json();
      if (data.amenities != "") {
        setAmenities(data.amenities);
      }
    } catch (error) {
      console.error('Error al obtener las amenities:', error);
      Swal.fire({
        text: `Error al obtener las amenities existentes`,
        icon: "error",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
      });
    }
  };

  useEffect(() => {
    // Obtener lista de hoteles
    getHotels();

    // Obtener lista de amenities
    getAmenities();
  }, []);

  const handleHotelChange = (event) => {
    setSelectedHotel(event.target.value);
  };

  const handleAmenityChange = (event) => {
    setSelectedAmenity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Realizar la solicitud PUT al backend con los datos seleccionados
    const hotelId = selectedHotel;
    const amenityId = selectedAmenity;

    fetch(`${BASE_URL}/hotel/${hotelId}/add-amenitie/${amenityId}`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        Swal.fire({
          text: 'Registro de la amenidad del hotel realizado con éxito',
          icon: 'success',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <InputLabel id="hotel-select-label">Seleccione un hotel:</InputLabel>
        {hotels?.length ? (
          <Select
            labelId="hotel-select-label"
            id="hotel-select"
            value={selectedHotel}
            onChange={handleHotelChange}
          >
            {hotels.map((hotel) => (
              <MenuItem key={hotel.id} value={hotel.id}>
                {hotel.name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <p>No hay hoteles disponibles</p>
        )}
      </div>
      <div>
        <p>Seleccione una amenidad:</p>
        {amenities?.length ? (
          <Select
            labelId="amenitie-select-label"
            id="amenitie-select"
            value={selectedAmenity}
            onChange={handleAmenityChange}
          >
            {amenities.map((amenitie) => (
              <MenuItem key={amenitie.id} value={amenitie.id}>
                {amenitie.name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <p>No hay amenities disponibles</p>
        )}
      </div>
      <Button type="submit" variant="contained" color="primary">
        Guardar
      </Button>
    </form>
  );
};

export default HotelsAmenitiesForm;





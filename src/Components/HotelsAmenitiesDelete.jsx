import React, { useEffect, useState } from "react";
import { MenuItem, Button, InputLabel, Select } from "@mui/material";
import { BASE_URL } from "../configs";
import Swal from "sweetalert2";

const HotelsAmenitiesDelete = () => {
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

  const getAmenities = async (hotelId) => {
    try {
      const response = await fetch(`${BASE_URL}/amenities/hotel/${hotelId}`);
      const data = await response.json();
      if (data.amenities !== "") {
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
  }, []);

  const handleHotelChange = (event) => {
    const hotelId = event.target.value;
    setSelectedHotel(hotelId);
    getAmenities(hotelId);
  };

  const handleDeleteAmenity = async () => {
    try {
      const response = await fetch(`${BASE_URL}/hotel/${selectedHotel}/remove-amenitie/${selectedAmenity}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Eliminación exitosa, realizar las acciones necesarias
        getAmenities(selectedHotel); // Volver a obtener las amenities actualizadas
        setSelectedAmenity(""); // Limpiar la amenitie seleccionada
        Swal.fire({
          text: 'Amenitie eliminada con éxito del hotel',
          icon: 'success',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
        });
      } else {
        console.error("Error deleting amenity:", response.status);
      }
    } catch (error) {
      console.error("Error deleting amenity:", error);
    }
  };

  return (
    <div>
      <InputLabel id="hotel-select-label">Seleccione un hotel:</InputLabel>
      {hotels.length ? (
        <div>
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
          {selectedHotel && (
            <div>
              <h4>Amenities:</h4>
              {amenities.map((amenity) => (
                <div key={amenity.id}>
                  {amenity.name}
                  <Button onClick={() => setSelectedAmenity(amenity.id)}>Delete</Button>
                </div>
              ))}
              {selectedAmenity && (
                <Button onClick={handleDeleteAmenity}>Eliminar</Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>No hay hoteles disponibles</p>
      )}
    </div>
  );
};

export default HotelsAmenitiesDelete;


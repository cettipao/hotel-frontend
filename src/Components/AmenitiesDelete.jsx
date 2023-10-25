import React, { useEffect, useState } from "react";
import { MenuItem, Button, InputLabel, Select } from "@mui/material";
import { BASE_URL } from "../configs";
import Swal from "sweetalert2";

const AmenitiesDelete = () => {
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState("");

  const getAmenities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/amenities`);
      const data = await response.json();
      setAmenities(data.amenities);
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
    // Obtener lista de amenities
    getAmenities();
  }, []);

  const handleDeleteAmenity = async () => {
    try {
      const response = await fetch(`${BASE_URL}/amenitie/${selectedAmenity}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Eliminación exitosa, realizar las acciones necesarias
        getAmenities(); // Volver a obtener las amenities actualizadas
        setSelectedAmenity(""); // Limpiar la amenity seleccionada
        Swal.fire({
          text: 'Amenitie eliminada con éxito',
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
      <InputLabel id="amenity-select-label">Seleccione una amenity:</InputLabel>
      {amenities.length ? (
        <div>
          <Select
            labelId="amenity-select-label"
            id="amenity-select"
            value={selectedAmenity}
            onChange={(event) => setSelectedAmenity(event.target.value)}
          >
            {amenities.map((amenity) => (
              <MenuItem key={amenity.id} value={amenity.id}>
                {amenity.name}
              </MenuItem>
            ))}
          </Select>
          {selectedAmenity && (
            <div>
              <Button onClick={handleDeleteAmenity}>Eliminar</Button>
            </div>
          )}
        </div>
      ) : (
        <p>No hay amenities disponibles</p>
      )}
    </div>
  );
};

export default AmenitiesDelete;

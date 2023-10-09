import React, { useEffect, useState } from "react";
import { MenuItem, Button, InputLabel, Select } from "@mui/material";
import { BASE_URL } from "../configs";
import Swal from "sweetalert2";

const HotelsImagesForm = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedImage, setSelectedImage] = useState();

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

  useEffect(() => {
    // Obtener lista de hoteles
    getHotels();
  }, []);

  const handleHotelChange = (event) => {
    setSelectedHotel(event.target.value);
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const response = await fetch(`${BASE_URL}/hotel/${selectedHotel}/add-image`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        // Carga exitosa de la imagen, realizar las acciones necesarias
        setSelectedHotel("");
        setSelectedImage(null);
        Swal.fire({
          text: "Imagen agregada con éxito al hotel",
          icon: "success",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
        });
      } else {
        console.error("Error uploading image:", response.status);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
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
              <h4>Seleccione una imagen:</h4>
              <input type="file" onChange={handleImageChange} accept="image/*" />
              {selectedImage && (
                <Button onClick={handleImageUpload}>Subir imagen</Button>
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

export default HotelsImagesForm;

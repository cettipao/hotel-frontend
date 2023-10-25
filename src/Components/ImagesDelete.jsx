import React, { useEffect, useState } from 'react';
import {
  MenuItem,
  Button,
  InputLabel,
  Select,
  Box,
  Paper,
} from '@mui/material';
import Swal from 'sweetalert2';
import { BASE_URL } from "../configs";

const ImagesDelete = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageURL, setSelectedImageURL] = useState('');

  const getHotels = async () => {
    try {
      const response = await fetch(`${BASE_URL}/hotels`);
      const data = await response.json();
      setHotels(data.hotels);
    } catch (error) {
      console.error('Error al obtener los hoteles:', error);
      Swal.fire({
        text: 'Error al obtener los hoteles existentes',
        icon: 'error',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
      });
    }
  };

  const getImagesByHotelId = async (hotelId) => {
    try {
      const response = await fetch(`${BASE_URL}/image/hotel/${hotelId}`);
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error('Error al obtener las imágenes del hotel:', error);
      Swal.fire({
        text: 'Error al obtener las imágenes del hotel',
        icon: 'error',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
      });
    }
  };

  useEffect(() => {
    getHotels();
  }, []);

  const handleHotelChange = (event) => {
    const hotelId = event.target.value;
    setSelectedHotel(hotelId);
    getImagesByHotelId(hotelId);
  };

  const handleImageChange = async (event) => {
    const selectedImageId = event.target.value;
    setSelectedImage(selectedImageId);
    const selectedImage = images.find((image) => image.id === selectedImageId);
    if (selectedImage) {
      try {
        setSelectedImageURL(`${BASE_URL}/${selectedImage.url}`);
      } catch (error) {
        console.error('Error al obtener la imagen:', error);
        Swal.fire({
          text: 'Error al obtener la imagen',
          icon: 'error',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
        });
      }
    }
  };

  console.log(selectedImageURL)

  const handleImageDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/imagedelete/${selectedImage}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSelectedImage('');
        setImages(images.filter((image) => image.id !== selectedImage));
        Swal.fire({
          text: 'Imagen eliminada con éxito',
          icon: 'success',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
        });
      } else {
        console.error('Error deleting image:', response.status);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
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
              {images.length ? (
                <div>
                  <Select value={selectedImage} onChange={handleImageChange}>
                    {images.map((image) => (
                      <MenuItem key={image.id} value={image.id}>
                        <Paper
                      component="img"
                      src={selectedImageURL}
                      alt="Thumbnail"
                      sx={{ width: 50, height: 50, marginRight: 1 }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleImageDelete}
                  >
                    Eliminar imagen
                  </Button>
                </div>
              ) : (
                <p>No hay imágenes disponibles para este hotel.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>No hay hoteles disponibles.</p>
      )}
    </div>
  );
};

export default ImagesDelete;



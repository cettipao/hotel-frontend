import React, { useState, useEffect } from 'react';
import { BASE_URL } from "../configs";
import Swal from "sweetalert2";
import Button from '@mui/material/Button';
import HotelsAmenitiesForm from "./../Components/HotelsAmenitiesForm";
import HotelsAmenitiesDelete from '../Components/HotelsAmenitiesDelete';
import AmenitiesDelete from '../Components/AmenitiesDelete';
import HotelsImagesForm from '../Components/HotelsImagesForm';
import ImagesDelete from '../Components/ImagesDelete';
import BookingsUsers from "./../Components/BookingsUsers";
import RegUsers from "./../Components/RegUsers";
import * as Yup from 'yup';

// Validación del esquema de la amenitie
const amenitieSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  description: Yup.string().required('La descripción es requerida'),
});

// Validación del esquema del hotel
const hotelSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  telephone: Yup.string().required('El teléfono es requerido').matches(/^[0-9]+$/, 'El teléfono debe contener solo números'),
  email: Yup.string().required('El correo electrónico es requerido').email('El correo electrónico debe tener un formato válido'),
  rooms: Yup.number().required('La cantidad de habitaciones es requerida').integer('La cantidad de habitaciones debe ser un número entero'),
  description: Yup.string().required('La descripción es requerida'),
});

const AdminUser = () => {
  const [amenitieData, setAmenitieData] = useState({
    name: '',
    description: '',
  });
  const [formSubmittedAmenitie, setFormSubmittedAmenitie] = useState(false);
  const [existingAmenities, setExistingAmenities] = useState([]);

  const [hotelData, setHotelData] = useState({
    name: '',
    telephone: '',
    email: '',
    rooms: 0,
    description: '',
    availability: 1,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchExistingAmenities();
  }, []);

  const fetchExistingAmenities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/amenities`);
      const data = await response.json();
      setExistingAmenities(data.amenities);
    } catch (error) {
      console.error('Error al obtener las amenities existentes:', error);
      Swal.fire({
        text: `Error al obtener las amenities existentes`,
        icon: "error",
        showClass: {
          popup: "animate_animated animate_fadeInDown",
        },
      });
    }
  };

  useEffect(() => {
    if (formSubmittedAmenitie) {
      addAmenitie();
    }
  }, [formSubmittedAmenitie]);

  const handleInputChange = (e) => {
    setAmenitieData({
      ...amenitieData,
      [e.target.name]: e.target.value,
    });
  };

  const addAmenitie = () => {
    const existingAmenity = existingAmenities.find(
      (amenity) => amenity.name.toLowerCase() === amenitieData.name.toLowerCase()
    );

    if (existingAmenity) {
      Swal.fire({
        text: 'La amenitie ya existe',
        icon: 'error',
        showClass: {
          popup: 'animate_animated animate_fadeInDown',
        },
      });
      setFormSubmittedAmenitie(false);
      return;
    }

    fetch(`${BASE_URL}/amenitie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(amenitieData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Amenitie agregada:', data);
        Swal.fire({
          text: 'Amenitie registrada con éxito',
          icon: 'success',
          showClass: {
            popup: 'animate_animated animate_fadeInDown',
          },
        });
        setAmenitieData({
          name: '',
          description: '',
        });
      })
      .catch((error) => {
        console.error('Error al agregar la amenitie:', error);
        Swal.fire({
          text: 'La amenitie no se ha podido registrar',
          icon: 'error',
          showClass: {
            popup: 'animate_animated animate_fadeInDown',
          },
        });
      })
      .finally(() => {
        setFormSubmittedAmenitie(false);
      });
  };

  const handleSubmitAmenitie = () => {
    amenitieSchema
      .validate(amenitieData, { abortEarly: false })
      .then(() => setFormSubmittedAmenitie(true))
      .catch((error) => {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      });
  };

  useEffect(() => {
    if (formSubmitted) {
      addHotel();
    }
  }, [formSubmitted]);

  const addHotel = async () => {
    const parsedHotelData = {
      ...hotelData,
      rooms: parseInt(hotelData.rooms),
    };

    try {
      await hotelSchema.validate(parsedHotelData, { abortEarly: false });

      const response = await fetch(`${BASE_URL}/hotel`, {
        method: 'POST',
        body: JSON.stringify(parsedHotelData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Hotel agregado exitosamente');
        Swal.fire({
          text: 'Hotel registrado con éxito',
          icon: 'success',
          showClass: {
            popup: 'animate_animated animate_fadeInDown',
          },
        });
        setHotelData({
          name: '',
          telephone: '',
          email: '',
          rooms: 0,
          description: '',
          availability: 1,
        });
      } else {
        console.log('Error al agregar el hotel');
        Swal.fire({
          text: 'El hotel no se ha podido registrar',
          icon: 'error',
          showClass: {
            popup: 'animate_animated animate_fadeInDown',
          },
        });
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
    } finally {
      setFormSubmitted(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setHotelData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    hotelSchema
      .validate(hotelData, { abortEarly: false })
      .then(() => setFormSubmitted(true))
      .catch((error) => {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      });
  };

  return (
    <div>
      <h1>PAGINA DE ADMINISTRADOR</h1>
      <div>
        <h2>Registrar un nuevo hotel:</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={hotelData.name}
              onChange={handleChange}
            />
            {errors.name && <p>{errors.name}</p>}
          </label>
          <br />
          <label>
            Telephone:
            <input
              type="text"
              name="telephone"
              value={hotelData.telephone}
              onChange={handleChange}
            />
            {errors.telephone && <p>{errors.telephone}</p>}
          </label>
          <br />
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={hotelData.email}
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}
          </label>
          <br />
          <label>
            Rooms:
            <input
              type="number"
              name="rooms"
              value={hotelData.rooms}
              onChange={handleChange}
            />
            {errors.rooms && <p>{errors.rooms}</p>}
          </label>
          <br />
          <label>
            Description:
            <textarea
              name="description"
              value={hotelData.description}
              onChange={handleChange}
            />
            {errors.description && <p>{errors.description}</p>}
          </label>
          <br />
          <Button variant="contained" color="primary" type="submit">Agregar hotel</Button>
        </form>
      </div>
      <div>
        <h2>Registrar una nueva amenitie:</h2>
        <form>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={amenitieData.name}
              onChange={handleInputChange}
            />
            {errors.name && <p>{errors.name}</p>}
          </label>
          <br />
          <label>
            Description:
            <textarea
              name="description"
              value={amenitieData.description}
              onChange={handleInputChange}
            />
            {errors.description && <p>{errors.description}</p>}
          </label>
          <br />
          <Button variant="contained" color="primary" onClick={handleSubmitAmenitie}>Agregar amenitie</Button>
        </form>
      </div>
      <div>
        <h2>Agregar una amenitie al hotel:</h2>
        <HotelsAmenitiesForm />
      </div>
      <div>
        <h2>Eliminar una amenitie al hotel:</h2>
        <HotelsAmenitiesDelete />
      </div>
      <div>
        <h2>Eliminar una amenitie:</h2>
        <AmenitiesDelete />
      </div>
      <div>
        <h2>Agregar imagenes al hotel:</h2>
        <HotelsImagesForm />
      </div>
      <div>
        <h2>Eliminar una imagen:</h2>
        <ImagesDelete />
      </div>
      <div>
        <h2>Listado de reservas:</h2>
        <BookingsUsers />
      </div>
      <div>
        <h2>Listado de usuarios registrados:</h2>
        <RegUsers />
      </div>
    </div>
  );
};

export default AdminUser;

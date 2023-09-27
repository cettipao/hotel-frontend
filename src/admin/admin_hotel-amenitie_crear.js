import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import M from 'materialize-css';

const CreateImagePage = () => {
  const history = useHistory();
  const [hotels, setHotels] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedAmenitie, setSelectedAmenitie] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si hay un token almacenado en el almacenamiento local (localStorage)
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      // Redireccionar a la página de inicio de sesión si no hay token almacenado
      history.push('/login');
      return;
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

    axios
      .get('http://localhost:5000/hotel')
      .then(response => {
        setHotels(response.data.hotels);
        M.AutoInit();
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios
      .get('http://localhost:8000/amenitie', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        setAmenities(response.data.amenities);
        M.AutoInit();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [history]);

  const handleHotelChange = (e) => {
    setSelectedHotel(e.target.value);
  };

  const handleAmenitieChange = (e) => {
    setSelectedAmenitie(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si hay un token almacenado en el almacenamiento local (localStorage)
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      // Redireccionar a la página de inicio de sesión si no hay token almacenado
      history.push('/login');
      return;
    }

    // Validar que se haya seleccionado un hotel
    if (!selectedHotel) {
      setError('Debe seleccionar un hotel');
      return;
    }

    // Validar que se haya seleccionado un amenitie
    if (!selectedAmenitie) {
      setError('Debe seleccionar un amenitie');
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/hotel/${selectedHotel}/add-amenitie/${selectedAmenitie}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      );

      // Redireccionar a la página de imágenes
      history.push('/admin/hotel_amenitie');
    } catch (error) {
      console.error('Error:', error);
      setError('Error al crear la relacion');
    }
  };

  return (
    <>
      <Navbar />
      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <h4>Crear Relación Hotel-Amenitie</h4>

            {error && <p className="error-message red-text">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <select
                  value={selectedHotel}
                  onChange={handleHotelChange}
                >
                  <option value="" disabled>Seleccione un hotel</option>
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                  ))}
                </select>
                <label>Hoteles</label>
              </div>

              <div className="input-field">
                <select
                  value={selectedAmenitie}
                  onChange={handleAmenitieChange}
                >
                  <option value="" disabled>Seleccione un amenitie</option>
                  {amenities.map(amenitie => (
                    <option key={amenitie.id} value={amenitie.id}>{amenitie.name}</option>
                  ))}
                </select>
                <label>Amenities</label>
              </div>

              <button
                className="btn waves-effect waves-light grey darken-3"
                type="submit"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateImagePage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import M from 'materialize-css';

const CreateImagePage = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/hotel')
      .then(response => {
        setHotels(response.data.hotels);
        M.AutoInit();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleHotelChange = (e) => {
    setSelectedHotel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se haya seleccionado un hotel
    if (!selectedHotel) {
      setError('Debe seleccionar un hotel');
      return;
    }

    // Validar que se haya seleccionado una imagen
    if (!image) {
      setError('Debe seleccionar una imagen');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', image);

      await axios.post(`http://localhost:8000/hotel/${selectedHotel}/add-image`, formData);

      // Redireccionar a la página de imágenes
      window.location.href = '/admin/imagenes';
    } catch (error) {
      console.error('Error:', error);
      setError('Error al crear la imagen');
    }
  };

  return (
    <>
      <Navbar />
      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <h4>Subir Imagen</h4>

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

              <div className="file-field input-field">
                <div className="btn grey darken-3">
                  <span>Seleccionar Imagen</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" />
                </div>
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

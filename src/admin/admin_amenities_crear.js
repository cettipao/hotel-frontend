import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Navbar from '../navbar/navbar';

function CreateAmenity() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const storedToken = localStorage.getItem('token');

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validar que el campo nombre no esté vacío
    if (!name) {
      setError('El campo nombre es obligatorio');
      return;
    }

    // Crear el objeto de datos del amenity
    const amenityData = {
      name: name,
    };

    // Realizar la solicitud POST a localhost:5000/amenities
    axios
      .post('http://localhost:5000/amenitie', amenityData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then(response => {
        // Manejar la respuesta de éxito
        console.log('Amenity creado:', response.data);
        // Redireccionar a la página de amenities
        history.push('/admin/amenities');
      })
      .catch(error => {
        // Manejar los errores de la solicitud
        console.error('Error al crear el amenity:', error);
        setError('Error al crear el amenity');
      });
  };

  return (
    <>
    <Navbar/>
      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <h4>Crear Amenity</h4>

            {error && <p className="error-message red-text">{error}</p>}

            <form onSubmit={handleFormSubmit}>
              <div className="input-field">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="name">Nombre</label>
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
}

export default CreateAmenity;

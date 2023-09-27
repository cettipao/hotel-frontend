import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import Navbar from '../navbar/navbar';

function UpdateAmenity() {
  const history = useHistory();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const storedToken = localStorage.getItem('token');

  useEffect(() => {
    // Obtener los datos del amenity para prellenar el formulario
    axios.get(`http://localhost:5000/amenitie/${id}`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then(response => {
        setName(response.data.name);
        document.getElementById("name").select()
        document.getElementById("name").blur()
      })
      .catch(error => {
        console.error('Error al obtener el amenity:', error);
      });
  }, [id, storedToken]);

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

    // Realizar la solicitud PUT a localhost:5000/amenitie/{id}
    axios
      .put(`http://localhost:5000/amenitie/${id}`, amenityData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then(response => {
        // Manejar la respuesta de éxito
        console.log('Amenity modificado:', response.data);
        // Redireccionar a la página de amenities
        history.push('/admin/amenities');
      })
      .catch(error => {
        // Manejar los errores de la solicitud
        console.error('Error al modificar el amenity:', error);
        setError('Error al modificar el amenity');
      });
  };

  return (
    <>
      <Navbar />
      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <h4>Modificar Amenity</h4>

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

export default UpdateAmenity;

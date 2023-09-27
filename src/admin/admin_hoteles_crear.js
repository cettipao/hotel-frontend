import Navbar from '../navbar/navbar';
import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

function CreateHotel() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [roomsAvailable, setRoomsAvailable] = useState('');
  const [error, setError] = useState('');

  const storedToken = localStorage.getItem('token');

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validar que los campos obligatorios no estén vacíos
    if (!name || !description || !roomsAvailable) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Crear el objeto de datos del hotel
    const hotelData = {
      name: name,
      description: description,
      rooms_available: parseInt(roomsAvailable),
    };

    // Realizar la solicitud POST a localhost:5000/hotel
    axios
      .post('http://localhost:5000/hotel', hotelData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then(response => {
        // Manejar la respuesta de éxito
        console.log('Hotel creado:', response.data);
        // Redireccionar a la página de hoteles
        history.push('/admin/hoteles');
      })
      .catch(error => {
        // Manejar los errores de la solicitud
        console.error('Error al crear el hotel:', error);
        setError('Error al crear el hotel');
      });
  };

  return (
    <>
      <Navbar />

      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <h4>Crear Hotel</h4>

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

              <div className="input-field">
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="description">Descripción</label>
              </div>

              <div className="input-field">
                <input
                  type="number"
                  id="roomsAvailable"
                  value={roomsAvailable}
                  onChange={(e) => setRoomsAvailable(e.target.value)}
                />
                <label htmlFor="roomsAvailable">Habitaciones Disponibles</label>
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

export default CreateHotel;

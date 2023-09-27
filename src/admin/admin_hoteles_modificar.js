import Navbar from '../navbar/navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

function AdminHotelModificationForm() {
  const history = useHistory();
  const { id } = useParams();
  const [token, setToken] = useState('');
  const [hotelData, setHotelData] = useState({
    name: '',
    rooms_available: 0,
    description: '',
    amenities: [],
  });

  useEffect(() => {
    // Verificar si hay un token almacenado en el almacenamiento local (localStorage)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      // Redireccionar a la página de inicio de sesión si no hay token almacenado
      history.push('/login');
    }

    // Verificar si el usuario es administrador
    axios.get('http://localhost:5000/myuser', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(response => {
        if (response.data["admin"] === 0) {
          alert(response.data["admin"])
          // Redireccionar al inicio si el usuario no es administrador
          history.push('/');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        history.push('/');
      });

    // Obtener datos del hotel para autocompletar el formulario
    axios
      .get(`http://localhost:5000/hotel/${id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then(response => {
        const hotel = response.data;
        setHotelData({
          name: hotel.name,
          rooms_available: hotel.rooms_available,
          description: hotel.description,
          amenities: hotel.amenities,
        });
        document.getElementById("rooms_available").select();
        document.getElementById("description").select();
        document.getElementById("name").select();
        document.getElementById("name").blur();
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }, [history, id, token]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setHotelData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      history.push('/login');
      return;
    }

    const { name, rooms_available, description } = hotelData;

    // Enviar datos del hotel para la modificación
    axios
      .put(`http://localhost:5000/hotel/${id}`, {
        name,
        rooms_available,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then(response => {
        console.log('Hotel modified:', response.data);
        M.toast({ html: '¡Hotel modificado exitosamente!', classes: 'green' });
      })
      .catch(error => {
        console.error('Error updating hotel:', error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <h4>Modificar Hotel</h4>
            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={hotelData.name}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="name">Nombre</label>
              </div>
              <div className="input-field">
                <input
                  type="number"
                  id="rooms_available"
                  name="rooms_available"
                  value={hotelData.rooms_available}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="rooms_available">Habitaciones Totales</label>
              </div>
              <div className="input-field">
                <textarea
                  id="description"
                  name="description"
                  className="materialize-textarea"
                  value={hotelData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <label htmlFor="description">Descripción</label>
              </div>
              <button
                className="btn waves-effect waves-light"
                type="submit"
              >
                Modificar Hotel
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHotelModificationForm;

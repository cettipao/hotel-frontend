import Navbar from '../navbar/navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import M from 'materialize-css';

// ...importaciones y código anterior...

function AdminHotels() {
  const history = useHistory();
  const [token, setToken] = useState('');
  const [hotels, setHotels] = useState([]);

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

    axios.get('http://localhost:5000/hotel', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(response => {
        const updatedHotels = response.data.hotels.map(hotel => ({
          ...hotel,
          images: hotel.images.map(image => `http://localhost:8000/${image}`)
        }));
        setHotels(updatedHotels);
        M.AutoInit();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [history]);

  const handleCreateHotel = () => {
    history.push('/admin/hoteles/crear');
  };

  const handleDeleteHotel = (hotelId, hotelName) => {
    if (window.confirm(`¿Seguro que quieres borrar a ${hotelName}?`)) {
      axios.delete(`http://localhost:5000/hotel/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          // Eliminación exitosa, actualiza la lista de hoteles
          const updatedHotels = hotels.filter(hotel => hotel.id !== hotelId);
          setHotels(updatedHotels);
          // Muestra un mensaje de éxito
          M.toast({ html: 'Hotel eliminado exitosamente', classes: 'green' });
        })
        .catch(error => {
          console.error('Error al eliminar el hotel:', error);
          // Muestra un mensaje de error
          M.toast({ html: 'Error al eliminar el hotel', classes: 'red' });
        });
    }
  };

  return (
    <>
      <Navbar />
      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <div className="col s10">
              <h4>Hoteles</h4>
            </div>
            <div className="col s2">
              <button
                className="btn waves-effect waves-light grey darken-3 right"
                onClick={handleCreateHotel}
              >
                Crear
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Habitaciones Totales</th>
                  <th>Descripción</th>
                  <th>Acciones</th> 
                </tr>
              </thead>
              <tbody>
                {hotels.map(hotel => (
                  <tr key={hotel.id}>
                    <td>{hotel.id}</td>
                    <td>
                      <Link to={`/admin/hoteles/modificar/${hotel.id}`}>{hotel.name}</Link>
                    </td>
                    <td>{hotel.rooms_available}</td>
                    <td>{hotel.description}</td>
                    <td>
                      <button
                        className="btn-floating waves-effect waves-light red"
                        onClick={() => handleDeleteHotel(hotel.id, hotel.name)}
                      >
                        <i className="material-icons">delete</i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHotels;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import M from 'materialize-css';

function AmenitiesPage() {
  const history = useHistory();
  const [token, setToken] = useState('');
  const [amenities, setAmenities] = useState([]);

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

    axios.get('http://localhost:5000/amenitie', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(response => {
        setAmenities(response.data.amenities);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [history]);

  const handleCreateAmenity = () => {
    history.push('/admin/amenities/crear');
  };

  const handleDeleteAmenitie = (amenitieId, amenitieName) => {
    if (window.confirm(`¿Seguro que quieres borrar a ${amenitieName}?`)) {
      axios.delete(`http://localhost:5000/amenitie/${amenitieId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          // Eliminación exitosa, actualiza la lista de hoteles
          const updatedAmenities = amenities.filter(amenity => amenity.id !== amenitieId);
          setAmenities(updatedAmenities);
          // Muestra un mensaje de éxito
          M.toast({ html: 'Amenitie eliminado exitosamente', classes: 'green' });
        })
        .catch(error => {
          console.error('Error al eliminar el amenitie:', error);
          // Muestra un mensaje de error
          M.toast({ html: 'Error al eliminar el amenitie', classes: 'red' });
        });
    }
  };

  return (
    <>
    <Navbar/>
      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <div className="col s10">
              <h4>Amenities</h4>
            </div>
            <div className="col s2">
              <button
                className="btn waves-effect waves-light grey darken-3 right"
                onClick={handleCreateAmenity}>
                Crear
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {amenities.map(amenity => (
                  <tr key={amenity.id}>
                    <td>{amenity.id}</td>
                    <td>
                      <Link to={`/admin/amenities/modificar/${amenity.id}`}>{amenity.name}</Link>
                    </td>
                    <td>
                      <button
                        className="btn-floating waves-effect waves-light red"
                        onClick={() => handleDeleteAmenitie(amenity.id, amenity.name)}
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

export default AmenitiesPage;

import Navbar from '../navbar/navbar';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function AdminPage() {
  const [token, setToken] = useState('');
  const history = useHistory();

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
  }, [history, token]);

  return (
    <>
      <Navbar />
      <div className="row">
        <h4 className='center'>Administrador</h4>
        <div className="col s12 m6">
          <div className="card">
            <div className="card-content">
              <span className="card-title">Hoteles</span>
              <Link to="/admin/hoteles" className="btn waves-effect waves-light grey darken-3">
                Ver Hoteles
              </Link>
            </div>
            <div className="card-action">
              <Link to="/admin/hoteles/crear" className="btn waves-effect waves-light grey darken-3">
                Crear Hotel
              </Link>
            </div>
          </div>
        </div>
        <div className="col s12 m6">
          <div className="card">
            <div className="card-content">
              <span className="card-title">Reservas</span>
              <Link to="/admin/reservas" className="btn waves-effect waves-light grey darken-3">
                Ver Reservas
              </Link>
            </div>
            <div className="card-action">
              <Link to="/admin/reservas/crear" disabled className="btn waves-effect waves-light grey darken-3">
                Crear Reserva
              </Link>
            </div>
          </div>
        </div>
        <div className="col s12 m6">
          <div className="card">
            <div className="card-content">
              <span className="card-title">Usuarios</span>
              <Link to="/admin/usuarios" className="btn waves-effect waves-light grey darken-3">
                Ver Usuarios
              </Link>
            </div>
            <div className="card-action">
              <Link to="/admin/usuarios/crear" disabled className="btn waves-effect waves-light grey darken-3">
                Crear Usuario
              </Link>
            </div>
          </div>
        </div>
        <div className="col s12 m6">
          <div className="card">
            <div className="card-content">
              <span className="card-title">Amenities</span>
              <Link to="/admin/amenities" className="btn waves-effect waves-light grey darken-3">
                Ver Amenities
              </Link>
            </div>
            <div className="card-action">
              <Link to="/admin/amenities/crear" className="btn waves-effect waves-light grey darken-3">
                Crear Amenity
              </Link>
            </div>
          </div>
        </div>
        <div className="col s12 m6">
          <div className="card">
            <div className="card-content">
              <span className="card-title">Imágenes</span>
              <Link to="/admin/imagenes" className="btn waves-effect waves-light grey darken-3">
                Ver Imágenes
              </Link>
            </div>
            <div className="card-action">
              <Link to="/admin/imagenes/crear" className="btn waves-effect waves-light grey darken-3">
                Subir Imagen
              </Link>
            </div>
          </div>
        </div>
        <div className="col s12 m6">
          <div className="card">
            <div className="card-content">
              <span className="card-title">Vincular Hotel con Amenitie</span>
              <Link to="/admin/hotel_amenitie" className="btn waves-effect waves-light grey darken-3">
                Ver Relaciones
              </Link>
            </div>
            <div className="card-action">
              <Link to="/admin/hotel_amenitie/crear" className="btn waves-effect waves-light grey darken-3">
                Crear Relacion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;

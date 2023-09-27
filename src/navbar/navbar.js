import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar si el usuario está autenticado
  const [isAdmin, setIsAdmin] = useState(false); // Estado para controlar si el usuario es administrador

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtener el token guardado en localStorage
    setIsLoggedIn(!!token); // Actualizar el estado isLoggedIn en función de si hay un token o no

    // Realizar la solicitud GET a localhost:5000/myuser
    axios
      .get('http://localhost:5000/myuser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        const userData = response.data;
        setIsAdmin(userData.admin === 1); // Actualizar el estado isAdmin en función del atributo admin en la respuesta
      })
      .catch(error => {
        console.error('Error al obtener el usuario:', error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token del localStorage
    setIsLoggedIn(false); // Actualizar el estado isLoggedIn a false
    history.push('/login'); // Redireccionar al usuario a la página de inicio de sesión
  };

  return (
    <>
      <nav>
        <div className="nav-wrapper grey darken-3">
          <a href={isAdmin ? "/admin" : "/"} className="brand-logo" style={{ marginLeft: 1 + 'em' }}>
            {isAdmin ? "Admin" : "Hoteles Online"}
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <a href="/hoteles">Hoteles</a>
            </li>
            {!isAdmin && (
              <li>
                <a href="/reservations">Mis Reservas</a>
              </li>
            )}
            {isLoggedIn ? (
              <li>
                <a href="/login" onClick={handleLogout}>
                  Logout
                </a>
              </li>
            ) : (
              <li>
                <a href="/login">Login</a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

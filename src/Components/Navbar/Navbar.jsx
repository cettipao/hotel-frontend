// import React from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthContextProvider";
// import "./login";

//falta implementar logica de que si el usuario esta logueado me muestre su nombre

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useContext(AuthContext);


  const handleLogout = async () => {
    if (localStorage.getItem('token') != undefined) {
      await logOut();
    }
  };

  if (user && user.rol === false) {
    return (
      <nav>
        <button onClick={() => navigate(-1)}>Volver</button>
        <Link to="/">Home</Link>
        {!user && <Link to="/login">Iniciar Sesion</Link>}
        {!user && <Link to="/register">Registrarse</Link>}
        {user && <button onClick={handleLogout}>Cerrar Sesion</button>}
        {user && <Link to="/perfil">Perfil</Link>}
      </nav>
    );
  } else {
    return (
      <nav>
        <button onClick={() => navigate(-1)}>Volver</button>
        {user && <button onClick={handleLogout}>Cerrar Sesion</button>}
        <Link to="/home">Home</Link>
        {!user && <Link to="/login">Iniciar Sesion</Link>}
        {!user && <Link to="/register">Registrarse</Link>}
        {user && <Link to="/perfil">Perfil</Link>}
        {user && <Link to="/admin">Modo Administrador</Link>}
      </nav>
    );
  }
};

export default Navbar;

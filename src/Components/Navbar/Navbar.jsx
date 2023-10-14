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

    return (
      <nav>
        <button onClick={() => navigate(-1)}>Volver</button>
        <Link to="/">Home</Link>
        {!user && <Link to="/login">Iniciar Sesion</Link>}
        {!user && <Link to="/register">Registrarse</Link>}
        {user && <button onClick={handleLogout}>Cerrar Sesion</button>}
      </nav>
    );
};

export default Navbar;

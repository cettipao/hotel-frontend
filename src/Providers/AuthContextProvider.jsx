import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { BASE_URL } from "../configs";
import { LOGIN_URL } from "../configs";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const getUserBookings = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/bookings/user/${userId}`);
      if (response.ok) {
        const bookingsData = await response.json();
        return bookingsData; // Retornar el arreglo de reservas directamente
      } else {
        throw new Error("Error al obtener los datos de reservas del usuario");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener los datos de reservas del usuario");
    }
  };

  const handleLogin = async (email, password) => {
    const response = await fetch(`${LOGIN_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data);
      localStorage.setItem("token", data.token);

      // console.log(data);

      return { success: true, user };
    }
    return { success: false };
  };

  const logOut = () => {
    setUser(undefined);
    localStorage.removeItem("token");
    Swal.fire({
      text: `Se ha cerrado sesión`,
      icon: "success",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
    });
    navigate("/Home");
  };

  const getUser = async () => {
    const token = localStorage.getItem("token"); // Obtener el token del almacenamiento local

    if (!token) {
      // Maneja el caso en el que el token no esté disponible, por ejemplo, el usuario no ha iniciado sesión
      console.log("No se encontró ningún token en el almacenamiento local");
      return;
    }

    const response = await fetch(`${LOGIN_URL}/myuser`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token en el encabezado de autorización
      },
    });

    if (response.ok) {
      const userData = await response.json();
      console.log(userData); // Datos del usuario
    }
  };

  const handleRegister = async (password, email, name, lastName, admin) => {
    const newUser = {
      password: password,
      email: email,
      name: name,
      last_name: lastName,
      admin: admin,
    };

    console.log(newUser);

    const createUserResponse = await fetch(`${LOGIN_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!createUserResponse.ok) {
      throw new Error("Error al registrar el usuario");
    }

    const createdUser = await createUserResponse.json();
    setUser(createdUser);
    setUser(undefined);
    return true;
  };

  const propiedades = {
    user,
    handleLogin,
    logOut,
    handleRegister,
    getUser,
    getUserBookings,
  };

  return (
    <AuthContext.Provider value={propiedades}>{children}</AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContextProvider;

import React, { useState, useContext } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { AuthContext } from "../Providers/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useContext(AuthContext);
  const { getUser } = useContext(AuthContext);

  const validationSchema = yup.object().shape({
    password: yup.string().required("Ingrese una contraseña"),
    email: yup
      .string()
      .email("Ingrese un email válido")
      .required("Ingrese un email"),
  });

  const [errors, setErrors] = useState({
    password: "",
    email: "",
  });

  const validateField = async (fieldName, value) => {
    try {
      await yup.reach(validationSchema, fieldName).validate(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: "",
      }));
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: error.message,
      }));
    }
  };
  const onLogin = async () => {
    try {
      // Validar los campos utilizando el esquema de validación
      await validationSchema.validate({
        password,
        email,
      });

      // Intentar iniciar sesión
      const { success } = await handleLogin(email, password);

      if (success) {
        // Si la autenticación es exitosa, obtén los datos del usuario solo si el usuario ha iniciado sesión
        if (localStorage.getItem("token")) {
          getUser().then(() => {
            // Luego, muestra el mensaje de bienvenida y navega al destino
            Swal.fire({
              text: `¡Bienvenido!`,
              icon: "success",
              showClass: {
                popup: "animate__animated animate__fadeInDown",
              },
            }).then(() => {
              navigate("/");
            });
          });
        } else {
          // Maneja el caso en el que el usuario no ha iniciado sesión
          Swal.fire({
            text: "Usuario no autenticado",
            icon: "warning",
          });
        }
      } else {
        Swal.fire({
          text: "Usuario o contraseña incorrectos",
          icon: "warning",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "👀",
        text: error.message,
        icon: "error",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Typography variant="h2">Iniciar Sesión</Typography>
      <TextField
        type="email"
        label="Email"
        placeholder="Ingrese su email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          validateField("email", event.target.value);
        }}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        type="password"
        label="Password"
        placeholder="Ingrese su contraseña"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          validateField("password", event.target.value);
        }}
        error={!!errors.password}
        helperText={errors.password}
      />
      <Button variant="contained" onClick={onLogin}>
        Iniciar Sesión
      </Button>
    </Box>
  );
}

export default Login;

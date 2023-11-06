import React, { useState, useContext } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { waait } from "../Components/helper";
import { AuthContext } from "../Providers/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleRegister } = useContext(AuthContext);

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("Ingrese una contraseña"),
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

  const onRegister = async () => {
    try {
      // Validar los campos utilizando el esquema de validación
      await validationSchema.validate({
        password,
        email,
      });

      // Validar el correo electrónico
      const isPVPTEmail = email.endsWith("@pvpt.com");
      const admin = isPVPTEmail ? 1 : 0; // Asignar el admin de administrador si es un correo de "@pvpt.com"
      const isRegistered = await handleRegister(
        password,
        email,
        name,
        lastName,
        admin
      );

      if (isRegistered) {
        await waait();
        Swal.fire({
          text: `Bienvenido ${name} ${lastName}`,
          icon: "success",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
        }).then(() => {
          navigate("/Login");
        });
      } else {
        Swal.fire({
          title: "👀",
          text: "No has ingresado todos los valores o tu correo o tu usuario ya se encuentra registrado",
          icon: "error",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
        }).then(() => {
          navigate("");
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
      <Typography variant="h2">Registro</Typography>
      <TextField
        type="text"
        label="Name"
        placeholder="Ingrese su nombre"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
        type="text"
        label="LastName"
        placeholder="Ingrese su apellido"
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
      />
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
      <Button variant="contained" onClick={onRegister}>
        Registrarse
      </Button>
    </Box>
  );
}

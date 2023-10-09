import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { waait } from "../Components/helper";

export function Login() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogin = async () => {
    if (!userName || !password) {
      Swal.fire({
        title: "Error",
        text: "Por favor, ingresa el usuario y la contraseña",
        icon: "error",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
      });
      return;
    }
  
    try {
      const { success, user } = await handleLogin(userName, password);
  
      if (success) {
        await waait();
        Swal.fire({
          text: `Bienvenido ${userName}`,
          icon: "success",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          text: "Usuario o contraseña incorrectos",
          icon: "warning",
        });
      }
    } catch (error) {
      Swal.fire({
        text: "Ocurrió un error al intentar iniciar sesión",
        icon: "error",
      });
    }
  };
  

  // Este es el boton y lo dirige al registro
  const onRegisterClick = () => {
    navigate("/Register");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Typography variant="h2">Login</Typography>
      <TextField
        label="Usuario"
        value={userName}
        onChange={(event) => setUserName(event.target.value)}
      />
      <TextField
        type="password"
        label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button variant="contained" onClick={onLogin}>
        Login
      </Button>

      <Button variant="contained" onClick={onRegisterClick}>
        ¿Todavía no te registraste?
      </Button>
    </Box>
  );
}
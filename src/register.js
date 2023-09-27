import Navbar from './navbar/navbar';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    dni: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/user', formData)
      .then(response => {
        // Manejar la respuesta de la solicitud
        console.log('Registro exitoso:', response.data);
        history.push('/login');
      })
      .catch(error => {
        // Manejar los errores de la solicitud
        console.error('Error al registrar:', error);
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('Error desconocido');
        }
      });
  };

  return (
    <>
    <Navbar/>
    <div className="container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name">Nombre</label>
        </div>
        <div className="input-field">
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <label htmlFor="last_name">Apellido</label>
        </div>
        <div className="input-field">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-field">
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
          />
          <label htmlFor="dni">DNI</label>
        </div>
        <div className="input-field">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Contraseña</label>
        </div>
        <button className="btn waves-effect waves-light grey darken-3" type="submit">Registrar</button>
      </form>
    </div>
    </>
  );
};

export default Register;

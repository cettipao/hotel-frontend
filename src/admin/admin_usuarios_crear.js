import Navbar from '../navbar/navbar';
import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

function CreateUser() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const storedToken = localStorage.getItem('token');

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validar que los campos obligatorios no estén vacíos
    if (!name || !lastName || !dni || !email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Crear el objeto de datos del usuario
    const userData = {
      name: name,
      last_name: lastName,
      dni: dni,
      email: email,
      password: password,
    };

    // Realizar la solicitud POST a localhost:5000/user
    axios
      .post('http://localhost:5000/user', userData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then(response => {
        // Manejar la respuesta de éxito
        console.log('Usuario creado:', response.data);
        // Redireccionar a la página de usuarios
        history.push('/admin/usuarios');
      })
      .catch(error => {
        // Manejar los errores de la solicitud
        console.error('Error al crear el usuario:', error);
        setError('Error al crear el usuario');
      });
  };

  return (
    <>
      <Navbar />

      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <h4>Crear Usuario</h4>

            {error && <p className="error-message red-text">{error}</p>}

            <form onSubmit={handleFormSubmit}>
              <div className="input-field">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="name">Nombre</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label htmlFor="lastName">Apellido</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  id="dni"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                />
                <label htmlFor="dni">DNI</label>
              </div>

              <div className="input-field">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-field">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Contraseña</label>
              </div>

              <button
                className="btn waves-effect waves-light grey darken-3"
                type="submit"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateUser;

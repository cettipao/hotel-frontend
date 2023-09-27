import Navbar from '../navbar/navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

function ModifyUser() {
  const history = useHistory();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      history.push('/login');
      return;
    }

    axios
      .get(`http://localhost:5000/user/${id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then(response => {
        const userData = response.data;
        setName(userData.name);
        setLastName(userData.last_name);
        setDni(userData.dni);
        setEmail(userData.email);
        document.getElementById("name").select();
        document.getElementById("lastName").select();
        document.getElementById("dni").select();
        document.getElementById("dni").blur();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [history, id]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validar que los campos obligatorios no estén vacíos
    if (!name || !lastName || !dni) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Crear el objeto de datos del usuario
    const userData = {
      name: name,
      last_name: lastName,
      dni: dni,
      email: email,
    };

    // Realizar la solicitud PUT a localhost:5000/user/{id}
    axios
      .put(`http://localhost:5000/user/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(response => {
        // Manejar la respuesta de éxito
        console.log('Usuario modificado:', response.data);
        // Redireccionar a la página de usuarios
        M.toast({ html: 'Usuario modificado exitosamente!', classes: 'green' });
        history.push('/admin/usuarios');
      })
      .catch(error => {
        // Manejar los errores de la solicitud
        console.error('Error al modificar el usuario:', error);
        setError('Error al modificar el usuario');
      });
  };

  return (
    <>
      <Navbar />

      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <h4>Modificar Usuario</h4>

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
                  disabled
                />
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

export default ModifyUser;

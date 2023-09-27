import Navbar from './navbar/navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

function LoginPage() {
  const history = useHistory();
  const location = useLocation();
  const requestData = location.state && location.state.requestData;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si el usuario ya está logeado
    const token = localStorage.getItem('token');
    if (token) {
      // Redirigir a la página principal
      history.push('/');
    }
  }, [history, requestData]);

  const handleLogin = (event) => {
    event.preventDefault();

    const loginData = {
      email: email,
      password: password
    };

    // Realizar la solicitud POST a http://localhost:5000/login
    axios.post('http://localhost:5000/login', loginData)
      .then(response => {
        // Manejar la respuesta de la solicitud
        const token = response.data.token;
        // Almacenar el token en el almacenamiento local (localStorage)
        localStorage.setItem('token', token);

        // Verificar si el usuario es administrador
        axios.get('http://localhost:5000/myuser', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.data["admin"] === 1) {
                    // Redireccionar al inicio si el usuario no es administrador
                    history.push('/admin');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Redirigir a la página de confirmación de reserva si hay datos de solicitud, de lo contrario, a la página principal
        console.log(requestData)
        if (requestData) {
          history.push('/confirm-reservation', { requestData });
        } else {
          history.push('/');
        }
      })
      .catch(error => {
        // Manejar los errores de la solicitud
        setError('Error al iniciar sesión. Inténtalo de nuevo.');
        console.error('Error al iniciar sesión:', error);
      });
  };

  const handleRegister = () => {
    // Redirigir a la página de registro conservando los datos de request_data
    history.push('/register', { requestData });
  };

  return (
    <>
    <Navbar/>
      <div className="row">
        <div className="col s0 m3"></div>
        <div className="col s12 m6">
          <div className="card-panel">
            <h4>Iniciar Sesión</h4>
            {error && <p className='red-text'>{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="input-field">
                <input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  required
                />
                <label>Email</label>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  required
                />
                <label>Contraseña</label>
              </div>
              <div className="row">
                <div className="col s6">
                  <button className="waves-effect waves-light btn grey darken-3" type="submit">Iniciar Sesión</button>
                </div>
                <div className="col s6">
                  <button className="waves-effect waves-light btn grey darken-3" onClick={handleRegister}>Registrarse</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col s0 m3"></div>
      </div>
    </>
  );
}

export default LoginPage;

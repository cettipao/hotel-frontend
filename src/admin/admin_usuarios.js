import Navbar from '../navbar/navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

function AdminUsers() {
  const history = useHistory();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      history.push('/login');
      return;
    }

    axios.get('http://localhost:5000/user', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(response => {
        const usersData = response.data.users;
        setUsers(usersData);
        M.AutoInit();
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }, [history]);

  const handleCreateUser = () => {
    history.push('/admin/usuarios/crear');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      axios.delete(`http://localhost:5000/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          console.log('Usuario eliminado:', response.data);
          // Volver a cargar los usuarios después de eliminar
          const updatedUsers = users.filter(user => user.id !== userId);
          setUsers(updatedUsers);
        })
        .catch(error => {
          console.error('Error al eliminar el usuario:', error);
        });
    }
  };

  const handleEditUser = (userId) => {
    history.push(`/admin/usuarios/modificar/${userId}`);
  };

  return (
    <>
      <Navbar />
      <div className="row">
        <div className="col s12">
          <div className="card-panel">
            <div className="col s10">
              <h4>Usuarios</h4>
            </div>
            <div className="col s2">
              <button disabled
                className="btn waves-effect waves-light grey darken-3 right"
                onClick={handleCreateUser}
              >
                Crear
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>DNI</th>
                  <th>Email</th>
                  <th>Administrador</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.dni}</td>
                    <td><a href={`/admin/usuarios/modificar/${user.id}`}>{user.email}</a></td>
                    <td>{user.admin === 1 ? 'Sí' : 'No'}</td>
                    <td>
                      <button
                        className="btn-small red"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUsers;

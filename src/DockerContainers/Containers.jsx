import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CONTAINERS_URL } from "../configs";
import "./containers.css";

const Containers = () => {
  const [containers, setContainers] = useState([]);
  const [deleteContainerType, setDeleteContainerType] = useState('');
  const [selectedContainerType, setSelectedContainerType] = useState('');
  const navigate = useNavigate();

  const fetchContainers = async () => {
    try {
      const response = await fetch(`${CONTAINERS_URL}/container`);
      const data = await response.json();
      setContainers(data);
    } catch (error) {
      console.error('Error al obtener los contenedores: ', error);
    }
    setTimeout(fetchContainers, 5000);
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const groupContainersByImageType = (containers) => {
    const groupedContainers = {};

    containers.forEach((container) => {
      const imageType = container.image;
      if (!groupedContainers[imageType]) {
        groupedContainers[imageType] = [];
      }
      groupedContainers[imageType].push(container);
    });

    return groupedContainers;
  };

  const renderContainersByImageType = (containers) => {
    const groupedContainers = groupContainersByImageType(containers);

    return Object.keys(groupedContainers).map((imageType) => (
      <div key={imageType} className="column">
        {groupedContainers[imageType].map((container) => (
          <div key={container.id} className="container-card">
            <h4>{container.name}</h4>
            <ul>
              <li>Image: {container.image}</li>
              <li>Status: {container.status}</li>
              <li>State: {container.state}</li>
              <li>Port: {container.port}</li>
              <li>IP: {container.ip}</li>
            </ul>
          </div>
        ))}
      </div>
    ));
  };

  const handleCreateContainer = async () => {
    try {
      if (!selectedContainerType) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, selecciona un tipo de contenedor',
        });
        return;
      }

      await fetch(`${CONTAINERS_URL}/container/${selectedContainerType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        }),
      });

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Contenedor creado con éxito',
      });

      fetchContainers();
      navigate('/containers');

    } catch (error) {
      console.error('Error al crear el contenedor: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear el contenedor',
      });
    }
  };

  const handleDeleteContainer = async () => {
    try {
      if (!deleteContainerType) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, selecciona un tipo de contenedor',
        });
        return;
      }

      const response = await fetch(`${CONTAINERS_URL}/container/${deleteContainerType}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Contenedor eliminado',
          text: 'El contenedor se ha eliminado con éxito.',
        });
        fetchContainers();
        navigate('/containers');
      } else {
        const responseData = await response.json();
        const message = responseData.error.message;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
        });
      }
    } catch (error) {
      console.error('Error al eliminar el contenedor: ', error);
    }
  };

  return (
    <div>
      <h2>Contenedores de Docker</h2>

      <div>
        <label htmlFor="containerType">Selecciona un tipo de contenedor a crear:</label>
        <select
          id="containerType"
          value={selectedContainerType}
          onChange={(e) => setSelectedContainerType(e.target.value)}
          style={{ width: 'auto', padding: '8px', margin: '5px', display: 'inline-block' }}
        >
          <option value="" disabled>
            Selecciona un tipo
          </option>
          <option value="hotel-api">Hotel API</option>
          <option value="search-api">Search API</option>
          <option value="user-res-api">User Reservation API</option>
        </select>
        <button onClick={handleCreateContainer}>Crear Contenedor</button>
      </div>

      <div>
        <label htmlFor="DeleteContainerType">Selecciona un tipo de contenedor para borrar:</label>
        <select
          id="deleteContainerType"
          value={deleteContainerType}
          onChange={(e) => setDeleteContainerType(e.target.value)}
          style={{ width: 'auto', padding: '8px', margin: '5px', display: 'inline-block' }}
        >
          <option value="" disabled>
            Selecciona un tipo
          </option>
          <option value="hotel-api">Hotel API</option>
          <option value="search-api">Search API</option>
          <option value="user-res-api">User Reservation API</option>
        </select>
        <button onClick={handleDeleteContainer}>Borrar Contenedor</button>
      </div>

      <div className="container-grid">
        {Array.isArray(containers.containers) && containers.containers.length > 0 ? (
          renderContainersByImageType(containers.containers)
        ) : (
          <p>No hay contenedores disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Containers;

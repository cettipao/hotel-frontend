import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import "./containers.css";
import { CONTAINERS_URL } from "../configs";

const Containers = () => {
  const [containers, setContainers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedContainerType, setSelectedContainerType] = useState('');
  const [searchContainerType, setSearchContainerType] = useState('all');
  const [deleteContainerType, setDeleteContainerType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        let url = `${CONTAINERS_URL}/container`;
        if (searchContainerType !== 'all') {
          url = `${CONTAINERS_URL}/container/${searchContainerType}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setContainers(data);
      } catch (error) {
        console.error('Error al obtener los contenedores: ', error);
      }
    };

    fetchContainers();
  }, [searchContainerType]);

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
      await fetch(`${CONTAINERS_URL}/container/${deleteContainerType}`, {
        method: 'DELETE',
      });
      Swal.fire({
        icon: 'success',
        title: 'Contenedor eliminado',
        text: 'El contenedor se ha eliminado con éxito.',
      });
      fetchContainers();
      navigate('/containers');

    } catch (error) {
      console.error('Error al eliminar el contenedor: ', error);
    }
  };

  return (
    <div>
      <h2>Contenedores de Docker</h2>
      <div>
        <label htmlFor="searchContainerType">Selecciona un tipo de contenedor para buscar:</label>
        <select
          id="searchContainerType"
          value={searchContainerType}
          onChange={(e) => setSearchContainerType(e.target.value)}
          defaultValue="all"
          style={{ width: 'auto', padding: '8px', margin: '5px', display: 'inline-block' }}
        >
          <option value="all">Mostrar todos</option>
          <option value="hotel-api">Hotel API</option>
          <option value="search-api">Search API</option>
          <option value="user-res-api">User Reservation API</option>
          </select>
      </div>
      <div>
        <label htmlFor="DeleteContainerType">Selecciona un tipo de contenedor para borrar:</label>
        <select
          id="deleteContainerType"
          value={deleteContainerType}
          onChange={(e) => setDeleteContainerType(e.target.value)}
          style={{ width: 'auto', padding: '8px', margin: '5px', display: 'inline-block' }}
        >
          <option value="hotel-api">Hotel API</option>
          <option value="search-api">Search API</option>
          <option value="user-res-api">User Reservation API</option>
          </select>
          <button onClick={handleDeleteContainer}>Borrar Contenedor</button>
      </div>
      <button onClick={() => setShowDropdown(true)}>
        <FontAwesomeIcon icon={faPlus} style={{ marginLeft: '10px', cursor: 'pointer' }} />
      </button>
      {showDropdown && (
        <div>
          <label htmlFor="containerType">Selecciona un tipo de contenedor:</label>
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
      )}
      <div className="container-grid">
        {Array.isArray(containers.containers) ? (
          containers.containers.map((container) => (
            <div key={container.id} className="container-card">
              <h3>{container.name}</h3>
              <p>Image: {container.image}</p>
              <p>Status: {container.status}</p>
              <p>State: {container.state}</p>
              <p>Port: {container.port}</p>
              <p>IP: {container.ip}</p>
            </div>
          ))
        ) : (
          <p>No hay contenedores disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Containers;

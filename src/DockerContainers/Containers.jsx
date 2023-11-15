import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { CONTAINERS_URL } from "../configs";

const Containers = () => {
  const [containers, setContainers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedContainerType, setSelectedContainerType] = useState('');
  const [searchContainerType, setSearchContainerType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        let url = `${CONTAINERS_URL}/container`;
        if (searchContainerType) {
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

      await fetch(`${CONTAINERS_URL}/containers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedContainerType,
        }),
      });

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Contenedor creado con éxito',
      });

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

  return (
    <div>
      <h2>Contenedores de Docker</h2>
      <div>
        <label htmlFor="searchContainerType">Selecciona un tipo de contenedor para buscar:</label>
        <select
          id="searchContainerType"
          value={searchContainerType}
          onChange={(e) => setSearchContainerType(e.target.value)}
        >
          <option value="">
            Mostrar todos
          </option>
          <option value="hotel-api">Hotel API</option>
          <option value="search-api">Search API</option>
          <option value="user-res-api">User Reservation API</option>
        </select>
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
        {containers.map((container) => (
          <div key={container.id} className="container-card">
            <Link to={`/container-details/${container.id}`}>
              <h3>{container.name}</h3>
            </Link>
            <p>Image: {container.image}</p>
            <p>Status: {container.status}</p>
            <p>State: {container.state}</p>
            <p>Port: {container.port}</p>
            <p>IP: {container.ip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Containers;

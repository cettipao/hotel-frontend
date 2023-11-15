import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CONTAINERS_URL } from "../configs";

const ContainerDetails = () => {
  const [container, setContainer] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContainerDetails = async () => {
      try {
        const response = await fetch(`${CONTAINERS_URL}/container/${id}`);
        const data = await response.json();
        setContainer(data);
      } catch (error) {
        console.error('Error al obtener detalles del contenedor: ', error);
      }
    };

    fetchContainerDetails();
  }, [id]);

  const handleDeleteContainer = async () => {
    try {
      await fetch(`${CONTAINERS_URL}/container/${id}`, {
        method: 'DELETE',
      });
      Swal.fire({
        icon: 'success',
        title: 'Contenedor eliminado',
        text: 'El contenedor se ha eliminado con éxito.',
      });
      navigate('/containers');

    } catch (error) {
      console.error('Error al eliminar el contenedor: ', error);
    }
  };

  if (!container) {
    return <div>No se ha encontrado el contenedor</div>;
  }

  return (
    <div>
      <div className='details'>
        <h2>Detalles del Contenedor</h2>
        <h4>{container.name}</h4>
        <p>Image: {container.image}</p>
        <p>Status: {container.status}</p>
        <p>State: {container.state}</p>
        <p>Port: {container.port}</p>
        <p>IP: {container.ip}</p>
      </div>
      <div className='deleteContainer'>
        <button onClick={handleDeleteContainer}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default ContainerDetails;

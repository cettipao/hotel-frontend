import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const ImagePage = () => {
  const history = useHistory();
  const [images, setImages] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Verificar si hay un token almacenado en el almacenamiento local (localStorage)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      // Redireccionar a la página de inicio de sesión si no hay token almacenado
      history.push('/login');
    }

    // Verificar si el usuario es administrador
    axios.get('http://localhost:5000/myuser', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(response => {
        if (response.data["admin"] === 0) {
          alert(response.data["admin"])
          // Redireccionar al inicio si el usuario no es administrador
          history.push('/');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        history.push('/');
      });


    axios
      .get('http://localhost:5000/image')
      .then(response => {
        setImages(response.data.images);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [history]);

  const getHotelData = async (hotelId) => {
    try {
      const response = await axios.get(`http://localhost:5000/hotel/${hotelId}`);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleCreateImagen = () => {
    history.push('/admin/imagenes/crear');
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm(`¿Seguro que quieres borrar la imagen ${imageId}?`)) {
      axios.delete(`http://localhost:5000/image/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          // Eliminación exitosa, actualiza la lista de hoteles
          const updatedList = images.filter(image => image.id !== imageId);
          setImages(updatedList);
          // Muestra un mensaje de éxito
          M.toast({ html: 'Imagen eliminada exitosamente', classes: 'green' });
        })
        .catch(error => {
          console.error('Error al eliminar la imagen:', error);
          // Muestra un mensaje de error
          M.toast({ html: 'Error al eliminar la imagen', classes: 'red' });
        });
    }
  };

  return (
    <>
      <Navbar />
      <div className="row">
        <div className="col s12">
          <div className="card">
            <div className="card-content">
            <div className="col s10">
              <h4>Imagenes</h4>
            </div>
            <div className="col s2">
              <button
                className="btn waves-effect waves-light grey darken-3 right"
                onClick={handleCreateImagen}>
                Subir
              </button>
            </div>
              {images.length > 0 ? (
                <table className="highlight">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Imagen</th>
                      <th>Hotel</th>
                      <th>Acciones</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {images.map(image => (
                      <tr key={image.id}>
                        <td>{image.id}</td>
                        <td>
                          <img
                            src={`http://localhost:8000/${image.path}`}
                            alt={`Imagen ${image.id}`}
                            style={{ width: '200px', height: 'auto' }}
                          />
                        </td>
                        <td>
                          <HotelInfo hotelId={image.hotel_id} getHotelData={getHotelData} />
                        </td>
                        <td>
                      <button
                        className="btn-floating waves-effect waves-light red"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <i className="material-icons">delete</i>
                      </button>
                    </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No hay imágenes disponibles.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const HotelInfo = ({ hotelId, getHotelData }) => {
  const [hotelData, setHotelData] = useState(null);

  useEffect(() => {
    const fetchHotelData = async () => {
      const data = await getHotelData(hotelId);
      setHotelData(data);
    };
    fetchHotelData();
  }, [hotelId, getHotelData]);

  return (
    <div>
      {hotelData ? (
        <>
          <p>Name: {hotelData.name}</p>
          <p>Rooms Available: {hotelData.rooms_available}</p>
          <p>Description: {hotelData.description}</p>
          <p>Amenities: {hotelData.amenities}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ImagePage;

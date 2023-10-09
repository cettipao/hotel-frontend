import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../configs';

const HotelDetails = () => {
  const { hotelId } = useParams();
  const [hotelDetails, setHotelDetails] = useState(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/hotel/${hotelId}/booking`);
        const data = await response.json();
        setHotelDetails(data);
      } catch (error) {
        console.error('Error al obtener los detalles del hotel:', error);
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

  if (!hotelDetails) {
    return <p>Cargando detalles del hotel...</p>;
  }

  return (
    <div>
      <h2>Detalles del Hotel</h2>
      <p>Nombre: {hotelDetails.name}</p>
      <p>Dirección: {hotelDetails.address}</p>
      <p>Descripción: {hotelDetails.description}</p>
    </div>
  );
};

export default HotelDetails;
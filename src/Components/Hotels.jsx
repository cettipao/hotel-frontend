import { useEffect, useState } from "react";
import Card from "./Card";
import "./../Home/home.css";
import { BASE_URL } from "../configs";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Hotels = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);

    const getHotels = async () => {
        try {
            const response = await fetch(`${BASE_URL}/hotel`);
            const data = await response.json();
            setHotels(data.hotels);
        } catch (error) {
            console.error('Error al obtener los hoteles:', error);
            Swal.fire({
                text: `Error al obtener los hoteles existentes`,
                icon: "error",
                showClass: {
                  popup: "animate__animated animate__fadeInDown",
                },
            })
        }
    };

  useEffect(() => {
    getHotels();
  }, []);

  return (
    <div className="SeccionHoteles">
      <div className="HotelCard">
        {hotels?.length ? (
          hotels.map((hotel) => (
            <Card
              key={hotel.id}
              hotelId={hotel.id}
              images={hotel.images}
              name={hotel.name}
              onClick={() => navigate(`/hotel/${hotel.id}`)}
            />
          ))
        ) : (
          <p>No hay hoteles disponibles</p>
        )}
      </div>
    </div>
  );
};

export default Hotels;

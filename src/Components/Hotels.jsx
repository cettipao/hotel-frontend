import { useEffect, useState } from "react";
import Card from "./Card";
import "./../Home/home.css";
import { BASE_URL } from "../configs";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const infoHotel = `${BASE_URL}/hotels`;

const Hotels = ({startDate, endDate}) => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);

    const getHotels = async () => {
        try {
            const response = await fetch(infoHotel);
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

  console.log(hotels);

  return (
    <div className="SeccionHoteles">
      <div className="HotelCard">
        {hotels?.length ? (
          hotels.map((hotel) => (
            <Card
              key={hotel.id}
              hotelId={hotel.id}
              name={hotel.name}
              onClick={() => navigate(`/hotel/${hotel.id}/${startDate}/${endDate}`)}
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

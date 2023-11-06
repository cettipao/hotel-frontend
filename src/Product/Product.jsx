import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LOGIN_URL, BASE_URL, IMAGES_URL } from "../configs";
import "./product.css";
import { AuthContext } from "../Providers/AuthContextProvider";
import Swal from "sweetalert2";

const Product = () => {
  const { user } = useContext(AuthContext);
  const [hotel, setHotel] = useState(null);
  const { id, startDate, endDate, selectedCity } = useParams();
  // const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const startDateBooking = new Date(startDate);

  const year = startDateBooking.getFullYear();
  const month = startDateBooking.getMonth() + 1;
  const day = startDateBooking.getDate();

  const endDateBooking = new Date(endDate);

  const yearEnd = endDateBooking.getFullYear();
  const monthEnd = endDateBooking.getMonth() + 1;
  const dayEnd = endDateBooking.getDate();

  const formattedDateStart = `${year}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
  const formattedDateEnd = `${yearEnd}-${String(monthEnd).padStart(
    2,
    "0"
  )}-${String(dayEnd).padStart(2, "0")}`;

  const getHotel = async () => {
    const response = await fetch(`${BASE_URL}/hotel/${id}`);
    const resolve = await response.json();
    setHotel(resolve);
  };

  useEffect(() => {
    getHotel();
    if (user && (!startDate || !endDate || !selectedCity)) {
      Swal.fire({
        text: "Seleccione los datos de busqueda desde la Home para poder reservar ",
        icon: "warning",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
      });
    } else {
      if (!user) {
        Swal.fire({
          text: "Debes iniciar Sesion para poder Reservar",
          icon: "warning",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
        });
      }
    }
  }, []);
  
  const createBooking = async () => {
    const newBooking = {
      "check-in": formattedDateStart,
      "check-out": formattedDateEnd,
      "hotel-id": hotel.id,
    };

    console.log(hotel.id);
  
    const token = localStorage.getItem("token");
  
    try {
      const createBookingResponse = await fetch(`${LOGIN_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBooking),
      });
  
      if (!createBookingResponse.ok) {
        Swal.fire({
          text: "Registro del booking no se ha podido realizar",
          icon: "error",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
        });
        throw new Error("Error al registrar el booking");
      }
  
      Swal.fire({
        text: "Registro del booking exitoso",
        icon: "success",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
      });
      console.log(newBooking);
  
      const createdBooking = await createBookingResponse.json();
      console.log(createdBooking);
    } catch (error) {
      Swal.fire({
        text: "Ocurrió un error al realizar la reserva",
        icon: "error",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
      });
      console.log(error);
    }
  };

  const handleSlideChange = (direction) => {
    if (hotel && hotel.images) {
      const newIndex = (activeIndex + hotel?.images?.length + direction) % hotel?.images?.length;
      setActiveIndex(newIndex);
    }
  };
  
  const showArrows = hotel?.images?.length > 1;
  
  return (
    <div className="detailsHotel">
      <h1>Detalles del hotel seleccionado</h1>
      <div className="detailEach">
        {hotel?.images?.length > 0 ? (
          <div className="arrows">
            {showArrows && (
              <button
                className={`prev-arrow ${activeIndex === 0 ? "hidden" : ""}`}
                onClick={() => handleSlideChange(-1)}
              >
                &lt;
              </button>
            )}
            <img
              src={`${IMAGES_URL}/${hotel?.images[activeIndex]}`}
              alt="Imagen del producto"
              className="hotelImage"
            />
            {showArrows && (
              <button
                className={`next-arrow ${activeIndex === hotel?.images?.length - 1 ? "hidden" : ""}`}
                onClick={() => handleSlideChange(1)}
              >
                &gt;
              </button>
            )}
          </div>
        ) : (
          <p>No se encontraron imágenes para este producto.</p>
        )}
        <div className="details">
          <h3>Hotel: {hotel?.name}</h3>
          <p>Id: {hotel?.id}</p>
          <p>Ciudad: {hotel?.city}</p>
          <p>Descripcion: {hotel?.description}</p>
          <p>Amenities: {hotel?.amenities?.join(', ')}</p>
  
          {user && startDate && endDate /*&& selectedCity */&& (
            <button className="bookingButton" onClick={createBooking}>
              Reservar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../configs";
import "./product.css";
import { AuthContext } from "../Providers/AuthContextProvider";
import Swal from "sweetalert2";

//const BOOKING_URL = `${BASE_URL}/booking`;

const Product = () => {
  const { user } = useContext(AuthContext);
  const [hotel, setHotel] = useState(null);
  const { id, startDate, endDate, city } = useParams();
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const startDateBooking = new Date(startDate);

  const year = startDateBooking.getFullYear();
  const month = startDateBooking.getMonth() + 1;
  const day = startDateBooking.getDate();

  const endDateBooking = new Date(endDate);

  const yearEnd = endDateBooking.getFullYear();
  const monthEnd = endDateBooking.getMonth() + 1;
  const dayEnd = endDateBooking.getDate();

  const formattedDateStart = `${year}/${String(month).padStart(
    2,
    "0"
  )}/${String(day).padStart(2, "0")}`;
  const formattedDateEnd = `${yearEnd}/${String(monthEnd).padStart(
    2,
    "0"
  )}/${String(dayEnd).padStart(2, "0")}`;

  const getHotel = async () => {
    console.log("ID:", id);
    const response = await fetch(`${BASE_URL}/hotel/${id}`);
    const resolve = await response.json();
    console.log(resolve);
    setHotel(resolve);
  };

  useEffect(() => {
    getHotel();
    if (user && (!startDate || !endDate)) {
      Swal.fire({
        text: "Seleccione los datos de busqueda para reservar en la Home",
        icon: "warning",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
      });
    }
  }, []);

  const createBooking = async () => {
    const newBooking = {
      user_id: user.id,
      date_from: formattedDateStart,
      date_to: formattedDateEnd,
      hotel_id: hotel.id,
    };

    try {
      const createBookingResponse = await fetch(`${BASE_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    const newIndex = (activeIndex + images.length + direction) % images.length;
    setActiveIndex(newIndex);
  };

  const showArrows = images.length > 1;

  return (
    <div className="detailsHotel">
      <h1>Detalles del hotel seleccionado: </h1>
      <div className="detailEach">
        {images.length > 0 ? (
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
              src={`${BASE_URL}/${images[activeIndex]?.url}`}
              alt="Imagen del producto"
              className="hotelImage"
            />
            {showArrows && (
              <button
                className={`next-arrow ${
                  activeIndex === images.length - 1 ? "hidden" : ""
                }`}
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
          <p>Descripcion: {hotel?.description}</p>
          <p>Disponibilidad: {hotel?.availability}</p>
          {user &&
            startDateBooking &&
            endDateBooking &&
            city && ( // Update the parentheses
              <button className="bookingButton" onClick={createBooking}>
                Reservar
              </button>
            )}
        </div>
      </div>
      <h4>Amenities</h4>
      <div className="Amenities">
        <p>Aca es donde se insertarian los amenities</p>
      </div>
    </div>
  );
};

export default Product;

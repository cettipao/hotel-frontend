import { useEffect, useState } from "react";
import "./../Home/home.css";
import { BASE_URL } from "../configs";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import Hotels from "./Hotels";
import Swal from "sweetalert2";

const formatDate = (date) => {
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const year = date.toLocaleString("default", { year: "numeric" });
  return `${year}-${month}-${day}`;
};

const DatePicker = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hotelsShow, setHotelsShow] = useState([]);
  const cities = ["city", "city2", "city3"];

  useEffect(() => {
    const startPicker = document.querySelector(".start-datepicker");
    const endPicker = document.querySelector(".end-datepicker");

    const startOptions = {
      format: "yyyy-mm-dd",
      autoClose: true,
      onSelect: function (startDate) {
        setStartDate(startDate);
      },
    };

    const endOptions = {
      format: "yyyy-mm-dd",
      autoClose: true,
      onSelect: function (endDate) {
        setEndDate(endDate);
      },
    };

    window.M.Datepicker.init(startPicker, startOptions);
    window.M.Datepicker.init(endPicker, endOptions);

    return () => {
      window.M.Datepicker.getInstance(startPicker).destroy();
      window.M.Datepicker.getInstance(endPicker).destroy();
    };
  }, []);

  // console.log(startDate, endDate);

  const handleSubmit = async () => {
    try {
      if (!selectedCity || !startDate || !endDate) {
        Swal.fire({
          title: "Error",
          text: "Por favor, selecciona ciudad y ambas fechas",
          icon: "error",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
        });
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to the start of today
      const selectedStartDate = new Date(startDate);

      if (selectedStartDate < today) {
        Swal.fire({
          title: "Error",
          text: "La fecha de inicio no puede ser anterior a hoy",
          icon: "error",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
        });
        return;
      }

      if (startDate > endDate) {
        Swal.fire({
          title: "Error",
          text: "Fechas no válidas",
          icon: "error",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
        });
        return;
      }

      const formattedStartDate = formatDate(new Date(startDate));
      const formattedEndDate = formatDate(new Date(endDate));

      const hotelsResponse = await fetch(
        `${BASE_URL}/availability/${formattedStartDate}/${formattedEndDate}/${selectedCity}`
      );
      const hotelsData = await hotelsResponse.json();

      const keys = Object.keys(hotelsData);
      const filteredHotels = [];

      for (const key of keys) {
        const hotelArray = hotelsData[key];

        for (const hotel of hotelArray) {
          if(hotel.availability === true){
            filteredHotels.push(hotel);
            // console.log("Hotel Disponible: ", hotel);
          }
        }
      }
      setHotelsShow(filteredHotels);
    } catch (error) {
      console.error("Error al obtener los hoteles o la disponibilidad:", error);
    }
  };

  return (
    <div className="dateDiv">
      <section className="datePicker">
        <section className="datePickerSection">
          <label htmlFor="start-date">Fecha Desde</label>
          <input type="text" id="start-date" className="start-datepicker" />
        </section>
        <section className="datePickerSection">
          <label htmlFor="end-date">Fecha Hasta</label>
          <input type="text" id="end-date" className="end-datepicker" />
        </section>

        <section className="citySelection">
          <label htmlFor="city">Ciudad</label>
          <select
            id="city"
            value={selectedCity}
            className="browser-default"
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value=""></option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </section>
      </section>

      <button onClick={handleSubmit} className="dateButton">
        Enviar fechas
      </button>

      <div className="SeccionHoteles">
        <h2>Hoteles en las fechas seleccionadas:</h2>
        <div className="HotelCard">
          {hotelsShow.length ? (
            hotelsShow.map((hotel) => (
              <Card
                key={hotel.id}
                hotelId={hotel.id}
                images={hotel.images}
                name={hotel.name}
                onClick={() => {
                  navigate(`/hotel/${hotel.id}/${startDate}/${endDate}/${selectedCity}`);
                }}
              />
            ))
          ) : (
            <p>No hay hoteles disponibles</p>
          )}
        </div>
      </div>
      <h2>Todos los hoteles:</h2>
      <Hotels/>
    </div>
  );
};

export default DatePicker;

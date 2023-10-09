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
  // const [hotels, setHotels] = useState([]);
  const [hotelsShow, setHotelsShow] = useState([]);
  // const [hotelAvailability, setHotelAvailability] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  console.log(startDate, endDate);

  const handleSubmit = async () => {
    try {
      if (!startDate || !endDate) {
        Swal.fire({
          title: "Error",
          text: "Por favor, selecciona ambas fechas",
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

      const hotelsResponse = await fetch(`${BASE_URL}/hotels`);
      const hotelsData = await hotelsResponse.json();
      // setHotels(hotelsData);
      console.log(hotelsData);

      const filteredHotels = [];

      const keys = Object.keys(hotelsData);
      for (const key of keys) {
        const hotel = hotelsData[key];
        for (const hotelA of hotel) {
          const hotelID = hotelA.id;
          const availabilityResponse = await fetch(
            `${BASE_URL}/booking/no-availability/${hotelID}/${formatDate(
              startDate
            )}/${formatDate(endDate)}`
          );
          const isAvailable = await availabilityResponse.json();

          if (isAvailable) {
            filteredHotels.push(hotelA);
          }

          // if (availabilityData != null) {
          //   const startDateComp = new Date(startDate);
          //   const endDateComp = new Date(endDate);
          //   let isAvailable = true;
          //   for (const date of availabilityData) {
          //     let countdata = 0;
          //     const unavailableDate = new Date(date);
          //     if (unavailableDate >= startDateComp && unavailableDate <= endDateComp) {
          //       for (const dateNo of availabilityData) {
          //         const unavailableDate = new Date(dateNo);
          //         if (unavailableDate >= startDateComp && unavailableDate <= endDateComp) {
          //           countdata++;
          //         }
          //         if (countdata-1 > hotelA.rooms) {
          //           isAvailable = false;
          //           break;
          //         }
          //       }
          //     }
          //   }

          //   if (isAvailable) {
          //     filteredHotels.push(hotelA);
          //   }
          // } else {
          //   filteredHotels.push(hotelA);
          // }
        }
        setHotelsShow(filteredHotels);
      }
    } catch (error) {
      console.error("Error al obtener los hoteles o la disponibilidad:", error);
    }
  };

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
                name={hotel.name}
                hotelId={hotel.id}
                onClick={() =>
                  navigate(`/hotel/${hotel.id}/${startDate}/${endDate}`)
                }
              />
            ))
          ) : (
            <p>No hay hoteles disponibles</p>
          )}
        </div>
      </div>
      <h2>Todos los hoteles:</h2>
      <Hotels startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default DatePicker;

import { useEffect, useState } from "react";
import "./../Home/home.css";
import { IMAGES_URL } from "../configs";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

const Card = ({name,images, onClick }) => {
  // const [images, setImages] = useState([]);

  // const getImagesByHotelId = async (hotelId) => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/image/hotel/${hotelId}`);
  //     const data = await response.json();
  //     setImages(data.images);
  //   } catch (error) {
  //     console.error('Error al obtener las imágenes del hotel:', error);
  //     Swal.fire({
  //       text: 'Error al obtener las imágenes del hotel',
  //       icon: 'error',
  //       showClass: {
  //         popup: 'animate__animated animate__fadeInDown',
  //       },
  //     });
  //   }
  // };

  // useEffect(() => {
  //   getImagesByHotelId(hotelId);
  // }, [hotelId]);


  if (images!=undefined) {
    var imageUrl = images.length > 0 ? `${IMAGES_URL}/${images[0]}` : "";
  }

  return (
    <div className="eachCard" onClick={onClick}>
      {{images} && <img src={imageUrl} alt="hotel" />}
      <h6 className="nombreHotel">{name}</h6>
    </div>
  );
};

export default Card;


import Navbar from './navbar/navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';


function ReservationPage() {
    const [rooms, setRooms] = useState([]);
    const [requestData, setRequestData] = useState(null);
    const history = useHistory();

    useEffect(() => {
        M.AutoInit();
        var elems = document.querySelectorAll('.datepicker');
        var options = {
            format: 'dd/mm/yyyy',
        };
        M.Datepicker.init(elems, options);}, []);

    const parseDate = (dateString) => {
        const parts = dateString.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const initialDate = formData.get('initial_date');
        const finalDate = formData.get('final_date');

        // Verificar si initialDate es anterior a finalDate
        const initialDateObj = new Date(parseDate(initialDate));
        const finalDateObj = new Date(parseDate(finalDate));
        if (initialDateObj >= finalDateObj) {
            // Mostrar un mensaje de error o realizar alguna acción adicional
            alert('La fecha inicial debe ser anterior a la fecha final');
            return;
        }

        const requestData = {
            initial_date: initialDate,
            final_date: finalDate,
        };

        // Establece los datos del formulario en el estado
        setRequestData(requestData);

        // Realizar la solicitud a la API
        axios
            .get('http://localhost:5000/rooms-available', {
                params: requestData
            })
            .then(response => {
                console.log(response);
                setRooms(response.data.rooms);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };


    const handleReservationClick = (hotelId) => {
        const updatedRequestData = {
            ...requestData,
            hotel_id: hotelId
        };

        history.push('/confirm-reservation', { requestData: updatedRequestData });
    };


    return (
        <>
            <Navbar />
            <div className="row">
                <div className="col s12">
                    <div className="card-panel">
                        <form onSubmit={handleSubmit}>
                            <h4>Buscar Hotel</h4>
                            <div className="row">
                                <div className="col s12 m6">
                                    <div className='grey-text'>Fecha Inicio</div>
                                    <input name="initial_date" type="text" className="datepicker" required />
                                </div>
                                <div className="col s12 m6">
                                    <div className='grey-text'>Fecha Final</div>
                                    <input name="final_date" type="text" className="datepicker" required />
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn waves-effect waves-light grey darken-3 left" type="submit" name="action">
                                    Ver Disponibilidad
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col s12">
                    <ul className="collection with-header">
                        <li className="collection-header">
                            <h4>Habitaciones Disponibles</h4>
                        </li>
                        {rooms.length > 0 ? (
                            rooms.map((hotel, index) => (
                                <li className="collection-item" key={index}>
                                    <h5>{hotel.name}</h5>
                                    {hotel.rooms_available > 0 ? (
                                        <ul>
                                            {Array.from({ length: hotel.rooms_available }, (_, roomIndex) => (
                                                <li className="collection-item" key={roomIndex}>
                                                    Habitación
                                                    <button onClick={() => handleReservationClick(hotel.hotel_id)} className="secondary-content">
                                                        <i className="material-icons grey-text">send</i>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div>No hay habitaciones disponibles.</div>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="collection-item">No se encontraron resultados.</li>
                        )}
                    </ul>


                </div>
            </div>

        </>
    );
}

export default ReservationPage;
import "./../Home/home.css";
import DatePicker from "../Components/DatePicker";

const Home = () => {

  return (
    <div>
      <h1>HOTELES</h1>
      <h6>Elija las fechas:</h6>
      <DatePicker />
    </div>
  );
};

export default Home;

import "./App.css";
import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData from "./services/weatherService";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [query, setQuery] = useState({ q: "Cork" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const message = query.q ? query.q : "current location.";

      toast.info("Fetching weather for " + message);

      await getFormattedWeatherData({ ...query, units }).then((data) => {
        toast.success(
          `Successfully fetched weather for ${data.name}, ${data.country}.`
        );

        setWeather(data);
      });
    };

    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "https://media.istockphoto.com/photos/red-sunset-picture-id510322864?k=20&m=510322864&s=612x612&w=0&h=duDOTqY6KWQ9m9HhEqhcriFqHhybgneSFIy55MZF1fo=";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return 'https://media.istockphoto.com/photos/watzmann-in-alps-dramatic-reflection-at-sunset-national-park-picture-id1136834574?k=20&m=1136834574&s=612x612&w=0&h=Mr2LOsCOOguErmwDGCMV61u0D_vKGa-xO-EEydwA8a4=';

    return "https://media.istockphoto.com/photos/red-sunset-picture-id510322864?k=20&m=510322864&s=612x612&w=0&h=duDOTqY6KWQ9m9HhEqhcriFqHhybgneSFIy55MZF1fo=";
  };

  return (
    <div className="container"
      style={{backgroundImage: `url(${formatBackground()})`}}
    >
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

      {weather && (
        <div>
          <TimeAndLocation weather={weather} />
          <TemperatureAndDetails weather={weather} />

          <Forecast title="hourly forecast" items={weather.hourly} />
          <Forecast title="daily forecast" items={weather.daily} />
        </div>
      )}

      <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />
    </div>
  );
}

export default App;

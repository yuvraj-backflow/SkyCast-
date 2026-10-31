import { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import WeatherMap from "./components/WeatherMap";
import WeatherDetails from "./components/WeatherDetails";
import FavouriteCities from "./components/FavouriteCities";
import SearchHistory from "./components/SearchHistory";
import TemperatureChart from "./components/TemperatureChart";
import SevenDayForecast from "./components/SevenDayForecast";

// The Vite proxy sends every /api request to Spring Boot on localhost:8080.
const API = "";

export default function App() {
  const [query, setQuery] = useState("Ahmedabad");
  const [weather, setWeather] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [sevenDayForecast, setSevenDayForecast] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSideData();
    searchWeather("Ahmedabad");
  }, []);

  // Load favourites and history from your Spring Boot controllers.
  async function loadSideData() {
    const [favouritesResult, historyResult] = await Promise.allSettled([
      fetch(`${API}/api/favourite`).then((response) => response.ok ? response.json() : []),
      fetch(`${API}/api/Search`).then((response) => response.ok ? response.json() : [])
    ]);

    if (favouritesResult.status === "fulfilled") setFavourites(favouritesResult.value);
    if (historyResult.status === "fulfilled") setHistory(historyResult.value);
  }

  // OpenStreetMap needs latitude and longitude to place the city marker.
  async function locateCity(city) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(city)}`);
      const data = await response.json();
      return data[0] ? { lat: Number(data[0].lat), lon: Number(data[0].lon) } : null;
    } catch {
      return null;
    }
  }

  async function loadHourlyForecast(coords) {
    if (!coords) return setForecast([]);
    try {
      const response = await fetch(`${API}/api/hourly?lat=${coords.lat}&lon=${coords.lon}`);
      setForecast(response.ok ? (await response.json()).slice(0, 24) : []);
    } catch {
      setForecast([]);
    }
  }

  async function loadSevenDayForecast(coords) {
    if (!coords) return setSevenDayForecast([]);
    try {
      const response = await fetch(`${API}/api/daily?lat=${coords.lat}&lon=${coords.lon}`);
      setSevenDayForecast(response.ok ? await response.json() : []);
    } catch {
      setSevenDayForecast([]);
    }
  }

  async function searchWeather(city = query) {
    const cleanCity = city.trim();
    if (!cleanCity) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API}/api/${encodeURIComponent(cleanCity)}`);
      if (!response.ok) throw new Error("City not found. Try another city.");

      const data = await response.json();
      setWeather(data);
      setQuery(data.city);

      const coords = await locateCity(data.city);
      setCoordinates(coords);
      loadHourlyForecast(coords);
      loadSevenDayForecast(coords);
      loadSideData(); // The backend saves the successful search in history.
    } catch (error) {
      setMessage(error.message || "Could not load weather data.");
    } finally {
      setLoading(false);
    }
  }

  async function addFavourite() {
    if (!weather) return;
    try {
      const response = await fetch(`${API}/api/favourite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: weather.city })
      });
      if (!response.ok) throw new Error("Could not add favourite.");
      loadSideData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function removeFavourite(id) {
    await fetch(`${API}/api/favourite/${id}`, { method: "DELETE" });
    loadSideData();
  }

  // Uses the delete endpoint you already made in SearchController.
  async function deleteSearchHistory(city) {
    await fetch(`${API}/api/Search/${encodeURIComponent(city)}`, { method: "DELETE" });
    loadSideData();
  }

  return (
    <main className="app-shell">
      <Header />
      <SearchBar query={query} onQueryChange={setQuery} onSearch={searchWeather} loading={loading} message={message} />

      <section className="dashboard">
        <WeatherCard weather={weather} onAddFavourite={addFavourite} />
        <WeatherMap coordinates={coordinates} city={weather?.city} />
        <TemperatureChart forecast={forecast} />
        <FavouriteCities favourites={favourites} onSelectCity={searchWeather} onRemove={removeFavourite} />
        <SearchHistory history={history} onSelectCity={searchWeather} onDelete={deleteSearchHistory} />
        <SevenDayForecast forecast={sevenDayForecast} />
        <WeatherDetails weather={weather} />
      </section>
    </main>
  );
}

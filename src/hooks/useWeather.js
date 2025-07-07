import { useState, useEffect } from "react";



export default function useWeather(defaultCity, apiKey) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [city, setCity] = useState(defaultCity);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (cityName) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`
      );
      const data = await res.json();

      if (data.cod === "404") {
        setError("City not found. Please enter a valid city name.");
        setWeatherData(null);
        setForecast(null);
        return;
      }

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`
      );
      const forecastData = await forecastRes.json();

      if (!forecastData.list) {
        setError("Forecast not available for this city.");
        setWeatherData(null);
        setForecast(null);
        return;
      }

      const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 0);
      setWeatherData(data);
      setForecast(dailyForecast);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Sorry we couldn't retrieve the weather data at this time. Please try again later.");
      setWeatherData(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
    }
  };

  return {
    weatherData,
    forecast,
    searchInput,
    setSearchInput,
    error,
    loading,
    handleSubmit,
  };
}


import useWeather from "./hooks/useWeather";
import "./App.css";
import "./index.css";

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;

  const {
    weatherData,
    forecast,
    searchInput,
    setSearchInput,
    error,
    loading,
    handleSubmit,
  } = useWeather("Karachi", apiKey);

  if (loading) return <div className="wrapper">Loading...</div>;

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter city name"
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weatherData && weatherData.main && weatherData.weather && (
        <>
          <div className="header">
            <h1 className="city">{weatherData.name}</h1>
            <p className="temperature">{weatherData.main.temp}°F</p>
            <p className="condition">{weatherData.weather[0].main}</p>
          </div>
          <div className="weather-details">
            <div>
              <p>Humidity</p>
              <p>{Math.round(weatherData.main.humidity)}%</p>
            </div>
            <div>
              <p>Wind Speed</p>
              <p>{Math.round(weatherData.wind.speed)} mph</p>
            </div>
          </div>
        </>
      )}

      {Array.isArray(forecast) && forecast.length > 0 && (
        <div className="forecast">
          <h2 className="forecast-header">5-Day Forecast</h2>
          <div className="forecast-days">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>
                  {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                />
                <p>{Math.round(day.main.temp)}°F</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

'use client';

import { useEffect, useState } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import {
  getWeatherByCity,
  getForecast,
  getAirQuality,
  getUserLocation,
  getWeatherByCoords,
  getForecastByCoords,
} from '@/lib/weatherApi';
import CurrentWeather from '@/components/CurrentWeather';
import Forecast from '@/components/Forecast';
import AirQuality from '@/components/AirQuality';
import SearchBar from '@/components/SearchBar';
import UnitToggle from '@/components/UnitToggle';
import { AlertCircle, Loader } from 'lucide-react';

export default function Home() {
  const {
    weather,
    forecast,
    airQuality,
    loading,
    error,
    selectedCity,
    unit,
    setWeather,
    setForecast,
    setAirQuality,
    setLoading,
    setError,
    setSelectedCity,
    addRecentSearch,
  } = useWeatherStore();

  const [initialized, setInitialized] = useState(false);

  // Initial load
  useEffect(() => {
    if (!initialized) {
      fetchWeatherData(selectedCity);
      setInitialized(true);
    }
  }, [initialized]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeatherData(selectedCity);
    }, 600000);

    return () => clearInterval(interval);
  }, [selectedCity]);

  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCity(city),
        getForecast(city),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      addRecentSearch(city);
      setSelectedCity(city);

      // Get air quality
      const aqData = await getAirQuality(
        weatherData.coord.lat,
        weatherData.coord.lon
      );
      setAirQuality(aqData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city: string) => {
    fetchWeatherData(city);
  };

  const handleLocationClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const location = await getUserLocation();
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCoords(location.lat, location.lon),
        getForecastByCoords(location.lat, location.lon),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setSelectedCity(weatherData.name);
      addRecentSearch(weatherData.name);

      const aqData = await getAirQuality(location.lat, location.lon);
      setAirQuality(aqData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to get location. Please enable location services.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-slate-100">
      {/* Header */}
      <header className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Weather Dashboard</h1>
              <p className="text-blue-100">Real-time weather information</p>
            </div>
            <UnitToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onLocationClick={handleLocationClick}
            isLoading={loading}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Loading weather data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Weather Data */}
        {!loading && weather && (
          <div className="space-y-6">
            {/* Current Weather */}
            <CurrentWeather data={weather} unit={unit} />

            {/* Forecast and Air Quality */}
            <div className="grid lg:grid-cols-2 gap-6">
              {forecast && <Forecast data={forecast} unit={unit} />}
              {airQuality && <AirQuality data={airQuality} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

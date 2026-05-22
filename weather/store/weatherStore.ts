import { create } from 'zustand';
import { WeatherData, ForecastData, AirQualityData } from '@/lib/weatherApi';

interface WeatherStore {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
  selectedCity: string;
  unit: 'celsius' | 'fahrenheit';
  recentSearches: string[];

  setWeather: (weather: WeatherData | null) => void;
  setForecast: (forecast: ForecastData | null) => void;
  setAirQuality: (airQuality: AirQualityData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCity: (city: string) => void;
  setUnit: (unit: 'celsius' | 'fahrenheit') => void;
  addRecentSearch: (city: string) => void;
  clearRecentSearches: () => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  weather: null,
  forecast: null,
  airQuality: null,
  loading: false,
  error: null,
  selectedCity: 'London',
  unit: 'celsius',
  recentSearches: [],

  setWeather: (weather) => set({ weather }),
  setForecast: (forecast) => set({ forecast }),
  setAirQuality: (airQuality) => set({ airQuality }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCity: (selectedCity) => set({ selectedCity }),
  setUnit: (unit) => set({ unit }),
  addRecentSearch: (city) =>
    set((state) => ({
      recentSearches: [city, ...state.recentSearches.filter((c) => c !== city)].slice(0, 5),
    })),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));

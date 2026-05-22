# Weather Dashboard

🌤️ A real-time weather dashboard application that fetches data from OpenWeatherMap API.

## Features

### 📍 Core Functionality
- **Current Weather** - Real-time temperature, humidity, wind speed, pressure
- **5-Day Forecast** - Detailed daily weather predictions
- **Air Quality Index** - Pollutant levels (PM2.5, PM10, NO₂, O₃, etc.)
- **Location Detection** - Automatic geolocation support
- **Temperature Units** - Toggle between Celsius and Fahrenheit
- **Recent Searches** - Quick access to previously searched cities

### 🎨 UI Components
- Gradient backgrounds and modern design
- Responsive grid layouts
- Weather icons from OpenWeatherMap
- Horizontal scrollable forecast cards
- Color-coded air quality indicators
- Loading and error states

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **API Integration**: Axios
- **State Management**: Zustand
- **Charts**: Recharts (ready for integration)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Data Source**: OpenWeatherMap API

## Project Structure

```
weather/
├── app/
│   └── page.tsx                 # Main dashboard page
├── components/
│   ├── CurrentWeather.tsx       # Current conditions display
│   ├── Forecast.tsx             # 5-day forecast cards
│   ├── AirQuality.tsx           # Air quality index display
│   ├── SearchBar.tsx            # City search with recent searches
│   ├── UnitToggle.tsx           # Temperature unit switcher
│   └── ui/
│       └── Card.tsx             # Reusable card components
├── lib/
│   └── weatherApi.ts            # OpenWeatherMap API integration
├── store/
│   └── weatherStore.ts          # Zustand store for state management
├── package.json                 # Dependencies
├── .env.example                 # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- OpenWeatherMap API key

### Installation

1. **Clone and Install**
```bash
git clone <repo-url>
cd weather
npm install
```

2. **Get API Key**
   - Go to [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key

3. **Configure Environment**
```bash
cp .env.example .env.local
```

Add your API key:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

4. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## API Reference

### Weather API Functions

#### Get Current Weather by City
```typescript
const weather = await getWeatherByCity('London');
```

#### Get Current Weather by Coordinates
```typescript
const weather = await getWeatherByCoords(51.5074, -0.1278);
```

#### Get 5-Day Forecast
```typescript
const forecast = await getForecast('London');
```

#### Get Air Quality Data
```typescript
const aqData = await getAirQuality(51.5074, -0.1278);
```

#### Get User Location
```typescript
const location = await getUserLocation();
// Returns: { lat, lon, city }
```

## State Management

### Zustand Store (`weatherStore.ts`)

```typescript
const store = useWeatherStore();

// Access state
store.weather;          // Current weather data
store.forecast;         // 5-day forecast
store.airQuality;       // Air quality index
store.loading;          // Loading state
store.error;            // Error messages
store.unit;             // 'celsius' or 'fahrenheit'
store.recentSearches;   // Array of searched cities

// Update state
store.setWeather(data);
store.setUnit('fahrenheit');
store.addRecentSearch('Paris');
```

## Data Models

### WeatherData
```typescript
interface WeatherData {
  coord: { lon: number; lat: number }
  weather: Array<{ id, main, description, icon }>
  main: { temp, feels_like, temp_min, temp_max, pressure, humidity }
  visibility: number
  wind: { speed, deg, gust? }
  clouds: { all }
  dt: number
  sys: { type, id, country, sunrise, sunset }
  timezone: number
  name: string
  cod: number
}
```

### ForecastData
```typescript
interface ForecastData {
  list: Array<{ dt, main, weather, wind, ... }>
  city: { name, coord, country, ... }
}
```

### AirQualityData
```typescript
interface AirQualityData {
  list: Array<{
    main: { aqi }
    components: { co, no2, o3, pm2_5, pm10, ... }
  }>
}
```

## Utility Functions

- `getWeatherIconUrl()` - Get weather icon URL from OpenWeatherMap
- `getAQILabel()` - Convert AQI number to label (Good, Fair, etc.)
- `getWindDirection()` - Convert wind degrees to compass direction
- `formatTime()` - Format timestamp with timezone support
- `formatDate()` - Format timestamp to readable date

## Features Showcase

### Current Weather Card
- Large temperature display
- "Feels like" temperature
- Min/Max temperatures
- Humidity, wind speed, visibility, pressure
- Sunrise/sunset times

### Forecast Cards
- Daily high/low temperatures
- Weather conditions
- Humidity and rain probability
- Horizontal scrollable carousel
- Weather icons

### Air Quality Display
- AQI index with color coding
- Individual pollutant levels
- Health warnings for poor AQI
- Visual pollutant breakdown

### Search Features
- Real-time city search
- Geolocation detection
- Recent search history
- Quick-access buttons for recent cities

## Future Enhancements

- [ ] Weather alerts and severe weather warnings
- [ ] Historical weather data charts
- [ ] Weather radar map integration
- [ ] Multi-city comparison
- [ ] Mobile app version
- [ ] Browser notifications for alerts
- [ ] Dark mode support
- [ ] Offline data caching
- [ ] Advanced filtering and analytics
- [ ] Integration with calendar for planning

## API Limits

OpenWeatherMap free tier includes:
- Current weather data
- 5-day forecast
- Air quality index
- Up to 60 calls/minute

## License

MIT

## Support

For issues or feature requests, please visit [OpenWeatherMap Documentation](https://openweathermap.org/api)

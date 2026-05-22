'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { WeatherData } from '@/lib/weatherApi';
import { getWeatherIconUrl, formatTime, getWindDirection } from '@/lib/weatherApi';
import { Wind, Droplets, Eye, Gauge } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export default function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const getTemp = (tempC: number) => {
    return unit === 'fahrenheit' ? Math.round((tempC * 9) / 5 + 32) : Math.round(tempC);
  };

  const tempUnit = unit === 'fahrenheit' ? '°F' : '°C';

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl mb-2">{data.name}, {data.sys.country}</CardTitle>
            <p className="text-blue-100">{data.weather[0].description}</p>
          </div>
          <img
            src={getWeatherIconUrl(data.weather[0].icon, 'large')}
            alt={data.weather[0].description}
            className="w-24 h-24"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Temperature Section */}
          <div>
            <div className="text-7xl font-bold mb-2">
              {getTemp(data.main.temp)}{tempUnit}
            </div>
            <p className="text-blue-100 mb-4">
              Feels like {getTemp(data.main.feels_like)}{tempUnit}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-400 bg-opacity-30 p-3 rounded">
                <p className="text-blue-100">Min</p>
                <p className="text-xl font-semibold">{getTemp(data.main.temp_min)}{tempUnit}</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 p-3 rounded">
                <p className="text-blue-100">Max</p>
                <p className="text-xl font-semibold">{getTemp(data.main.temp_max)}{tempUnit}</p>
              </div>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-400 bg-opacity-20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets size={20} />
                <span className="text-blue-100">Humidity</span>
              </div>
              <p className="text-2xl font-bold">{data.main.humidity}%</p>
            </div>

            <div className="bg-blue-400 bg-opacity-20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wind size={20} />
                <span className="text-blue-100">Wind</span>
              </div>
              <p className="text-2xl font-bold">{Math.round(data.wind.speed)} m/s</p>
              <p className="text-sm text-blue-100">{getWindDirection(data.wind.deg)}</p>
            </div>

            <div className="bg-blue-400 bg-opacity-20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={20} />
                <span className="text-blue-100">Visibility</span>
              </div>
              <p className="text-2xl font-bold">{(data.visibility / 1000).toFixed(1)} km</p>
            </div>

            <div className="bg-blue-400 bg-opacity-20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gauge size={20} />
                <span className="text-blue-100">Pressure</span>
              </div>
              <p className="text-2xl font-bold">{data.main.pressure} mb</p>
            </div>
          </div>
        </div>

        {/* Sunrise/Sunset */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-blue-400 border-opacity-30">
          <div>
            <p className="text-blue-100 text-sm">Sunrise</p>
            <p className="text-lg font-semibold">
              {formatTime(data.sys.sunrise, data.timezone)}
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Sunset</p>
            <p className="text-lg font-semibold">
              {formatTime(data.sys.sunset, data.timezone)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

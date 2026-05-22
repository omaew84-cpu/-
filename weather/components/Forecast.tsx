'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ForecastData } from '@/lib/weatherApi';
import { getWeatherIconUrl, formatDate, formatTime } from '@/lib/weatherApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ForecastProps {
  data: ForecastData;
  unit: 'celsius' | 'fahrenheit';
}

export default function Forecast({ data, unit }: ForecastProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const tempUnit = unit === 'fahrenheit' ? '°F' : '°C';

  const getTemp = (tempC: number) => {
    return unit === 'fahrenheit' ? Math.round((tempC * 9) / 5 + 32) : Math.round(tempC);
  };

  // Group forecast by day
  const dailyForecasts = data.list.reduce((acc: any[], item) => {
    const date = new Date(item.dt_txt).toLocaleDateString();
    const dayData = acc.find((d) => d.date === date);

    if (dayData) {
      dayData.forecasts.push(item);
    } else {
      acc.push({ date, forecasts: [item] });
    }

    return acc;
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('forecast-scroll');
    if (container) {
      const scrollAmount = 300;
      container.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
      setScrollPosition(container.scrollLeft);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <div
            id="forecast-scroll"
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {dailyForecasts.map((day, idx) => {
              const dayForecast = day.forecasts[Math.floor(day.forecasts.length / 2)];

              return (
                <div
                  key={idx}
                  className="flex-shrink-0 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg p-4 min-w-max"
                >
                  <p className="font-semibold text-slate-900 mb-3">
                    {formatDate(dayForecast.dt)}
                  </p>

                  <img
                    src={getWeatherIconUrl(dayForecast.weather[0].icon, 'small')}
                    alt={dayForecast.weather[0].description}
                    className="w-12 h-12 mb-2"
                  />

                  <p className="text-sm text-slate-700 mb-3">
                    {dayForecast.weather[0].main}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">High:</span>
                      <span className="font-semibold text-red-600">
                        {getTemp(dayForecast.main.temp_max)}{tempUnit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Low:</span>
                      <span className="font-semibold text-blue-600">
                        {getTemp(dayForecast.main.temp_min)}{tempUnit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Humidity:</span>
                      <span className="font-semibold">{dayForecast.main.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Rain Chance:</span>
                      <span className="font-semibold">{Math.round(dayForecast.pop * 100)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll Controls */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-slate-50 transition z-10"
          >
            <ChevronLeft size={20} className="text-slate-700" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-slate-50 transition z-10"
          >
            <ChevronRight size={20} className="text-slate-700" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

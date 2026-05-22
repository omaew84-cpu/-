'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { AirQualityData, getAQILabel } from '@/lib/weatherApi';
import { AlertCircle, Leaf } from 'lucide-react';

interface AirQualityProps {
  data: AirQualityData;
}

export default function AirQuality({ data }: AirQualityProps) {
  const currentAQ = data.list[0];
  const aqi = currentAQ.main.aqi;
  const components = currentAQ.components;

  const getAQIColor = (aqi: number) => {
    switch (aqi) {
      case 1:
        return 'bg-green-100 border-green-500';
      case 2:
        return 'bg-yellow-100 border-yellow-500';
      case 3:
        return 'bg-orange-100 border-orange-500';
      case 4:
        return 'bg-red-100 border-red-500';
      case 5:
        return 'bg-purple-100 border-purple-500';
      default:
        return 'bg-slate-100 border-slate-500';
    }
  };

  const getAQITextColor = (aqi: number) => {
    switch (aqi) {
      case 1:
        return 'text-green-700';
      case 2:
        return 'text-yellow-700';
      case 3:
        return 'text-orange-700';
      case 4:
        return 'text-red-700';
      case 5:
        return 'text-purple-700';
      default:
        return 'text-slate-700';
    }
  };

  return (
    <Card className={`shadow-lg border-2 ${getAQIColor(aqi)}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf size={24} />
          Air Quality Index
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AQI Display */}
          <div className="text-center">
            <div className={`text-5xl font-bold mb-2 ${getAQITextColor(aqi)}`}>
              {aqi}
            </div>
            <p className={`text-lg font-semibold ${getAQITextColor(aqi)}`}>
              {getAQILabel(aqi)}
            </p>
            {aqi > 3 && (
              <div className="flex items-center gap-2 mt-3 text-red-700 bg-red-50 p-2 rounded">
                <AlertCircle size={18} />
                <span className="text-sm">Air quality is unhealthy</span>
              </div>
            )}
          </div>

          {/* Pollutants Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white bg-opacity-50 p-3 rounded">
              <p className="text-xs text-slate-600">PM2.5</p>
              <p className="text-xl font-bold">{components.pm2_5.toFixed(1)}</p>
              <p className="text-xs text-slate-500">µg/m³</p>
            </div>

            <div className="bg-white bg-opacity-50 p-3 rounded">
              <p className="text-xs text-slate-600">PM10</p>
              <p className="text-xl font-bold">{components.pm10.toFixed(1)}</p>
              <p className="text-xs text-slate-500">µg/m³</p>
            </div>

            <div className="bg-white bg-opacity-50 p-3 rounded">
              <p className="text-xs text-slate-600">NO₂</p>
              <p className="text-xl font-bold">{components.no2.toFixed(1)}</p>
              <p className="text-xs text-slate-500">µg/m³</p>
            </div>

            <div className="bg-white bg-opacity-50 p-3 rounded">
              <p className="text-xs text-slate-600">O₃</p>
              <p className="text-xl font-bold">{components.o3.toFixed(1)}</p>
              <p className="text-xs text-slate-500">µg/m³</p>
            </div>
          </div>
        </div>

        {/* Detailed Pollutants */}
        <div className="mt-6 pt-6 border-t">
          <p className="font-semibold text-slate-900 mb-4">Detailed Pollutant Levels</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-600">CO</p>
              <p className="font-bold">{components.co.toFixed(2)} mg/m³</p>
            </div>
            <div>
              <p className="text-slate-600">NO</p>
              <p className="font-bold">{components.no.toFixed(2)} µg/m³</p>
            </div>
            <div>
              <p className="text-slate-600">SO₂</p>
              <p className="font-bold">{components.so2.toFixed(2)} µg/m³</p>
            </div>
            <div>
              <p className="text-slate-600">NH₃</p>
              <p className="font-bold">{components.nh3.toFixed(2)} µg/m³</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

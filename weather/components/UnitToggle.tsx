'use client';

import { useWeatherStore } from '@/store/weatherStore';

export default function UnitToggle() {
  const { unit, setUnit } = useWeatherStore();

  return (
    <div className="flex gap-2 bg-slate-200 rounded-lg p-1 inline-flex">
      <button
        onClick={() => setUnit('celsius')}
        className={`px-4 py-2 rounded transition font-medium ${
          unit === 'celsius'
            ? 'bg-white text-blue-600 shadow'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => setUnit('fahrenheit')}
        className={`px-4 py-2 rounded transition font-medium ${
          unit === 'fahrenheit'
            ? 'bg-white text-blue-600 shadow'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        °F
      </button>
    </div>
  );
}

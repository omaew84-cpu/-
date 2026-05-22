'use client';

import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useWeatherStore } from '@/store/weatherStore';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationClick: () => void;
  isLoading: boolean;
}

export default function SearchBar({
  onSearch,
  onLocationClick,
  isLoading,
}: SearchBarProps) {
  const [searchInput, setSearchInput] = useState('');
  const { recentSearches } = useWeatherStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-blue-500 focus:outline-none transition"
            disabled={isLoading}
          />
          <Search className="absolute right-3 top-3 text-slate-400" size={20} />
        </div>

        <button
          type="button"
          onClick={onLocationClick}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white px-4 py-3 rounded-lg transition flex items-center gap-2"
        >
          <MapPin size={20} />
          <span className="hidden sm:inline">Current Location</span>
        </button>
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">Recent searches:</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((city) => (
              <button
                key={city}
                onClick={() => {
                  onSearch(city);
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1 rounded-full text-sm transition"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

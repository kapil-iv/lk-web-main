import React from 'react';
import { Search, MapPin, X, ChevronDown, Users } from 'lucide-react';

const SearchBar = ({ query, setQuery, venueQuery, setVenueQuery, onClear }) => (
  <div className="bg-white border-b border-zinc-100 sticky top-16 z-30 py-4 px-4 md:px-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
      {/* Search Input */}
      <div className="relative flex-1 w-full flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-l-xl focus:ring-2 ring-primary/20 outline-none"
          />
        </div>
        <button
          onClick={onClear}
          className="bg-primary text-white p-3.5 rounded-r-xl hover:bg-orange-700 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Venue Search & Sports Dropdown */}
      <div className="flex gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            value={venueQuery}
            onChange={(e) => setVenueQuery(e.target.value)}
            type="text"
            placeholder="Search by venue name"
            className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm"
          />
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-xl font-bold text-sm">
          <Users size={16} /> All Sports <ChevronDown size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default SearchBar;

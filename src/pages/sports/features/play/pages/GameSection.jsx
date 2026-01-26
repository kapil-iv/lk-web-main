import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { discoverGames } from '../../../../../api/apiUtils';
import GameCard from '../../../../../components/GameCard';
import FilterPill from '../../../../../components/FilterPill';
import { Plus, ArrowDown, X } from 'lucide-react';

const GamesSection = () => {
  const [gamesList, setGamesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // --- Filter States ---
  const [activeSport, setActiveSport] = useState('All');
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [activeLevel, setActiveLevel] = useState('All');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [visibleCount, setVisibleCount] = useState(window.innerWidth < 768 ? 5 : 10);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (visibleCount <= 10) setVisibleCount(mobile ? 5 : 10);
    };
    window.addEventListener("resize", handleResize);

    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await discoverGames();
        if (response.success) setGamesList(response.data);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Filtering Logic ---
  const filteredGames = useMemo(() => {
    return gamesList.filter(game => {
      // 1. Sport Filter (assuming game.sport.name exists)
      const matchesSport = activeSport === 'All' || game.sport?.name === activeSport;
      
      // 2. Skill Level Filter
      const matchesLevel = activeLevel === 'All' || game.skillLevel === activeLevel;

      // 3. Date Filter (Today)
      let matchesDate = true;
      if (showTodayOnly) {
        const today = new Date().toISOString().split('T')[0];
        matchesDate = game.gameDate === today;
      }

      return matchesSport && matchesLevel && matchesDate;
    });
  }, [gamesList, activeSport, activeLevel, showTodayOnly]);

  const displayedGames = filteredGames.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + (isMobile ? 5 : 10));
  };

  // Reset Filters
  const clearFilters = () => {
    setActiveSport('All');
    setActiveLevel('All');
    setShowTodayOnly(false);
  };

  return (
    <section className="flex flex-col md:mx-auto max-w-[1200px] mt-6 md:mt-[52px] w-full px-4 md:px-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] md:text-4xl font-black leading-tight text-gray-900 uppercase tracking-tighter text-left">
            Games in <span className="text-blue-600">Bikaner</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1 text-left">
            Found {filteredGames.length} matches based on your interest.
          </p>
        </div>

        <button 
          onClick={() => navigate('create-game')} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 w-full md:w-auto justify-center uppercase text-xs tracking-widest"
        >
          <Plus size={20} strokeWidth={3} /> Create Game
        </button>
      </div>

      {/* --- Responsive Filters Area --- */}
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {/* Sport Filter Dropdown/Pill */}
            <select 
              value={activeSport} 
              onChange={(e) => setActiveSport(e.target.value)}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border-2 transition-all outline-none appearance-none cursor-pointer ${activeSport !== 'All' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-500'}`}
            >
              <option value="All">All Sports</option>
              {/* <option value="Cricket">Cricket</option>
              <option value="Football">Football</option>
              <option value="Badminton">Badminton</option> */}
            </select>

            {/* Today Filter Toggle */}
            <button 
              onClick={() => setShowTodayOnly(!showTodayOnly)}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${showTodayOnly ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-500'}`}
            >
              Today
            </button>

            {/* Skill Level Filter */}
            <select 
              value={activeLevel} 
              onChange={(e) => setActiveLevel(e.target.value)}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border-2 transition-all outline-none appearance-none cursor-pointer ${activeLevel !== 'All' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-500'}`}
            >
              <option value="All">Any Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {(activeSport !== 'All' || activeLevel !== 'All' || showTodayOnly) && (
            <button onClick={clearFilters} className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Games Grid */}
      <div className="mt-6 mb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[32px]" />
            ))}
          </div>
        ) : displayedGames.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {visibleCount < filteredGames.length && (
              <div className="flex justify-center mt-12">
                <button onClick={handleLoadMore} className="flex flex-col items-center gap-3 group">
                  <div className="bg-white border-2 border-blue-600 text-blue-600 p-4 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                    <ArrowDown size={24} strokeWidth={3} className="animate-bounce" />
                  </div>
                  <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">Show More</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No matches found for these filters.</p>
            <button onClick={clearFilters} className="mt-4 text-blue-600 font-bold text-sm underline">Clear all filters</button>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default GamesSection;
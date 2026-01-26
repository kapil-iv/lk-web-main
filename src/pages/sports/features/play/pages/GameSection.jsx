import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { discoverGames } from '../../../../../api/apiUtils';
import GameCard from '../../../../../components/GameCard';
import FilterPill from '../../../../../components/FilterPill';
import { Plus, ArrowDown } from 'lucide-react';

const GamesSection = () => {
  const [gamesList, setGamesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Screen size check logic
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Mobile pe 5, Desktop pe 10 default
  const [visibleCount, setVisibleCount] = useState(window.innerWidth < 768 ? 5 : 10);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Only set initial count once if not already loaded more
      if (visibleCount <= 10) {
        setVisibleCount(mobile ? 5 : 10);
      }
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

  const handleLoadMore = () => {
    // Mobile pe 5 aur add honge, Desktop pe 10
    const increment = isMobile ? 5 : 10;
    setVisibleCount(prev => prev + increment);
  };

  const displayedGames = gamesList.slice(0, visibleCount);

  return (
    <section className="flex flex-col md:mx-auto max-w-[1200px] mt-6 md:mt-[52px] w-full px-4 md:px-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] md:text-4xl font-black leading-tight text-gray-900 uppercase tracking-tighter">
            Games in <span className="text-blue-600">Bikaner</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Explore upcoming matches and join the action.</p>
        </div>

        <button 
          onClick={() => navigate('create-game')} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 w-full md:w-auto justify-center uppercase text-xs tracking-widest"
        >
          <Plus size={20} strokeWidth={3} />
          Create Game
        </button>
      </div>

      {/* Filters Area */}
      <div className="mt-8 w-full flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <FilterPill label="Sports" showChevron />
        <FilterPill label="Pay & Join" />
        <FilterPill label="Today" />
        <FilterPill label="Skill Level" showChevron />
      </div>

      {/* Games Grid (No Carousel) */}
      <div className="mt-10 mb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
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

            {/* Load More Button */}
            {visibleCount < gamesList.length && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  className="flex flex-col items-center gap-3 group transition-transform active:scale-95"
                >
                  <div className="bg-white border-2 border-blue-600 text-blue-600 p-4 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-100">
                    <ArrowDown size={24} strokeWidth={3} className="animate-bounce" />
                  </div>
                  <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
                    Show More Matches
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full text-center py-20 bg-blue-50/30 rounded-[40px] border-2 border-dashed border-blue-100">
            <p className="text-blue-400 font-black uppercase text-xs tracking-widest">No games available right now.</p>
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
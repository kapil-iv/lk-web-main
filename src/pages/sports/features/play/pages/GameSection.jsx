import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { discoverGames } from '../../../../../api/apiUtils';
import GameCard from '../../../../../components/GameCard';
import FilterPill from '../../../../../components/FilterPill';
import { Plus } from 'lucide-react';

const GamesSection = () => {
  const [gamesList, setGamesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  return (
    <section className="flex flex-col md:mx-auto max-w-[1080px] mt-6 md:mt-[52px] w-full px-4 md:px-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold leading-[48px] text-gray-900">
            Games in <span className="capitalize text-blue-600">Bikaner</span>
          </h1>
          <p className="text-gray-500 text-sm">Find and join matches happening near you.</p>
        </div>

        {/* Fixed Create Game Button */}
        <button 
          onClick={() => navigate('create-game')} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          Create Game
        </button>
      </div>

      {/* Filters Section */}
      <div className="mt-8 w-full flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <FilterPill label="Sports" showChevron />
        <FilterPill label="Pay & Join Game" />
        <FilterPill label="Today" />
        <FilterPill label="Skill Level" showChevron />
      </div>

      {/* Games Grid */}
      <div className="flex gap-6 flex-wrap mt-8 mb-20 justify-center md:justify-start">
        {isLoading ? (
          <div className="w-full flex flex-col items-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="font-medium text-gray-400">Finding the best matches for you...</p>
          </div>
        ) : gamesList.length > 0 ? (
          gamesList.map(game => (
            <GameCard key={game.id} game={game} />
          ))
        ) : (
          <div className="w-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No games found. Why not host one?</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GamesSection;
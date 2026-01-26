import { useEffect, useState } from "react";
import { getMyGames } from "../../../../../api/apiUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Trophy, Users, ChevronRight, Banknote } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyGames = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("joined");

  useEffect(() => {
    const fetchMyGames = async () => {
      setLoading(true);
      try {
        const response = await getMyGames();
        if (response.success) {
          setGames(response.data);
        }
      } catch (error) {
        toast.error("Failed to load your games");
      } finally {
        setLoading(false);
      }
    };
    fetchMyGames();
  }, []);

  const formatTo12Hour = (time) => {
    if (!time) return "";
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Logic updated based on your JSON: myRole tells us if we hosted it
  const filteredGames = games.filter(game =>
    activeTab === "hosted" ? game.myRole === "host" : game.myRole === "player"
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <Toaster />

      <div className="bg-white border-b px-6 py-8 md:px-16 md:py-12">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter">
          My <span className="text-blue-600">Games</span>
        </h1>
        <p className="text-gray-500 font-medium mt-2">Manage your sports life in one place.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="bg-white p-2 rounded-2xl shadow-sm border flex gap-2 w-full md:w-max">
          <button
            onClick={() => setActiveTab("joined")}
            className={`flex-1 md:px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'joined' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Joined Games
          </button>
          <button
            onClick={() => setActiveTab("hosted")}
            className={`flex-1 md:px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'hosted' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Hosted By Me
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-3xl" />)}
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game) => (
                <motion.div
                  onClick={() => navigate(`/sports/play/game-detail`, {
                    state: {
                      game
                    }
                  })}
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${activeTab === 'hosted' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        <Trophy size={24} />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${game.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {game.status}
                        </span>
                        <span className="text-xs font-bold text-gray-400">ID: #{game.id}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-1 uppercase">{game.venue?.name || "Friendly Match"}</h3>
                    <p className="text-blue-600 text-xs font-black uppercase tracking-wider mb-4">{game.gameType} • {game.skillLevel}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                        <Calendar size={16} className="text-blue-500" />
                        {new Date(game.gameDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                        <Clock size={16} className="text-blue-500" />
                        {formatTo12Hour(game.startTime)} - {formatTo12Hour(game.endTime)}
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                        <MapPin size={16} className="text-blue-500" />
                        <span className="truncate">{game.venue?.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 font-black text-sm">
                        <Banknote size={16} className="text-green-500" />
                        ₹{game.pricePerPlayer} / player
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(game.playersJoined, 3))].map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">P</div>
                        ))}
                      </div>
                      <span className="text-sm font-black text-gray-700 ml-1">
                        {game.playersJoined}/{game.maxPlayers} <span className="text-gray-400 font-medium">({game.slotsLeft} left)</span>
                      </span>
                    </div>
                    <button className="text-blue-600 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      DETAILS <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Trophy size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase">No {activeTab} games</h3>
            <p className="text-gray-500 font-medium">Time to hit the field! Browse games to join.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyGames;
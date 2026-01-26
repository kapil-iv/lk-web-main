import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Trophy, ChevronRight, Share2, Award, Clock, Users2 } from 'lucide-react';
import { discoverGames, joinGame } from '../../../../../api/apiUtils';
import { paths } from '../../../../../routes/paths';
import toast, { Toaster } from 'react-hot-toast';

const JoinGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        const response = await discoverGames();
        if (response.success) {
          setAllGames(response.data);
          const foundGame = response.data.find(g => g.id === parseInt(id));
          setGame(foundGame);
        }
      } catch (error) {
        console.error("Error fetching match:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGameData();
  }, [id]);

  const handleJoin = async () => {
    setJoining(true);

    // 2. Loading toast (optional but recommended for UX)
    const loadingToast = toast.loading("Processing your request...");

    try {
      const response = await joinGame(id);

      if (response.success) {
        // 3. Success toast
        toast.success("Joined successfully! Get your gear ready! 🚀", {
          id: loadingToast,
          duration: 4000,
          style: {
            border: '1px solid #2563eb', // Blue border
            padding: '16px',
            color: '#1e40af',
          },
          iconTheme: {
            primary: '#2563eb',
            secondary: '#FFFAEE',
          },
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to join. Please try again.";

      toast.error(errorMessage, {
        id: loadingToast, 
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-blue-600 font-bold">Loading Activity...</div>;
  if (!game) return <div className="p-10 text-center">Match not found.</div>;

  const startT = new Date(`${game.gameDate}T${game.startTime}`);
  const endT = new Date(`${game.gameDate}T${game.endTime}`);

  const timeRange = `${startT.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })} - ${endT.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;

  const hour = startT.getHours();
  const timePeriod = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  const similarGames = allGames
    .filter(g => g.sportCategoryId === game.sportCategoryId && g.id !== game.id)
    .slice(0, 3);

  const nearbyVenues = Array.from(new Set(allGames.map(g => g.venue?.id)))
    .map(vId => allGames.find(g => g.venue?.id === vId)?.venue)
    .filter(Boolean)
    .slice(0, 3);

  const isFull = game.slotsLeft === 0;

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{game.gameType} {game.sport?.name} Activity</h1>
                <p className="text-gray-500 mt-1 italic font-medium">Hosted by <span className="text-blue-600 font-bold">{game.host?.name}</span></p>
              </div>
              <img src={game.host?.profileImg || `https://robohash.org/${game.host?.id}?set=set3`} className="w-16 h-16 rounded-full border-2 border-blue-50 shadow-md" alt="host" />
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4 text-gray-800 font-bold">
                <Clock className="text-blue-400" size={24} />
                <div>
                  <p className="text-lg">{new Date(game.gameDate).toDateString()}</p>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wide">{timeRange} • {timePeriod}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-gray-800 font-bold">
                <MapPin className="text-blue-400 shrink-0" size={24} />
                <div className="space-y-1">
                  <p className="text-base">{game.venue?.name}</p>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed">{game.venue?.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-gray-800 font-bold">
                <Users2 className="text-blue-400 shrink-0" size={24} />
                <div className="space-y-1">
                  <p className="text-base">Joined Players & Slots</p>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed">{game?.playersJoined}/{game?.maxPlayers} • {game?.slotsLeft} Slots Left</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                <Award size={20} className="text-blue-600" /> {game.skillLevel}
              </div>
              <button
                onClick={handleJoin}
                disabled={isFull || joining}
                className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-100 transition-all transform active:scale-95 ${isFull ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {joining ? "Processing..." : isFull ? "Fully Booked" : `Join Game`}
              </button>
            </div>
          </div>

          {/* SIMILAR GAMES */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Similar Games</h2>
              <button onClick={() => navigate(paths.play)} className="text-blue-600 font-bold text-xs flex items-center uppercase tracking-tighter hover:underline">
                See All Games <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarGames.map(item => (
                <SimilarGameCard key={item.id} item={item} navigate={navigate} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
            <h3 className="font-bold text-gray-800 mb-4 text-lg border-b border-gray-50 pb-2">Players Going ({game.playersJoined})</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={game.host?.profileImg || `https://robohash.org/${game.host?.id}?set=set3`} className="w-12 h-12 rounded-full border border-blue-100" alt="player" />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 h-3 w-3 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{game.host?.name}</p>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Host</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Venues Nearby</h3>
            <div className="space-y-4">
              {nearbyVenues.map(venue => <VenueItem key={venue?.id} venue={venue} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SimilarGameCard = ({ item, navigate }) => (
  <div
    onClick={() => navigate(paths.sports.joinGame.replace(':id', item.id))}
    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:border-blue-200 hover:shadow-md transition-all"
  >
    <div className="text-[10px] font-bold text-blue-500 uppercase mb-2">{item.gameType} • {item.sport?.name}</div>
    <div className="flex items-center gap-2 mb-3">
      <img src={item.host?.profileImg || `https://robohash.org/${item.host?.id}?set=set3`} className="w-6 h-6 rounded-full" alt="" />
      <span className="text-sm font-bold text-gray-700">{item.playersJoined} Going</span>
    </div>
    <div className="text-[11px] font-bold text-gray-800 truncate mb-1">
      {new Date(item.gameDate).toDateString()}
    </div>
    <div className="flex items-center gap-1 text-[10px] text-gray-500 truncate">
      <MapPin size={12} className="text-blue-400" /> {item.venue?.name}
    </div>
  </div>
);

const VenueItem = ({ venue }) => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border group-hover:border-blue-300 transition-all">
      <img src={venue?.logo || "https://via.placeholder.com/50"} alt="venue" className="w-full h-full object-cover" />
    </div>
    <div className="overflow-hidden">
      <p className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{venue?.name}</p>
      <p className="text-xs text-gray-400 truncate">{venue?.address}</p>
    </div>
  </div>
);

export default JoinGame;
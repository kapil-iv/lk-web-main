import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, MapPin, Users, Trophy, 
  ArrowLeft, Share2, Phone, MessageCircle, Info, Banknote
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const GameDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const game = state?.game;

  // Agar user directly URL se aaye aur state na mile
  if (!game) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <Trophy size={64} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-black uppercase">Match not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold underline">Go Back</button>
      </div>
    );
  }

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  const handleShare = () => {
    navigator.share({
      title: `${game.gameType} at ${game.venue.name}`,
      text: `Join me for a ${game.gameType} match on ${game.gameDate}!`,
      url: window.location.href,
    }).catch(() => toast.error("Sharing failed"));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Toaster />
      
      {/* Dynamic Header / Cover */}
      <div className="relative h-[250px] md:h-[350px] bg-zinc-900 overflow-hidden">
        <img 
          src={game.venue.cover || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000"} 
          className="w-full h-full object-cover opacity-60"
          alt="venue"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent"></div>
        
        {/* Top Actions */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-black transition-all">
            <ArrowLeft size={24} />
          </button>
          <button onClick={handleShare} className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-black transition-all">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        {/* Main Card */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 p-6 md:p-10 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                {game.sport.name} • {game.gameType}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-3 uppercase tracking-tighter">
                {game.venue.name}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-gray-500 font-bold">
                <MapPin size={18} className="text-red-500" />
                <p className="text-sm">{game.venue.address}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Price / Slot</p>
              <h2 className="text-4xl font-black text-blue-600">₹{game.pricePerPlayer}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-[24px] border border-gray-100">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase">Date</p>
              <p className="font-bold text-gray-800">{new Date(game.gameDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase">Start Time</p>
              <p className="font-bold text-gray-800">{formatTime(game.startTime)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase">Players</p>
              <p className="font-bold text-gray-800">{game.playersJoined}/{game.maxPlayers}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase">Skill Level</p>
              <p className="font-bold text-blue-600 uppercase italic">{game.skillLevel}</p>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            {/* Host Section */}
            <section>
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Hosted By</h4>
              <div className="flex items-center justify-between p-4 border rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white font-black text-xl">
                    {game.host.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{game.host.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase">{game.myRole === 'host' ? 'It\'s You!' : 'Community Host'}</p>
                  </div>
                </div>
                {game.myRole !== 'host' && (
                  <div className="flex gap-2">
                    <a href={`tel:${game.host.mobile}`} className="p-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-green-500 hover:text-white transition-colors">
                      <Phone size={20} />
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Description */}
            <section>
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Game Description</h4>
              <p className="text-gray-600 font-medium leading-relaxed">
                {game.description || "Join this exciting match at Wicket Zone. Bring your gear and let's play! Please arrive 15 mins before the start time."}
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Floating Action Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t p-4 px-6 md:px-12 flex items-center justify-between z-50">
        <div className="hidden md:block">
          <p className="text-xs font-black text-gray-400 uppercase">Slots Available</p>
          <p className="text-lg font-black text-gray-900">{game.slotsLeft} Spots Left</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full md:w-[300px] py-4 rounded-2xl font-black text-lg shadow-xl transition-all ${
            game.myStatus === 'joined' 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white shadow-blue-200'
          }`}
          disabled={game.myStatus === 'joined'}
        >
          {game.myStatus === 'joined' ? 'JOINED' : 'JOIN MATCH NOW'}
        </motion.button>
      </footer>
    </div>
  );
};

export default GameDetail;
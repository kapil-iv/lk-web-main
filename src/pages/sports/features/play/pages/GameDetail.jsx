import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, Clock, MapPin, Users, Trophy,
  ArrowLeft, Share2, Phone, MessageCircle, Info, Banknote,
  LogOut, Loader2, Trash2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { leaveGame, joinGame, cancelGame } from "../../../../../api/apiUtils";
//delete game api
const GameDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const game = state?.game;

  const [isActionLoading, setIsActionLoading] = useState(false);

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

  const handleDeleteGame = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this game? This cannot be undone.");
    if (!confirmDelete || isActionLoading) return;

    setIsActionLoading(true);
    try {
      const response = await cancelGame(game.id);
      if (response?.success) {
        toast.success("Game cancelled successfully");
        navigate(-1);
      } else {
        toast.error(response?.message || "Failed to cancel game");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error cancelling game");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLeaveGame = async () => {
    const confirmLeave = window.confirm("Leave this match?");
    if (!confirmLeave || isActionLoading) return;

    setIsActionLoading(true);
    try {
      const response = await leaveGame(game.id);
      if (response?.success) {
        toast.success("Left the match");
        navigate(-1);
      } else {
        toast.error(response?.message || "Failed to leave");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error leaving match");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (isActionLoading) return;
    setIsActionLoading(true);
    try {
      const response = await joinGame(game.id);
      if (response?.success) {
        toast.success("Joined successfully!");
        navigate(-1);
      } else {
        toast.error(response?.message || "Failed to join");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error joining");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Toaster />

      {/* Header */}
      <div className="relative h-[250px] md:h-[350px] bg-zinc-900 overflow-hidden">
        <img
          src={game.venue.cover || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000"}
          className="w-full h-full object-cover opacity-60"
          alt="venue"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent"></div>
        <div className="absolute top-6 left-6 right-6 flex justify-between">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
            <ArrowLeft size={24} />
          </button>
          <button onClick={handleShare} className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-[32px] shadow-xl p-6 md:p-10 border border-gray-100">
          
          {/* Top Info */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div>
              <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                {game.sport.name} • {game.gameType}
              </span>
              <h1 className="text-3xl font-black text-gray-900 mt-3 uppercase tracking-tighter">{game.venue.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-500 font-bold">
                <MapPin size={18} className="text-red-500" />
                <p className="text-sm">{game.venue.address}</p>
              </div>
            </div>
            <div className="md:text-right">
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Price / Slot</p>
              <h2 className="text-4xl font-black text-blue-600">₹{game.pricePerPlayer}</h2>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-[24px] border border-gray-100 mb-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase">Date</p>
              <p className="font-bold">{new Date(game.gameDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase">Start Time</p>
              <p className="font-bold">{formatTime(game.startTime)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase">Players</p>
              <p className="font-bold">{game.playersJoined}/{game.maxPlayers}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase">Skill</p>
              <p className="font-bold text-blue-600">{game.skillLevel}</p>
            </div>
          </div>

          <div className="space-y-10">
            {/* Host Info */}
            <section>
              <h4 className="text-sm font-black text-gray-400 uppercase mb-4 tracking-widest">Hosted By</h4>
              <div className="flex items-center justify-between p-4 border rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white font-black">
                    {game.host.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{game.host.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase">{game.myRole === 'host' ? 'Host' : 'Organizer'}</p>
                  </div>
                </div>
                {game.myRole !== 'host' && (
                  <a href={`tel:${game.host.mobile}`} className="p-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-green-500 hover:text-white transition-all">
                    <Phone size={20} />
                  </a>
                )}
              </div>
            </section>

            {/* Description & Delete Section */}
            <section>
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Game Description</h4>
              <p className="text-gray-600 font-medium leading-relaxed mb-8">
                {game.description || "Join this exciting match! Bring your gear and let's play. Please arrive 15 mins early."}
              </p>

              <hr className="border-gray-100 mb-8" />

              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Manage Game</h4>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed italic">
                {game.myRole === 'host' 
                  ? "As the host, you have the authority to cancel this game. This will notify all participants." 
                  : "If you cannot attend, please use the Leave button at the bottom."}
              </p>

              {game.myRole === 'host' && (
                <button
                  onClick={handleDeleteGame}
                  disabled={isActionLoading}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-red-50 text-red-600 font-black rounded-2xl border border-red-100 hover:bg-red-600 hover:text-white transition-all group"
                >
                  {isActionLoading ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} className="group-hover:scale-110 transition-transform" />}
                  CANCEL & DELETE GAME
                </button>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t p-4 px-6 md:px-12 flex items-center justify-between z-50">
        <div className="hidden md:block">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Availability</p>
          <p className="text-lg font-black text-gray-900">{game.slotsLeft} Slots Available</p>
        </div>

        {game.myRole === 'host' ? (
          <div className="w-full md:w-[250px] py-4 bg-zinc-100 text-zinc-500 rounded-2xl font-black text-center border border-zinc-200">
            YOU ARE THE HOST
          </div>
        ) : game.myStatus === 'joined' ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLeaveGame}
            disabled={isActionLoading}
            className="w-full md:w-[250px] py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-100"
          >
            {isActionLoading ? <Loader2 className="animate-spin" /> : <LogOut size={20} />}
            LEAVE MATCH
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoinGame}
            disabled={isActionLoading || game.slotsLeft === 0}
            className={`w-full md:w-[300px] py-4 rounded-2xl font-black text-lg shadow-xl transition-all ${
              game.slotsLeft === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-blue-200'
            }`}
          >
            {isActionLoading ? <Loader2 className="animate-spin" /> : (game.slotsLeft === 0 ? 'HOUSEFULL' : 'JOIN MATCH NOW')}
          </motion.button>
        )}
      </footer>
    </div>
  );
};

export default GameDetail;
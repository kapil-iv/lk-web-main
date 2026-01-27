import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, ChevronRight, Trophy, Loader2,
  Calendar, Clock, MapPin, Info, Users, IndianRupee, Percent
} from "lucide-react";
import { hostGame, getServiceProviders } from "../api/apiUtils";
import { paths } from "../routes/paths";
import { toast } from "react-hot-toast";
import useLatLngStore from "../store/useLatLngStore";
import  formate24to12  from "../utils/helpers.js";

const CreateGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lat, lng } = useLatLngStore();
  const [loadingVenue, setLoadingVenue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [venuesList, setVenuesList] = useState([]);
  const [fetchingVenues, setFetchingVenues] = useState(false);
  const [selectedVenueName, setSelectedVenueName] = useState("");

  const [formData, setFormData] = useState({
    sportCategoryId: 3,
    venueProviderId: "",
    gameType: "5v5",
    skillLevel: "beginner",
    gameDate: new Date().toISOString().split('T')[0],
    startTime: "18:00",
    endTime: "19:00",
    maxPlayers: 10,
    pricePerPlayer: 150,
    description: "Friendly match!"
  });

  // Dynamic Rates from Venue Category
  const [rates, setRates] = useState({
    taxRate: 0,
    platformFee: 0,
    commissionRate: 0
  });

  useEffect(() => {
    const fetchAllVenues = async () => {
      setLoadingVenue(true);
      if (!lat || !lng) return;
      setFetchingVenues(true);
      try {
        const [sportsRes, fitnessRes] = await Promise.all([
          getServiceProviders({ categoryId: 3, lat, lng, status: "active", approval_status: "approved" }),
          getServiceProviders({ categoryId: 8, lat, lng, status: "active", approval_status: "approved" })
        ]);
        const combined = [...(sportsRes.data || []), ...(fitnessRes.data || [])];
        setVenuesList(combined);

        // Pre-fill if coming from Venue Detail Page
        if (location.state?.venue) {
          const { venue, selectedSlots, selectedDate, selectedService } = location.state;
          setSelectedVenueName(venue.name);

          // Set dynamic rates from passed venue object
          if (venue.category) {
            setRates({
              taxRate: parseFloat(venue.category.taxRate || 0),
              platformFee: parseFloat(venue.category.platformFee || 0),
              commissionRate: parseFloat(venue.category.commissionRate || 0)
            });
          }

          setFormData(prev => ({
            ...prev,
            sportCategoryId: selectedService?.category_id || venue?.categoryId || 3,
            venueProviderId: venue?.id || "",
            gameDate: selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : prev.gameDate,
            startTime: selectedSlots?.[0]?.startTime || prev.startTime,
            endTime: selectedSlots?.[0]?.endTime || prev.endTime,
            pricePerPlayer: Math.round(selectedService?.price / (location.state?.maxPlayers || 10)) || 150
          }));
        }
      } catch (err) {
        toast.error("Unable to load nearby venues.");
      } finally {
        setFetchingVenues(false);
        setLoadingVenue(false);
      }
    };
    fetchAllVenues();
  }, [lat, lng, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVenueSelection = (e) => {
    const vId = Number(e.target.value);
    const selectedVenue = venuesList.find(v => v.id === vId);
    if (selectedVenue) {
      setSelectedVenueName(selectedVenue.name);
      setRates({
        taxRate: parseFloat(selectedVenue.category?.taxRate || 0),
        platformFee: parseFloat(selectedVenue.category?.platformFee || 0),
        commissionRate: parseFloat(selectedVenue.category?.commissionRate || 0)
      });
      setFormData(prev => ({
        ...prev,
        venueProviderId: vId,
        sportCategoryId: selectedVenue.categoryId || 3
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.venueProviderId) return toast.error("Please select a venue.");
    setLoading(true);
    try {
      const res = await hostGame(formData);
      if (res.success) {
        toast.success("Game hosted successfully!");
        navigate(paths.play);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to host game.");
    } finally {
      setLoading(false);
    }
  };

  // --- Calculations ---
  const venueTotal = formData.pricePerPlayer * formData.maxPlayers;
  const platformFee = rates.platformFee;
  const taxAmount = Math.round((venueTotal + platformFee) * (rates.taxRate / 100));
  const totalPot = venueTotal + platformFee + taxAmount;

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <nav className="bg-white border-b border-gray-200 px-4 md:px-12 py-4 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors">
          <ArrowLeft size={20} /> <span className="hidden sm:inline text-sm">Back</span>
        </button>
        <div className="text-center">
          <h1 className="text-lg md:text-xl font-black uppercase italic text-blue-600 tracking-tight">Game Setup</h1>
          <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Hosting Dashboard</p>
        </div>
        <div className="w-10"></div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Form Side */}
          <div className="w-full lg:w-[65%] space-y-6 text-left">
            <section className="bg-white p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">

              {/* Venue Selection */}
              {loadingVenue ? (
                <div className="py-12 text-center text-gray-500 opacity-60">Loading venues...</div>
              ) : (<div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-xl text-white"><MapPin size={18} /></div>
                  <h3 className="text-sm font-black uppercase text-gray-800 tracking-tighter">Location Details</h3>
                </div>
                {selectedVenueName ? (
                  <div className="p-5 bg-blue-50 border-2 border-blue-100 rounded-3xl flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-blue-900 font-black text-lg">{selectedVenueName}</span>
                      <span className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">Venue Selected</span>
                    </div>
                    <button type="button" onClick={() => setSelectedVenueName("")} className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                      <MapPin size={20} />
                    </button>
                  </div>
                ) : (
                  <select name="venueProviderId" onChange={handleVenueSelection} className="w-full p-5 bg-gray-50 rounded-3xl font-bold border-2 border-transparent focus:border-blue-500 outline-none appearance-none cursor-pointer" required>
                    <option value="">-- Select Venue --</option>
                    {venuesList.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                )}
              </div>)}

              {/* Schedule Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Date</label>
                  <input type="date" name="gameDate" value={formData.gameDate} onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">End Time</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" required />
                </div>
              </div>

              {/* Player and Price Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-2"><Users size={12} /> Player Limit</label>
                  <input type="number" name="maxPlayers" value={formData.maxPlayers} onChange={handleInputChange} className="w-full p-5 bg-gray-50 rounded-3xl font-bold border-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 10" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-2"><IndianRupee size={12} /> Price Per Player</label>
                  <input type="number" name="pricePerPlayer" value={formData.pricePerPlayer} onChange={handleInputChange} className="w-full p-5 bg-gray-50 rounded-3xl font-bold border-none focus:ring-2 focus:ring-blue-500" placeholder="₹" required />
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <select name="gameType" value={formData.gameType} onChange={handleInputChange} className="p-4 bg-gray-50 rounded-2xl font-bold border-none">
                  <option value="5v5">5v5</option>
                  <option value="7v7">7v7</option>
                  <option value="11v11">11v11</option>
                </select>
                <select name="skillLevel" value={formData.skillLevel} onChange={handleInputChange} className="p-4 bg-gray-50 rounded-2xl font-bold border-none uppercase text-xs">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="professional">Professional</option>
                  <option value="open">Open (All levels)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Game Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-5 bg-gray-50 rounded-3xl font-bold border-none h-24 resize-none" placeholder="Add some rules or notes..." />
              </div>
            </section>
          </div>

          {/* Sticky Sidebar with Real Data */}
          <aside className="w-full lg:w-[35%] lg:sticky lg:top-32">
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl space-y-7 relative overflow-hidden">
              <div className="relative z-10 space-y-6">

                <div>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Live Review</p>
                  <h2 className="text-2xl font-black italic tracking-tight truncate">
                    {selectedVenueName || "Select a Venue"}
                  </h2>
                </div>

                <div className="h-[1px] bg-white/10 w-full" />

                {/* Pricing Table */}
                <div className="space-y-4">
                  <div className="space-y-3 bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
                    <div className="flex justify-between items-center text-xs opacity-70">
                      <span>Your Collection amount ({formData.maxPlayers} x ₹{formData.pricePerPlayer})</span>
                      <span className="font-bold">₹{venueTotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs opacity-70">
                      <span>Venue price</span>
                      <span className="font-bold">₹{venueTotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs opacity-70">
                      <span className="flex items-center gap-1">Platform Fee <Info size={10} className="text-blue-500" /></span>
                      <span className="font-bold">+ ₹{platformFee}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs opacity-70">
                      <span className="flex items-center gap-1">Taxes ({rates.taxRate}%) <Percent size={10} className="text-red-500" /></span>
                      <span className="font-bold text-red-400">+ ₹{taxAmount}</span>
                    </div>

                    <div className="h-[1px] bg-white/10 w-full border-dashed my-2" />

                    <div className="flex justify-between items-end">

                      <div className="text-right">
                        <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Per Player</p>
                        <p className="text-xl font-black text-blue-500">₹{formData.pricePerPlayer}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest">Total Pot Value</p>
                        <p className="text-4xl font-black text-white tracking-tighter">₹{totalPot}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Mini Info */}
                <div className="flex gap-4 justify-between items-center px-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />
                    <span className="text-[11px] font-black text-gray-300">{formData.gameDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-blue-500" />
                    <span className="text-[11px] font-black text-gray-300">{formate24to12(  formData.startTime)} - { formate24to12(  formData.endTime)}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading || !formData.venueProviderId} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:grayscale disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <><span>HOST THIS GAME</span> <ChevronRight size={24} /></>}
                </button>
              </div>
              <Trophy size={200} className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 pointer-events-none" />
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
};

export default CreateGame;
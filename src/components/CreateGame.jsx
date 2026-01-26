import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, MapPin, Users, Trophy, 
  ChevronRight, ArrowLeft, Banknote, Search
} from "lucide-react";
import { hostGame, getAllServiceCategories, getServiceProviders } from "../api/apiUtils";
import { paths } from "../routes/paths";
import useLatLngStore from "../store/useLatLngStore";

const CreateGame = () => {
  const { lat, lng } = useLatLngStore(); // Zustand store se lat/lng li
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  
  const [formData, setFormData] = useState({
    sportCategoryId: "",
    venueProviderId: "",
    gameType: "5v5",
    skillLevel: "beginner",
    gameDate: "",
    startTime: "",
    endTime: "23:59", // Default end time as per your API requirements
    maxPlayers: 10,
    pricePerPlayer: 0,
    description: "",
  });

  // 1. Fetch Sports Categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getAllServiceCategories();
        if (res.success) setCategories(res.data);
      } catch (err) {
        toast.error("Categories load failed", err);
      }
    };
    loadCategories();
  }, []);

  // 2. Fetch Venues when Category changes (Passing lat/lng in headers)
  useEffect(() => {
    if (formData.sportCategoryId) {
      const loadVenues = async () => {
        try {
          const res = await getServiceProviders({
            categoryId: formData.sportCategoryId,
            status: "active",
            lat: lat || "28.0229", // Fallback to Bikaner if store is empty
            lng: lng || "73.3119",
            maxDistance: 50
          });
          if (res.success) setVenues(res.data);
        } catch (error) {
          toast.error("Venue fetch error:", error.response?.data?.message);
          setVenues([]); // Reset venues on error
        }
      };
      loadVenues();
    }
  }, [formData.sportCategoryId, lat, lng]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["maxPlayers", "pricePerPlayer", "sportCategoryId", "venueProviderId"];
    
    // Price fix: Allow empty string while typing
    const finalValue = numericFields.includes(name) 
      ? (value === "" ? "" : Number(value)) 
      : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sportCategoryId || !formData.venueProviderId) {
      toast.error("Please select both Sport and Venue!");
      return;
    }

    setLoading(true);
    try {
      // API call using hostGame as requested
      const response = await hostGame(formData); 
      
      if (response.success) {
        toast.success("Game Hosted Successfully!");
        navigate(paths.sports.play); // Navigate to your play path
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to host game";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 font-bold hover:text-green-600 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">Host Game</h1>
        <div className="w-10"></div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Selection */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-black text-green-600 uppercase tracking-widest">01. Selection</h3>
              <p className="text-xs text-gray-400 font-bold uppercase mt-1">Sport & Venue</p>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Select Sport</label>
                <select 
                  name="sportCategoryId" value={formData.sportCategoryId} onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-green-500 outline-none" required
                >
                  <option value="">Choose Sport...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Select Venue</label>
                <select 
                  name="venueProviderId" value={formData.venueProviderId} onChange={handleChange}
                  disabled={!formData.sportCategoryId}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-green-500 disabled:opacity-50 outline-none" required
                >
                  <option value="">{formData.sportCategoryId ? "Choose Venue..." : "Select Sport First"}</option>
                  {venues.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Section 2: Logistics */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-black text-green-600 uppercase tracking-widest">02. Logistics</h3>
              <p className="text-xs text-gray-400 font-bold uppercase mt-1">Time & Pricing</p>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Match Date</label>
                <input type="date" name="gameDate" value={formData.gameDate} onChange={handleChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Price Per Player</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-400 font-bold">₹</span>
                  <input type="number" name="pricePerPlayer" value={formData.pricePerPlayer} onChange={handleChange} className="w-full p-4 pl-8 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-green-500 outline-none" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Max Players</label>
                <input type="number" name="maxPlayers" value={formData.maxPlayers} onChange={handleChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>
            </div>
          </section>

          {/* Footer Action */}
          <footer className="pt-10 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 font-medium italic">* Players will pay directly at the venue or via app.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full md:w-[300px] py-5 bg-green-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-green-100 flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
            >
              {loading ? "HOSTING..." : "HOST GAME"} <ChevronRight />
            </motion.button>
          </footer>
        </form>
      </main>
    </div>
  );
};

export default CreateGame;
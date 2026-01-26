import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronRight, Trophy, Plus,
  MessageSquare, Shield, Loader2, MapPin
} from "lucide-react";
import { hostGame, getAllServiceCategories, getServiceProviders } from "../api/apiUtils";
import { paths } from "../routes/paths";
import useLatLngStore from "../store/useLatLngStore";
import { toast } from "react-hot-toast";

const CreateGame = () => {
  const { lat, lng } = useLatLngStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);

  // UI States
  const [showSkillLevels, setShowSkillLevels] = useState(false);
  const [isPayAndJoin, setIsPayAndJoin] = useState(false);
  const [isCustomGameType, setIsCustomGameType] = useState(false);

  const [formData, setFormData] = useState({
    sportCategoryId: "",
    venueProviderId: "",
    gameType: "Regular",
    customGameType: "",
    skillLevel: "beginner", // Default lowercase for API
    gameDate: "",
    startTime: "",
    endTime: "",
    maxPlayers: 10,
    pricePerPlayer: 0,
    description: "",
    bringEquipment: false,
    costShared: false,
    instructionDesc: ""
  });

  // 1. Initial Data Load from Booking Page
  useEffect(() => {
    if (location.state) {
      const { venue, selectedSlots, selectedDate, selectedService } = location.state;
      setFormData(prev => ({
        ...prev,
        sportCategoryId: selectedService?.sport_id || selectedService?.id || "",
        venueProviderId: venue?.id || "",
        gameDate: selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : "",
        startTime: selectedSlots?.[0]?.startTime || "",
        endTime: selectedSlots?.[0]?.endTime || "",
      }));
    }
  }, [location.state]);

  // 2. Fetch Categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getAllServiceCategories();
        if (res.success) setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load sports categories");
      }
    };
    loadCategories();
  }, []);

  // 3. Fetch Venues
  useEffect(() => {
    if (formData.sportCategoryId) {
      const loadVenues = async () => {
        try {
          const res = await getServiceProviders({
            categoryId: formData.sportCategoryId,
            status: "active",
            lat: lat || "28.0229",
            lng: lng || "73.3119",
            maxDistance: 50
          });
          if (res.success) setVenues(res.data);
        } catch (error) {
          setVenues([]);
        }
      };
      loadVenues();
    }
  }, [formData.sportCategoryId, lat, lng]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["maxPlayers", "pricePerPlayer", "sportCategoryId", "venueProviderId"];
    const finalValue = numericFields.includes(name) ? (value === "" ? "" : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sportCategoryId || !formData.venueProviderId) {
      return toast.error("Please select Sport and Venue!");
    }

    setLoading(true);
    try {
      // Final Payload Construction
      const payload = {
        sportCategoryId: Number(formData.sportCategoryId),
        venueProviderId: Number(formData.venueProviderId),
        gameType: isCustomGameType ? formData.customGameType : formData.gameType,
        skillLevel: formData.skillLevel.toLowerCase(), // Ensuring Lowercase
        gameDate: formData.gameDate,
        startTime: formData.startTime,
        endTime: formData.endTime || "23:59",
        maxPlayers: Number(formData.maxPlayers),
        pricePerPlayer: Number(formData.pricePerPlayer),
        description: `${formData.instructionDesc} ${formData.bringEquipment ? '[Bring Equipment]' : ''} ${formData.costShared ? '[Cost Shared]' : ''}`.trim() || "Friendly match!"
      };

      const response = await hostGame(payload);
      if (response.success) {
        toast.success("Game Hosted Successfully!");
        navigate(paths.sports.myGames);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Validation failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const gameTypes = ["Regular", "5v5", "T20", "Coaching", "Tournament"];
  const skillLevels = ["beginner", "intermediate", "professional", "open"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <nav className="sticky top-0 z-50 bg-white border-b px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 font-bold">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-lg font-black uppercase italic">Create Game</h1>
        <div className="w-10"></div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section 1: Venue & Logistics */}
          <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">01. Venue & Timing</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Sport</label>
                <select
                  name="sportCategoryId"
                  value={formData.sportCategoryId}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Sport...</option>
                  {categories
                    .filter(cat => ["sports", "fitness"].includes(cat.name.toLowerCase()))
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Venue</label>
                <select
                  name="venueProviderId" value={formData.venueProviderId} onChange={handleChange}
                  disabled={!formData.sportCategoryId}
                  className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" required
                >
                  <option value="">Choose Venue...</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Match Date</label>
                <input type="date" name="gameDate" value={formData.gameDate} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Exit Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none" required />
              </div>
            </div>
          </section>

          {/* Section 2: Game Format */}
          <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">02. Game Format</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {gameTypes.map((type) => (
                <button
                  key={type} type="button"
                  onClick={() => { setFormData({ ...formData, gameType: type }); setIsCustomGameType(false); }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${formData.gameType === type && !isCustomGameType ? "bg-black text-white shadow-lg" : "bg-gray-50 text-gray-500"}`}
                >
                  {type}
                </button>
              ))}
              <button
                type="button" onClick={() => setIsCustomGameType(true)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 ${isCustomGameType ? "bg-black text-white shadow-lg" : "bg-gray-50 text-gray-500"}`}
              >
                <Plus size={14} /> Custom
              </button>
            </div>
            {isCustomGameType && (
              <input
                type="text" placeholder="Enter your custom game type..."
                className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold border-2 border-blue-100 outline-none focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, customGameType: e.target.value })}
                required
              />
            )}
          </section>

          {/* Section 3: Skill Level */}
          <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-blue-600" />
                <span className="text-sm font-black uppercase italic text-gray-800">Competitive Skill Level</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={showSkillLevels} onChange={(e) => setShowSkillLevels(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            {showSkillLevels && (
              <div className="flex flex-wrap gap-2 mt-5">
                {skillLevels.map(level => (
                  <button
                    key={level} type="button"
                    onClick={() => setFormData({ ...formData, skillLevel: level })}
                    className={`flex-1 min-w-[120px] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.skillLevel === level ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-50 text-gray-400"}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Section 4: Instructions */}
          <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-orange-500" />
              <h3 className="text-sm font-black uppercase italic">Game Instructions</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all">
                <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={formData.bringEquipment} onChange={(e) => setFormData({ ...formData, bringEquipment: e.target.checked })} />
                <span className="text-xs font-bold text-gray-700">Bring your own equipment</span>
              </label>
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all">
                <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={formData.costShared} onChange={(e) => setFormData({ ...formData, costShared: e.target.checked })} />
                <span className="text-xs font-bold text-gray-700">Cost Shared</span>
              </label>
              <textarea
                placeholder="Write any specific match rules or description..."
                className="w-full p-4 bg-gray-50 rounded-2xl text-xs font-medium border-none outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-none"
                value={formData.instructionDesc}
                onChange={(e) => setFormData({ ...formData, instructionDesc: e.target.value })}
              />
            </div>
          </section>

          {/* Section 5: Payments */}
          <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-800">User Pay & Join</h3>
                <p className="text-[10px] text-gray-400">System handles spot reservations</p>
              </div>
              <button type="button" onClick={() => setIsPayAndJoin(!isPayAndJoin)} className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${isPayAndJoin ? 'bg-green-500 justify-end' : 'bg-gray-200 justify-start'}`}>
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
            <AnimatePresence>
              {isPayAndJoin && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-2 gap-3 pt-5 mt-4 border-t border-dashed overflow-hidden">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Max Players</label>
                    <input type="number" name="maxPlayers" value={formData.maxPlayers} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border focus:border-blue-200" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Price Per Slot</label>
                    <input type="number" name="pricePerPlayer" value={formData.pricePerPlayer} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border focus:border-blue-200" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <button
            type="submit" disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:shadow-none"
          >
            {loading ? <Loader2 className="animate-spin" /> : "CREATE MATCH"} <ChevronRight size={20} />
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateGame;
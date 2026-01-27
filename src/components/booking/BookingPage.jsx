import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  Loader2, MapPin, ArrowLeft, Calendar, Trophy, 
  Clock, Timer, ChevronRight, Info, Ticket, Percent, X, Users 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProviderById, getProviderServices, getProviderSlots } from "../../api/apiUtils.js";
import { paths } from "../../routes/paths.js";
import useSportsStore from "../../store/useSportsStore.js";
import { getDayOfWeek, getTime } from "../../utils/helpers";
import { calculateNetPerHour } from "../../utils/calculateNetPerHour.js";
import { PayLaterModal } from "../../components/PayLaterModal";
import toast from "react-hot-toast";

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { providerId: provider_id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showPayLaterInfo, setShowPayLaterInfo] = useState(false);
  const [showCouponDrawer, setShowCouponDrawer] = useState(false);

  const durations = [60, 120, 180];
  const { setSelectedGround, setSelectedDate: setStoreDate, setSelectedSport, setSelectedSlots: setStoreSlots, setTotalPrice, selectedGround: venueStore } = useSportsStore();
  const venue = venueStore || location.state?.venue;

  // --- HELPERS ---
  const formatSlotTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const d = new Date(); d.setHours(parseInt(hours), parseInt(minutes), 0);
    return getTime(d.toISOString());
  };

  const parseMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // --- DATA LOADING ---
  useEffect(() => {
    const loadData = async () => {
      if (!provider_id) { setLoading(false); setError("Invalid ID"); return; }
      setLoading(true);
      try {
        const providerRes = await getProviderById(provider_id);
        if (providerRes?.data) setSelectedGround(providerRes.data);
        const servicesRes = await getProviderServices(provider_id, { status: "active", approval_status: "approved" });
        const list = Array.isArray(servicesRes) ? servicesRes : servicesRes?.data || [];
        setServices(list);
        if (list.length > 0) setSelectedService(list[0]);
      } catch (err) { setError("Failed to load"); } finally { setLoading(false); }
    };
    loadData();
  }, [provider_id, setSelectedGround]);

  useEffect(() => {
    if (!provider_id || !selectedService) return;
    const fetchSlots = async () => {
      setSlotsLoading(true); setSelectedSlots([]);
      try {
        const dateStr = selectedDate.toLocaleDateString('en-CA');
        const res = await getProviderSlots(provider_id, { date: dateStr, serviceIds: [selectedService.id] });
        const fetchedSlots = res?.slots || (Array.isArray(res) ? res : res?.data || []);
        setSlots(fetchedSlots.slots || []);
      } catch (err) { setSlots([]); } finally { setSlotsLoading(false); }
    };
    fetchSlots();
  }, [provider_id, selectedService, selectedDate]);

  const handleSlotClick = (startSlot) => {
    const currentSlotsList = Array.isArray(slots) ? slots : (slots?.slots || []);
    const sorted = [...currentSlotsList].sort((a, b) => parseMinutes(a.startTime) - parseMinutes(b.startTime));
    const startIdx = sorted.findIndex(s => s.startTime === startSlot.startTime);
    const slotsNeeded = selectedDuration / 60;
    const selection = sorted.slice(startIdx, startIdx + slotsNeeded);

    if (selection.length < slotsNeeded) return toast.error("Slots not available.");
    if (selection.some(s => s.status !== 'available')) return toast.error("Slots already booked.");
    setSelectedSlots(selection);
  };

  const applyCoupon = (code) => {
    if (code.toUpperCase() === "PLAY50") {
      setDiscountAmount(50); setCouponCode("PLAY50"); toast.success("Discount Applied!");
    } else { toast.error("Invalid Coupon"); }
    setShowCouponDrawer(false);
  };

  const basePricePerHour = Number(selectedService?.price || 0);
  const platformFee = Number(venue?.category?.platformFee || 0);
  const taxRate = Number(venue?.category?.taxRate || 0);
  const subTotal = basePricePerHour * (selectedDuration / 60);
  const calculatedPrice = calculateNetPerHour(basePricePerHour, platformFee, taxRate, selectedDuration);
  const grandTotal = Math.max(0, calculatedPrice - discountAmount);
  const partialAllowed = venue?.category?.partialPaymentAllowed === 1;
  const partialPercentage = venue?.category?.partialPaymentPercentage || 0;
  const advanceToPay = Math.round((grandTotal * partialPercentage) / 100);

  const handleBook = () => {
    if (selectedSlots.length === 0) return toast.error("Select a slot first");
    setStoreDate(selectedDate.toISOString());
    setSelectedSport(selectedService);
    setStoreSlots(selectedSlots);
    setTotalPrice(paymentMethod === "online" ? grandTotal : advanceToPay);
    navigate(paths.sports.bookingSummary, { state: { paymentMethod } });
  };

  const handleCreateGame = () => {
    if (selectedSlots.length === 0) return toast.error("Select a slot to host a game");
    navigate(paths.sports.createGame, { 
        state: { 
            venue, 
            service: selectedService, 
            slots: selectedSlots, 
            date: selectedDate 
        } 
    });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Loading Stadium...</p>
    </div>
  );

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <PayLaterModal open={showPayLaterInfo} onClose={() => setShowPayLaterInfo(false)} totalAmount={grandTotal} advanceAmountValue={partialPercentage} />

      <nav className="bg-white border-b sticky top-0 z-30 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></button>
          <h1 className="text-xl font-black uppercase tracking-tight">Select Slot</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-6">
            {/* 1. Date */}
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={14} className="text-blue-600" /> 1. Select Date</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {dates.map((date) => (
                  <button key={date.toISOString()} onClick={() => setSelectedDate(date)} className={`flex flex-col items-center min-w-[75px] py-4 rounded-2xl border-2 transition-all ${date.toDateString() === selectedDate.toDateString() ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-white border-gray-100 text-gray-500"}`}>
                    <span className="text-[10px] font-bold uppercase mb-1">{getDayOfWeek(date.toISOString()).slice(0, 3)}</span>
                    <span className="text-xl font-black">{date.getDate()}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* 2 & 3. Sport & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2"><Trophy size={14} className="text-blue-600" /> 2. Sport</h3>
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <button key={s.id} onClick={() => setSelectedService(s)} className={`px-4 py-2 rounded-full text-[10px] font-black border-2 transition-all uppercase ${selectedService?.id === s.id ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-gray-100 text-gray-600"}`}>{s.name}</button>
                  ))}
                </div>
              </section>
              <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2"><Timer size={14} className="text-blue-600" /> 3. Duration</h3>
                <div className="grid grid-cols-3 gap-2">
                  {durations.map((dur) => (
                    <button key={dur} onClick={() => { setSelectedDuration(dur); setSelectedSlots([]); }} className={`py-3 rounded-xl text-[10px] font-black border-2 transition-all uppercase ${selectedDuration === dur ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-gray-100 text-gray-400"}`}>{dur / 60} Hr</button>
                  ))}
                </div>
              </section>
            </div>

            {/* 4. Slots */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[300px]">
              <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2"><Clock size={14} className="text-blue-600" /> 4. Select Time</h3>
              {slotsLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-400" /></div> : 
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {slots.map((slot, i) => {
                    const isSelected = selectedSlots.some(s => s.startTime === slot.startTime);
                    const isAvailable = slot.status === "available";
                    return (
                      <button key={i} disabled={!isAvailable} onClick={() => handleSlotClick(slot)} className={`py-4 rounded-2xl text-[11px] font-black border-2 transition-all ${isSelected ? "bg-blue-600 border-blue-600 text-white shadow-lg" : isAvailable ? "bg-gray-50 border-transparent text-gray-700 hover:border-blue-200" : "bg-gray-100 text-gray-300 opacity-40"}`}>{formatSlotTime(slot.startTime)}</button>
                    );
                  })}
                </div>
              }
            </section>

            {/* 5. Payment Mode */}
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2"><Info size={14} className="text-blue-600" /> 5. Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div onClick={() => setPaymentMethod("online")} className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'online' ? 'border-blue-600 bg-blue-50' : 'border-gray-100'}`}>
                  <span className="text-xs font-black uppercase">Pay Full Online</span>
                  <span className="text-xs font-black">₹{grandTotal}</span>
                </div>
                {partialAllowed && (
                  <div onClick={() => setPaymentMethod("partial")} className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'partial' ? 'border-blue-600 bg-blue-50' : 'border-gray-100'}`}>
                    <div className="flex flex-col"><span className="text-xs font-black uppercase">Pay Later</span><button onClick={(e) => {e.stopPropagation(); setShowPayLaterInfo(true)}} className="text-[9px] text-blue-600 underline text-left font-black">Know More</button></div>
                    <span className="text-xs font-black">₹{advanceToPay}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="lg:w-96 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden lg:sticky lg:top-24">
              <img src={venue?.cover} className="w-full h-40 object-cover" alt="venue" />
              <div className="p-8">
                <h2 className="text-xl font-black text-gray-900 mb-1 uppercase tracking-tight">{venue?.name}</h2>
                <div className="flex items-start gap-1 mb-6 opacity-60"><MapPin size={12} className="text-blue-600" /><p className="text-[9px] font-bold uppercase truncate">{venue?.address}</p></div>

                <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                  <div className="flex justify-between text-[10px] font-black uppercase text-gray-400"><span>Base Price</span><span className="text-gray-900">₹{subTotal}</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs font-black text-gray-900 uppercase">Grand Total</span><span className="text-2xl font-black text-blue-600">₹{grandTotal}</span></div>
                </div>

                <div className="space-y-3 mt-8">
                  {/* MAIN BOOKING BUTTON */}
                  <button disabled={selectedSlots.length === 0} onClick={handleBook} className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50">Confirm Booking</button>
                  
                  {/* THE CREATE GAME BUTTON (Bhai yeh raha!) */}
                  <button 
                    disabled={selectedSlots.length === 0} 
                    onClick={handleCreateGame} 
                    className="w-full py-5 rounded-2xl border-2 border-blue-600 text-blue-600 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-30 disabled:border-gray-200 disabled:text-gray-300"
                  >
                    <Users size={14} /> Host A Game
                  </button>

                  <p className="text-[9px] text-center font-bold text-gray-400 uppercase leading-relaxed px-4">Want to split cost? Host a game and invite others to join!</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2, MapPin, ArrowLeft, Calendar, Trophy, Clock, Timer, ChevronRight, Info } from "lucide-react";
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

  // States
  const [showPayLater, setShowPayLater] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const durations = [60, 120, 180];

  const {
    setSelectedGround,
    setSelectedDate: setStoreDate,
    setSelectedSport,
    setSelectedSlots: setStoreSlots,
    setTotalPrice,
    selectedGround: venueStore
  } = useSportsStore();

  const venue = venueStore || location.state?.venue;

  // Helpers
  const formatSlotTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const d = new Date();
    d.setHours(parseInt(hours), parseInt(minutes), 0);
    return getTime(d.toISOString());
  };

  const parseMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // 1. Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      if (!provider_id) {
        setLoading(false);
        setError("Invalid Provider ID");
        return;
      }
      setLoading(true);
      try {
        const providerRes = await getProviderById(provider_id);
        if (providerRes?.data) setSelectedGround(providerRes.data);

        const servicesRes = await getProviderServices(provider_id, { status: "active", approval_status: "approved" });
        const list = Array.isArray(servicesRes) ? servicesRes : servicesRes?.data || [];
        setServices(list);
        if (list.length > 0) setSelectedService(list[0]);
      } catch (err) {
        setError("Failed to load venue details");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [provider_id, setSelectedGround]);

  // 2. Fetch Slots
  useEffect(() => {
    if (!provider_id || !selectedService) return;
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSelectedSlots([]);
      try {
        const dateStr = selectedDate.toLocaleDateString('en-CA');
        const res = await getProviderSlots(provider_id, { date: dateStr, serviceIds: [selectedService.id] });
        const fetchedSlots = res?.slots || (Array.isArray(res) ? res : res?.data || []);
        setSlots(fetchedSlots);
      } catch (err) {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [provider_id, selectedService, selectedDate]);

  // 3. Slot Selection Logic
  const handleSlotClick = (startSlot) => {
    const currentSlotsList = Array.isArray(slots) ? slots : (slots?.slots || []);
    const sorted = [...currentSlotsList].sort((a, b) => parseMinutes(a.startTime) - parseMinutes(b.startTime));

    const startIdx = sorted.findIndex(s => s.startTime === startSlot.startTime);
    const slotsNeeded = selectedDuration / 60;
    const selection = sorted.slice(startIdx, startIdx + slotsNeeded);

    if (selection.length < slotsNeeded) return toast.error("Enough consecutive slots not available.");
    if (selection.some(s => s.status !== 'available')) return toast.error("Some slots in this range are already booked.");

    for (let i = 0; i < selection.length - 1; i++) {
      if (parseMinutes(selection[i].endTime) !== parseMinutes(selection[i + 1].startTime)) {
        return toast.error("There is a gap between these slots.");
      }
    }
    setSelectedSlots(selection);
  };

  // 4. Pricing & Pay Later Logic
  const basePricePerHour = Number(selectedService?.price || 0);
  const platformFee = Number(venue?.category?.platformFee || 0);
  const taxRate = Number(venue?.category?.taxRate || 0);

  const calculatedPrice = calculateNetPerHour(
    basePricePerHour,
    platformFee,
    taxRate,
    selectedDuration
  );

  const partialAllowed = venue?.category?.partialPaymentAllowed === 1;
  const partialPercentage = venue?.category?.partialPaymentPercentage || 0;
  const advanceToPay = Math.round((calculatedPrice * partialPercentage) / 100);

  const handleBook = () => {
    if (selectedSlots.length === 0 || !selectedService) return;
    setStoreDate(selectedDate.toISOString());
    setSelectedSport(selectedService);
    setStoreSlots(selectedSlots);
    setTotalPrice(calculatedPrice);
    navigate(paths.sports.bookingSummary);
  };

  const handleHostGame = () => {
    if (selectedSlots.length === 0 || !selectedService) {
      return toast.error("Please select slots first.");
    }
    navigate(paths.sports.createGame, {
      state: { venue, selectedSlots, selectedDate, selectedService }
    });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="text-gray-400 font-medium tracking-tight uppercase text-[10px] tracking-[0.2em]">Loading Stadium...</p>
    </div>
  );

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      {/* Pay Later Modal */}
      <PayLaterModal 
        open={showPayLater} 
        onClose={() => setShowPayLater(false)}
        totalAmount={calculatedPrice}
        advanceAmountValue={partialPercentage}
      />

      <nav className="bg-white border-b sticky top-0 z-30 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Select Slot</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-6">
            {/* 1. Date Selection */}
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" /> 1. Select Date
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {dates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center min-w-[75px] py-4 rounded-2xl border-2 transition-all ${
                      date.toDateString() === selectedDate.toDateString()
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                        : "bg-white border-gray-100 text-gray-500 hover:border-blue-200"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase mb-1">{getDayOfWeek(date.toISOString()).slice(0, 3)}</span>
                    <span className="text-xl font-black">{date.getDate()}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 2. Sport Selection */}
              <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-blue-600" /> 2. Sport
                </h3>
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black border-2 transition-all uppercase tracking-wider ${
                        selectedService?.id === s.id ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-gray-100 text-gray-600"
                      }`}
                    >
                      {s.name} - ₹{s.price}/hr
                    </button>
                  ))}
                </div>
              </section>

              {/* 3. Duration Selection */}
              <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Timer className="h-4 w-4 text-blue-600" /> 3. Duration
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {durations.map((dur) => (
                    <button
                      key={dur}
                      onClick={() => { setSelectedDuration(dur); setSelectedSlots([]); }}
                      className={`py-3 rounded-xl text-[10px] font-black border-2 transition-all uppercase ${
                        selectedDuration === dur ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-gray-100 text-gray-400"
                      }`}
                    >
                      {dur / 60} Hr{dur > 60 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* 4. Slots Grid */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[300px]">
              <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" /> Select Start Time
              </h3>

              {slotsLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-400" /></div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {(Array.isArray(slots) ? slots : (slots?.slots || slots?.data || [])).map((slot, i) => {
                    const isSelected = selectedSlots.some(s => s.startTime === slot.startTime);
                    const isAvailable = slot.status === "available";
                    return (
                      <button
                        key={i}
                        disabled={!isAvailable}
                        onClick={() => handleSlotClick(slot)}
                        className={`py-4 rounded-2xl text-[11px] font-black border-2 transition-all active:scale-95 ${
                          isSelected ? "bg-blue-600 border-blue-600 text-white shadow-lg" : 
                          isAvailable ? "bg-gray-50 border-transparent text-gray-700 hover:border-blue-200" : 
                          "bg-gray-100 border-transparent text-gray-300 opacity-40 cursor-not-allowed"
                        }`}
                      >
                        {formatSlotTime(slot.startTime)}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Sticky Summary */}
          <aside className="lg:w-96">
            <div className="lg:sticky lg:top-24 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden transition-all">
              <img src={venue?.cover || "https://placehold.co/400x200"} className="w-full h-48 object-cover" alt="venue" />
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">{venue?.name}</h2>
                <div className="flex items-start gap-1 mb-8 opacity-60">
                  <MapPin size={12} className="text-blue-600 mt-0.5" />
                  <p className="text-[10px] font-bold uppercase tracking-tight truncate">{venue?.address}</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-dashed border-gray-200">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Sport</span>
                    <span className="text-gray-900">{selectedService?.name || '---'}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Duration</span>
                    <span className="text-gray-900">{selectedDuration / 60} Hr(s)</span>
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <span className="text-xs font-black text-gray-900 uppercase">Total Bill</span>
                    <span className="text-3xl font-black text-blue-600 tracking-tighter">₹{calculatedPrice}</span>
                  </div>

                  {/* Partial Payment Preview Box */}
                  {partialAllowed && selectedSlots.length > 0 && (
                    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-[1.5rem] mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Partial Pay Available</span>
                        <button onClick={() => setShowPayLater(true)} className="text-[10px] font-black text-blue-700 underline underline-offset-2">INFO</button>
                      </div>
                      <p className="text-[11px] text-blue-900 font-bold uppercase tracking-tight">
                        Pay ₹{advanceToPay} now <span className="font-normal opacity-60 ml-1">& book instantly</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mt-10">
                   <button
                    disabled={selectedSlots.length === 0}
                    onClick={handleBook}
                    className={`w-full py-5 rounded-[1.2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all ${
                      selectedSlots.length > 0 ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    Proceed to Review <ChevronRight size={14} />
                  </button>

                  <button
                    onClick={handleHostGame}
                    disabled={selectedSlots.length === 0}
                    className={`w-full py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${
                      selectedSlots.length > 0 ? "border-blue-600 text-blue-600 bg-white" : "border-gray-100 text-gray-300"
                    }`}
                  >
                    <Trophy size={14} /> Host a Match
                  </button>
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
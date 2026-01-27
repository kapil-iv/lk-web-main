import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Calendar, Clock, Trophy, Loader2, 
  ShieldCheck, Coins, ReceiptText, ChevronRight, Info, Timer 
} from "lucide-react";
import useSportsStore from "../../store/useSportsStore";
import { useRazorpay } from "../../services/payment.service";
import { verifyPayment } from "../../services/payment.service";
import toast, { Toaster } from "react-hot-toast";
import { createBooking, getUsersWallet } from "../../api/apiUtils";
import format24To12 from '../../utils/helpers';

const BookingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { initiatePayment, isPaymentLoading } = useRazorpay();

  const paymentType = location.state?.paymentMethod || "online"; 

  const {
    selectedGround: venue,
    selectedDate,
    selectedSport,
    selectedSlots,
    totalPrice 
  } = useSportsStore();

  const [userWallet, setUserWallet] = useState(null);
  const [kCoinsSelected, setKCoinsSelected] = useState(false);
  const [coinsUsage, setCoinsUsage] = useState(0);
  const [kCoinInCurrency, setKCoinInCurrency] = useState(0);
  const [finalPayableAmount, setFinalPayableAmount] = useState(totalPrice);
  const [notes, setNotes] = useState("");

  const taxRate = Number(venue?.category?.taxRate || 0);
  const platformFee = Number(venue?.category?.platformFee || 0);
  const basePricePerSlot = Number(selectedSport?.price || 0);
  const subTotal = basePricePerSlot * (selectedSlots?.length || 0);
  const fullGrandTotal = subTotal + platformFee + ((subTotal * taxRate) / 100);
  const isPartial = paymentType === "partial";

  useEffect(() => {
    const fetchUserWallet = async () => {
      try {
        const response = await getUsersWallet();
        if (response?.success) setUserWallet(response?.data?.wallet);
      } catch (error) { console.error("Wallet error:", error); }
    };
    fetchUserWallet();
  }, []);

  useEffect(() => {
    let currentAmount = Number(totalPrice || 0);
    if (selectedSport?.isKcoinEnabled && currentAmount >= (selectedSport?.kcoinMinimumOrderValue || 0)) {
      const availableBalance = userWallet?.availableBalance || 0;
      const maximumRedemption = Math.floor((currentAmount * (selectedSport?.kcoinMaximumOrderPercentageRedem || 0)) / 100);
      const maxUsedKcoin = Math.min(availableBalance, maximumRedemption);
      setCoinsUsage(maxUsedKcoin);
      setKCoinInCurrency(Math.floor(maxUsedKcoin / Number(selectedSport?.kcoinToCurrency || 1)));
    }
    if (kCoinsSelected) { currentAmount -= Number(kCoinInCurrency); }
    setFinalPayableAmount(currentAmount);
  }, [selectedSport, totalPrice, userWallet, kCoinsSelected, kCoinInCurrency]);

  const handleBooking = async () => {
    setLoading(true);
    try {
      const bookingDate = new Date(selectedDate);
      const slotStartTime = selectedSlots[0]?.startTime;
      if (slotStartTime) {
        const [hours, minutes] = slotStartTime.split(':');
        bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }
      const pad = (num) => String(num).padStart(2, '0');
      const formattedTime = `${bookingDate.getFullYear()}-${pad(bookingDate.getMonth() + 1)}-${pad(bookingDate.getDate())} ${pad(bookingDate.getHours())}:${pad(bookingDate.getMinutes())}:00`;

      const payload = {
        categoryId: Number(selectedSport.categoryId),
        providerId: Number(venue.id),
        bookingType: "store",
        scheduledTime: formattedTime,
        notes: notes.trim() || `Booking for ${selectedSport.name}`,
        paymentMode: isPartial ? "cod" : "online",
        kcoinAmountToUse: kCoinsSelected ? Number(coinsUsage) : 0,
        services: [{ providerServiceId: Number(selectedSport.id), quantity: selectedSlots.length }],
        attributes: [{ categoryAttributeId: 1, value: String(selectedSport.name) }],
        address: venue.address || ""
      };

      const response = await createBooking(payload);
      const bookingData = response?.data?.booking || response?.booking;
      const paymentData = response?.data?.payment || response?.payment;

      if (paymentData?.id) {
        await initiatePayment({
          id: paymentData.id,
          amount: paymentData.amount,
          currency: paymentData.currency || "INR",
        }, {
          handler: async (paymentResponse) => {
            await verifyPayment(paymentResponse);
            toast.success("Payment successful!");
            navigate("/success", { state: { booking: bookingData } });
          },
          onFailure: (err) => {
            toast.error(err.description || "Payment Failed");
            setLoading(false);
          }
        });
      } else {
        navigate("/success", { state: { booking: bookingData } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!venue || !selectedSlots?.length) return (
    <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Toaster position="top-center" />
      
      <header className="bg-white border-b sticky top-0 z-40 px-4 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tight text-gray-900">Booking Summary</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: ALL DETAILS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Venue Card */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <img src={venue.logo || venue.cover} className="w-24 h-24 rounded-[1.5rem] object-cover shadow-inner" alt="logo" />
                <div className="text-center md:text-left">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Venue Details</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">{venue.name}</h3>
                  <p className="text-gray-400 text-xs font-medium flex items-center justify-center md:justify-start gap-1 mt-1">
                    <MapPin size={12} className="text-blue-600" /> {venue.address}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Booking Summary Card (The "All Detail" Section) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase mb-6 flex items-center gap-2 tracking-[0.2em]">
                <Info size={14} className="text-blue-600" /> Slot Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-orange-50 rounded-2xl text-orange-600"><Trophy size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Sport</p>
                    <p className="text-lg font-black text-gray-900 uppercase">{selectedSport?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><Calendar size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Scheduled Date</p>
                    <p className="text-lg font-black text-gray-900 uppercase">{new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-4 bg-green-50 rounded-2xl text-green-600"><Clock size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Start Time</p>
                    <p className="text-lg font-black text-gray-900 uppercase">{format24To12(selectedSlots[0]?.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">End Time</p>
                    <p className="text-lg font-black text-gray-900 uppercase">{format24To12(selectedSlots[0]?.endTime)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-4 bg-purple-50 rounded-2xl text-purple-600"><Timer size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Duration</p>
                    <p className="text-lg font-black text-gray-900 uppercase">{selectedSlots.length} Hour{selectedSlots.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. K-Coins & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSport?.isKcoinEnabled && (
                <div className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col justify-between ${kCoinsSelected ? 'border-blue-600 bg-blue-50/30' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <Coins className="text-yellow-500" size={24} />
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase">Use K-Coins</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Balance: {userWallet?.availableBalance || 0}</p>
                    </div>
                  </div>
                  <button onClick={() => setKCoinsSelected(!kCoinsSelected)} className={`w-full py-2 rounded-xl text-[10px] font-black uppercase ${kCoinsSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {kCoinsSelected ? 'Applied' : 'Apply'}
                  </button>
                </div>
              )}

              <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm col-span-1 md:col-span-1 flex-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2"><ReceiptText size={14} /> Add Notes</h3>
                <textarea
                  className="w-full p-3 rounded-xl border-none bg-gray-50 focus:ring-1 focus:ring-blue-200 outline-none text-xs font-medium transition-all"
                  placeholder="Any special requests?"
                  value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: BILL & ACTION */}
          <aside className="lg:col-span-5">
            <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-2xl sticky top-32">
              <h3 className="text-lg font-black uppercase tracking-tight text-center mb-8">Payment Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm uppercase font-bold text-gray-400 text-[11px]">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{subTotal}</span>
                </div>
                <div className="flex justify-between text-sm uppercase font-bold text-gray-400 text-[11px]">
                  <span>Platform Charges</span>
                  <span className="text-gray-900">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-sm uppercase font-bold text-gray-400 text-[11px]">
                  <span>Tax ({taxRate}%)</span>
                  <span className="text-gray-900">₹{((subTotal * taxRate) / 100).toFixed(2)}</span>
                </div>

                {kCoinsSelected && (
                  <div className="flex justify-between text-sm text-green-600 font-black text-[11px] uppercase">
                    <span>K-Coin Applied</span>
                    <span>- ₹{kCoinInCurrency}</span>
                  </div>
                )}

                <div className="pt-6 border-t border-dashed border-gray-200 mt-6">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-black text-gray-900 uppercase">Grand Total</p>
                    <p className="text-3xl font-black text-gray-900">₹{fullGrandTotal.toFixed(0)}</p>
                  </div>
                  
                  {isPartial && (
                    <div className="mt-4 p-4 bg-blue-600 rounded-2xl text-white flex justify-between items-center shadow-lg shadow-blue-100">
                       <span className="text-[10px] font-black uppercase">Payable Now (Advance)</span>
                       <span className="text-2xl font-black">₹{finalPayableAmount}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={loading || isPaymentLoading}
                onClick={handleBooking}
                className="w-full mt-8 py-5 rounded-2xl bg-blue-600 text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                {isPartial ? `Confirm Booking ₹${finalPayableAmount}` : `Pay Now ₹${finalPayableAmount}`}
              </button>

              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase">
                    <ShieldCheck size={12} /> Secure Payment Gateway
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BookingSummary;
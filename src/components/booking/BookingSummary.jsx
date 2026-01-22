import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Trophy, Loader2, Info, ShieldCheck, Coins, ReceiptText } from "lucide-react";
import useSportsStore from "../../store/useSportsStore"; // path as per your request
// import { getDayOfWeek } from "../../utils/helpers";
import { useRazorpay } from "../../services/payment.service";
import { verifyPayment } from "../../services/payment.service";
import toast, { Toaster } from "react-hot-toast";
import { createBooking, getUsersWallet } from "../../api/apiUtils";

const BookingSummary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { initiatePayment, isPaymentLoading } = useRazorpay();

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
  const [finalAmount, setFinalAmount] = useState(totalPrice);
  const [notes, setNotes] = useState("");

  const taxRate = Number(venue?.category?.taxRate || 0);
  const platformFee = Number(venue?.category?.platformFee || 0);
  const totalSlots = selectedSlots?.length || 0;
  const basePricePerSlot = Number(selectedSport?.price || 0);
  const subTotal = basePricePerSlot * totalSlots;
  const totalTax = (subTotal * taxRate) / 100;

  useEffect(() => {
    const fetchUserWallet = async () => {
      try {
        const response = await getUsersWallet();
        if (response?.success) {
          setUserWallet(response?.data?.wallet);
        }
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    };
    fetchUserWallet();
  }, []);

  useEffect(() => {
    let total = Number(totalPrice || 0);
    if (selectedSport?.isKcoinEnabled && total >= (selectedSport?.kcoinMinimumOrderValue || 0)) {
      const availableBalance = userWallet?.availableBalance || 0;
      const maximumRedemption = Math.floor((total * (selectedSport?.kcoinMaximumOrderPercentageRedem || 0)) / 100);
      const maxUsedKcoin = Math.min(availableBalance, maximumRedemption);
      setCoinsUsage(maxUsedKcoin);
      setKCoinInCurrency(Math.floor(maxUsedKcoin / Number(selectedSport?.kcoinToCurrency || 1)));
    }
    if (kCoinsSelected) total -= Number(kCoinInCurrency);
    setFinalAmount(total);
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
      const formattedScheduledTime = `${bookingDate.getFullYear()}-${pad(bookingDate.getMonth() + 1)}-${pad(bookingDate.getDate())} ${pad(bookingDate.getHours())}:${pad(bookingDate.getMinutes())}:00`;

      // STRICTLY FOLLOWING YOUR INTERFACE
      const payload = {
        categoryId: Number(selectedSport.categoryId),
        providerId: Number(venue.id),
        bookingType: "store",
        scheduledTime: formattedScheduledTime,
        notes: notes.trim() || `Booking for ${selectedSport.name}`,
        paymentMode: "online",
        kcoinAmountToUse: kCoinsSelected ? Number(coinsUsage) : 0,
        services: [
          {
            providerServiceId: Number(selectedSport.id),
            quantity: selectedSlots.length,
          }
        ],
        attributes: [
          {
            categoryAttributeId: 1,
            value: String(selectedSport.name),
          }
        ],
        // Optional fields hidden as per interface if not needed
        address: venue.address || ""
      };

      const response = await createBooking(payload);
      const bookingData = response?.data?.booking || response?.booking;
      const paymentData = response?.data?.payment || response?.payment;

      if (paymentData && paymentData.id) {
        await initiatePayment({
          id: paymentData.id,
          amount: paymentData.amount,
          currency: paymentData.currency || "INR",
        }, {
          handler: async (paymentResponse) => {
            try {
              setLoading(true);
              await verifyPayment(paymentResponse);
              toast.success("Payment successful!");
              navigate("/success", { state: { booking: bookingData, payment: paymentData } });
            } catch (err) {
              toast.error("Verification failed.");
            } finally {
              setLoading(false);
            }
          },
          onFailure: (err) => {
            toast.error(err.description || "Payment Cancelled");
            setLoading(false);
          }
        });
      } else {
        navigate("/success", { state: { booking: bookingData } });
      }
    } catch (error) {
      // API validation error handling
      const errorMsg = error.response?.data?.message || "Booking failed (422)";
      toast.error(errorMsg);
      console.error("Payload sent:", error.config?.data);
    } finally {
      setLoading(false);
    }
  };

  if (!venue || !selectedSlots?.length) return null;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Toaster position="top-center" />
      <header className="bg-white border-b sticky top-0 z-30 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-6 w-6" /></button>
          <h1 className="text-xl font-black uppercase">Review & Pay</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 border shadow-sm flex gap-6">
              <img src={venue.logo || "https://placehold.co/400"} className="w-40 h-40 rounded-2xl object-cover" />
              <div>
                <h3 className="text-2xl font-black">{venue.name}</h3>
                <p className="text-gray-500 text-sm mt-2">{venue.address}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border shadow-sm grid grid-cols-3 gap-4">
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Date</p><p className="font-bold">{selectedDate}</p></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Time</p><p className="font-bold">{selectedSlots[0]?.startTime}</p></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Sport</p><p className="font-bold">{selectedSport?.name}</p></div>
            </div>

            <div className="bg-white rounded-3xl p-6 border shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4">Fare Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Base Fare</span><span className="font-bold">₹{subTotal}</span></div>
                <div className="flex justify-between"><span>Taxes</span><span className="font-bold">₹{totalTax}</span></div>
              </div>
            </div>

            <textarea
              className="w-full p-4 rounded-3xl border bg-white focus:ring-2 focus:ring-blue-600/20 outline-none"
              placeholder="Any instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] p-8 border shadow-xl">
              <h3 className="text-xs font-black text-blue-600 uppercase mb-8 text-center">Summary</h3>
              <div className="flex justify-between text-3xl font-black text-blue-600 pt-6 border-t border-dashed">
                <span className="text-sm text-gray-400 self-center">Total</span>
                <span>₹{finalAmount}</span>
              </div>

              <button
                disabled={loading || isPaymentLoading}
                onClick={handleBooking}
                className="w-full h-16 mt-8 rounded-2xl font-black bg-blue-600 text-white flex items-center justify-center gap-3"
              >
                {loading || isPaymentLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
                {loading || isPaymentLoading ? "Processing..." : `Secure Payment`}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BookingSummary;
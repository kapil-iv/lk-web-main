import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar, MapPin, Clock, Receipt, Info, Trophy, Tag, Loader2 } from 'lucide-react';
import { getMyBooking } from '../../api/apiUtils'; // Path check kar lena bhai

const BookingStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // States
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [payment] = useState('');
  const [isLoading, setIsLoading] = useState(!location.state?.booking);

  // Background sync to fetch latest status from API
  useEffect(() => {
    const fetchLatestBooking = async () => {
      try {
        // Hum "all" category aur current status ke saath call kar rahe hain
        // Taki agar user refresh kare toh bhi data mil jaye
        const response = await getMyBooking({ category: "all" });
        
        if (response.success && response.data.length > 0) {
          // Agar redirect se aaye hain, toh latest booking find karo
          // Default: Sabse recent booking utha rahe hain
          const latest = response.data[0]; 
          setBooking(latest);
        }
      } catch (error) {
        console.error("Sync Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestBooking();
  }, []);

  console.log(booking);
  

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="font-black text-gray-900 uppercase tracking-tighter">Syncing Booking...</p>
        </div>
      </div>
    );
  }

  // 2. Safety Guard (No booking found after API check)
  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-sm w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tighter">No Booking Found</h2>
          <p className="text-gray-500 mb-6 text-xs font-medium uppercase leading-relaxed tracking-wider">
            We couldn't find your recent booking. Please check your "My Bookings" section.
          </p>
          <button onClick={() => navigate('/')} className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // 3. Data Extraction
  const provider = booking?.provider || {};
  const service = booking?.services?.[0]?.service || {};
  const attribute = booking?.attributes?.[0] || {};
  
  const rawStatus = booking?.status || "pending";
  const displayStatus = rawStatus.split('_').join(' ');

  const dateObj = booking?.dateAndTime ? new Date(booking.dateAndTime) : new Date();
  const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const subTotal = booking?.subTotal || 0;
  const totalPrice = booking?.totalPrice || 0;
  const remainingAmount = booking?.remainingAmount || 0;
  const platformFee = totalPrice - subTotal;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Ticket View */}
        <div className="lg:col-span-7 animate-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
            
            <div className="bg-blue-600 p-10 text-center relative overflow-hidden">
               {/* Decorative background circle */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl scale-110">
                  <CheckCircle className="h-10 w-10 text-blue-600" strokeWidth={3} />
                </div>
                <h1 className="text-3xl font-black text-white mb-1 uppercase tracking-tighter">Booking Confirmed!</h1>
                <p className="text-blue-100 font-bold text-xs uppercase tracking-[0.2em] opacity-80">
                  ID: #{payment?.id?.slice(-8).toUpperCase() || booking?.id?.toString().slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="relative h-6 bg-white flex items-center justify-center">
                <div className="absolute -left-3 w-6 h-6 bg-[#F8FAFC] rounded-full border-r border-gray-100"></div>
                <div className="absolute -right-3 w-6 h-6 bg-[#F8FAFC] rounded-full border-l border-gray-100"></div>
                <div className="w-full border-b-2 border-dashed border-gray-100 mx-8"></div>
            </div>

            <div className="p-8 lg:p-12 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                   <img src={provider?.logo || "https://via.placeholder.com/150"} alt="logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{provider?.name || "Venue Name"}</h2>
                  <div className="flex items-start gap-1 mt-1 text-gray-500">
                    <MapPin size={14} className="shrink-0 mt-0.5 text-blue-500" />
                    <p className="text-xs font-bold leading-relaxed max-w-xs uppercase tracking-tight">{provider?.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl border border-blue-100">
                  <Trophy size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{service?.name || "Activity"}</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-2xl">
                  <Tag size={14} className="text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{attribute?.value || "Booking"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50/50 rounded-3xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
                  </div>
                  <p className="font-black text-gray-900 uppercase text-sm">{dateStr}</p>
                </div>
                <div className="p-5 bg-gray-50/50 rounded-3xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">TimeSlot</span>
                  </div>
                  <p className="font-black text-gray-900 uppercase text-sm">{timeStr} ({booking?.serviceDuration}m)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Bill & Actions */}
        <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-1000">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-8 flex items-center gap-2">
              <Receipt size={16} className="text-blue-500" /> Invoice Summary
            </h3>
            
           <div className="space-y-4">
  {/* 1. Subtotal */}
  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
    <span className="text-gray-400">Subtotal</span>
    <span className="text-gray-900">₹{Math.round(subTotal)}</span>
  </div>

  {/* 3. Tax Detail (Agar booking data mein available ho) */}
  {booking?.taxAmount > 0 && (
    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
      <span className="text-gray-400">Taxes & GST</span>
      <span className="text-gray-900">₹{Math.round(booking.taxAmount)}</span>
    </div>
  )}

   {/* 2. Platform Fee */}
  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
    <span className="text-gray-400">PlatForm Fee</span>
    <span className="text-gray-900">₹{Math.round(15)}</span>
  </div>

  {/* 2. Platform/Convenience Fee */}
  {/* <div className="flex justify-between text-xs font-black uppercase tracking-widest">
    <span className="text-gray-400">Convenience Fee</span>
    <span className="text-gray-900">₹{Math.round(platformFee)}</span>
  </div> */}


  {/* 4. K-Coins Discount (Agar use hue hain) */}
  {booking?.kcoinAmountUsed > 0 && (
    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-green-600">
      <span>K-Coins Discount</span>
      <span>- ₹{Math.round(booking.kcoinAmountUsed)}</span>
    </div>
  )}

  {/* 5. Total Booking Value (Optional: For clarity) */}
  <div className="flex justify-between text-xs font-black uppercase tracking-widest border-t border-gray-50 pt-2">
    <span className="text-gray-400">Total Value</span>
    <span className="text-gray-900 font-bold">₹{Math.round(totalPrice)}</span>
  </div>

  {/* 6. Remaining Amount (Pay at Venue) */}
  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-orange-600">
    <span>Remaining (Pay at Venue)</span>
    <span>₹{Math.round(booking?.remainingAmount || 0)}</span>
  </div>

  {/* Final Paid Section */}
  <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Amount Paid Online</span>
      <span className="text-sm font-black text-gray-900 uppercase">Paid Now</span>
    </div>
    <span className="text-3xl font-black text-blue-600 tracking-tighter">
      ₹{Math.round(totalPrice - (booking?.remainingAmount || 0))}
    </span>
  </div>
</div>

            <div className="mt-8 p-5 bg-blue-50 rounded-[2rem] border border-blue-100 flex gap-3">
               <Info className="text-blue-600 shrink-0" size={18} />
               <p className="text-[10px] text-blue-800 font-bold uppercase leading-relaxed tracking-wider">
                 Booking Status: <span className="text-blue-900 underline underline-offset-4">{displayStatus}</span>. 
                 Show this QR/Ticket at the entry.
               </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
             <button 
               onClick={() => navigate('/sports')}
               className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
             >
               <Home size={16} /> Finish & Return Home
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStatus;
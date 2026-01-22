import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar, MapPin, Clock, Receipt, Share2, Info, Trophy, Tag } from 'lucide-react';

const BookingStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Destructure the state safely
  const { booking, payment } = location.state || {};
  console.log("Booking: ",booking);
  console.log("Payment: ",payment);
  
  // 1. Initial Safety Guard
  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Booking Found</h2>
          <p className="text-gray-500 mb-6 text-sm">Please check your internet connection or go back to home.</p>
          <button onClick={() => navigate('/')} className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // 2. Safe Data Extraction
  const provider = booking?.provider || {};
  const service = booking?.services?.[0]?.service || {};
  const attribute = booking?.attributes?.[0] || {};
  
  // Status Formatting (Safe Replace)
  const rawStatus = booking?.status || "payment_pending";
  const displayStatus = rawStatus.split('_').join(' ');

  // Date/Time Formatting
  const dateObj = booking?.dateAndTime ? new Date(booking.dateAndTime) : new Date();
  const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Calculation Logic
  const subTotal = booking?.subTotal || 0;
  const totalPrice = booking?.totalPrice || 0;
  const platformFee = totalPrice - subTotal;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Ticket View */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
            
            {/* Header */}
            <div className="bg-[#10B981] p-10 text-center relative">
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-in zoom-in duration-500">
                  <CheckCircle className="h-10 w-10 text-[#10B981]" strokeWidth={3} />
                </div>
                <h1 className="text-3xl font-black text-white mb-1">Booking Reserved!</h1>
                <p className="text-emerald-50 font-medium opacity-90">ID: #{payment?.id?.slice(-8).toUpperCase() || booking?.id}</p>
              </div>
            </div>

            {/* Ticket Cutout Effect */}
            <div className="relative h-6 bg-white flex items-center justify-center">
                <div className="absolute -left-3 w-6 h-6 bg-[#F8FAFC] rounded-full shadow-inner border border-gray-100"></div>
                <div className="absolute -right-3 w-6 h-6 bg-[#F8FAFC] rounded-full shadow-inner border border-gray-100"></div>
                <div className="w-full border-b-2 border-dashed border-gray-100 mx-8"></div>
            </div>

            <div className="p-8 lg:p-12 space-y-8">
              {/* Provider Info */}
              <div className="flex items-center gap-5">
                <img 
                  src={provider?.logo} 
                  alt="logo" 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-50 shadow-sm"
                />
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{provider?.name || "Wicket Zone"}</h2>
                  <div className="flex items-start gap-1 mt-1 text-gray-500">
                    <MapPin size={14} className="shrink-0 mt-0.5 text-blue-500" />
                    <p className="text-xs font-medium leading-relaxed max-w-xs">{provider?.address}</p>
                  </div>
                </div>
              </div>

              {/* Service & Attribute Pills */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl border border-blue-100">
                  <Trophy size={14} />
                  <span className="text-xs font-black uppercase tracking-wider">{service?.name || "Cricket"}</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-2xl border border-purple-100">
                  <Tag size={14} />
                  <span className="text-xs font-black uppercase tracking-wider">{attribute?.value || "Sports"}</span>
                </div>
              </div>

              {/* Date/Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
                  </div>
                  <p className="font-bold text-gray-900">{dateStr}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Clock size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Time & Duration</span>
                  </div>
                  <p className="font-bold text-gray-900">{timeStr} ({booking?.serviceDuration} Mins)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Bill & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-8 flex items-center gap-2">
              <Receipt size={16} className="text-blue-500" /> Payment Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-400 font-medium">Subtotal</span>
                <span className="text-gray-900">₹{subTotal}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-400 font-medium">Platform Fees</span>
                <span className="text-gray-900">₹{platformFee}</span>
              </div>
              <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-lg font-black text-gray-900">Total Paid</span>
                <span className="text-3xl font-black text-blue-600 tracking-tighter">₹{totalPrice}</span>
              </div>
            </div>

            <div className="mt-8 p-5 bg-orange-50 rounded-[2rem] border border-orange-100 flex gap-3">
               <Info className="text-orange-500 shrink-0" size={18} />
               <p className="text-[11px] text-orange-800 font-semibold leading-relaxed">
                 Current Status: <span className="uppercase text-orange-900 font-black">{displayStatus}</span>. 
                 Please show this ticket at the venue.
               </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
             <button 
               onClick={() => navigate('/')}
               className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
             >
               <Home size={16} /> Return to Home
             </button>
             <button className="w-full py-5 bg-white text-gray-500 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] border border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
               <Share2 size={16} /> Share Ticket
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingStatus;
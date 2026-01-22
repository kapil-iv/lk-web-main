import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Tag, Shield, Loader2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import DiscountDrawer from '@/components/utils/DiscountDrawer';
import { createBooking, getCategoryById, cancelBookingById } from "@/api/apiUtils";
import { useRazorpay, verifyPayment } from '@/services/paymentService';
import { toast } from 'react-hot-toast';
import { mergeDateTime } from '@/utils/formatdate';
import { cleanLocationText } from '@/utils/cleanLocationText';

const BookingPage = () => {
  const { id, provider_id } = useParams();
  const activeId = id || provider_id; // Works for both route definitions
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { setBookingDetails } = useEvents();
  const location = useLocation();
  const { initiatePayment, isPaymentLoading } = useRazorpay();

  /* Expects state to contain:
     - mainData: { id, title, venue, providerId, categoryId, bookingType (optional) }
     - lineItems: Array of { id, name, quantity, pricePerItem, totalPrice }
     - schedule: { date, time }
  */
  const {
    mainData,
    lineItems = [],
    schedule = { date: null, time: null }
  } = location.state || {};

  const [bookingStatus, setBookingStatus] = useState('idle');
  const [bookingId, setBookingId] = useState(null);
  const [appliedDiscounts, setAppliedDiscounts] = useState([]);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [platformFee, setPlatformFee] = useState(0);

  // Safety Redirect
  useEffect(() => {
    if (!mainData || !lineItems.length) {
      toast.error("Session expired. Please select items again.");
      navigate(-1);
    }
  }, [mainData, lineItems, navigate]);

  // Fetch Platform Fee based on Category
  useEffect(() => {
    const fetchPlatformFee = async () => {
      if (mainData?.categoryId) {
        try {
          const response = await getCategoryById(mainData.categoryId);
          if (response?.success && response?.data?.platformFee) {
            setPlatformFee(Number(response.data.platformFee));
          }
        } catch (error) { console.error('Fee fetch error:', error); }
      }
    };
    fetchPlatformFee();
  }, [mainData?.categoryId]);

  if (!mainData) return null;

  // Calculation Logic
  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const promoDiscountAmount = appliedDiscounts.reduce((total, discount) => {
    const val = discount.discountAmount || discount.savings || 0;
    if (val) return total + Number(val);

    const percent = discount.discountPercent || discount.value || 0;
    const percentSavings = (subtotal * Number(percent)) / 100;
    return total + (discount.maxDiscountAmount ? Math.min(percentSavings, discount.maxDiscountAmount) : percentSavings);
  }, 0);

  const finalTotal = subtotal - promoDiscountAmount + platformFee;

  // Unified Booking Handler
  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to continue');
      openAuthModal();
      return;
    }

    setBookingStatus('processing');
    setIsProcessing(true);

    try {
      // Date Conversion Logic
      const convertDateFormat = (dateStr) => {
        const d = new Date(dateStr);
        return format(d, 'dd-MM-yyyy');
      };

      const scheduledTime = mergeDateTime(
        convertDateFormat(schedule.date),
        schedule.time || '10:00 AM'
      );

      // Generic Services Payload
      const services = [{
        providerServiceId: mainData.providerServiceId || mainData.id,
        quantity: 1,
        variants: lineItems.map(item => ({
          spServiceVariantId: item.id,
          qty: item.quantity
        }))
      }];

      const bookingPayload = {
        categoryId: mainData.categoryId,
        providerId: mainData.providerId,
        bookingType: mainData.bookingType || "store", // "sports", "store", "appointment"
        scheduledTime,
        notes: "",
        kcoinAmountToUse: 0,
        paymentMode: "online",
        services,
        attributes: [],
        discountCode: appliedDiscounts[0]?.code,
        cities: appliedDiscounts[0]?.cities || ['Bikaner'],
      };

      const response = await createBooking(bookingPayload);
      const createdId = response?.data?.booking?.id || response?.data?.id;
      const paymentOrder = response?.data?.payment;

      if (!createdId || !paymentOrder) throw new Error('Booking failed to initialize');

      setBookingId(createdId);

      const razorpayOptions = {
        handler: async function (paymentResponse) {
          try {
            const verification = await verifyPayment(paymentResponse);
            if (verification.success) {
              const successState = {
                bookingId: createdId,
                bookingCode: response?.data?.bookingCode || createdId,
                mainData,
                lineItems,
                total: finalTotal.toFixed(2)
              };
              setBookingDetails(successState);
              setBookingStatus('success');
              toast.success('Confirmed Successfully!');
              navigate('/booking/confirmation', { state: successState });
            }
          } catch (err) {
            setBookingStatus('error');
            toast.error('Verification failed. Contact support.');
          } finally { setIsProcessing(false); }
        },
        modal: {
          ondismiss: async () => {
            await cancelBookingById(createdId, { reason: 'User cancelled payment' });
            setBookingStatus('idle');
            setIsProcessing(false);
            toast.error('Payment cancelled');
          }
        }
      };

      initiatePayment(paymentOrder, razorpayOptions);

    } catch (error) {
      setBookingStatus('error');
      toast.error(error.response?.data?.message || 'Processing failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* <Header /> */}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-all">
          <ArrowLeft size={18} />
          <span className="font-medium">Go Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Checkout Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Safe & Secure Booking</h2>
                <p className="text-sm text-gray-500">Your transaction is protected with industry-standard encryption.</p>
              </div>
            </div>

            <DiscountDrawer
              appliedDiscounts={appliedDiscounts}
              setAppliedDiscounts={setAppliedDiscounts}
              dataToFetchDiscount={{
                providerId: mainData.providerId,
                categoryId: mainData.categoryId,
                bookingAmount: subtotal,
                serviceIds: [mainData.providerServiceId || mainData.id],
                paymentMode: 'online'
              }}
              loading={discountLoading}
              setLoading={setDiscountLoading}
              user={user}
              openAuthModal={openAuthModal}
            />

            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex gap-3">
              <Info className="text-blue-500 shrink-0" size={20} />
              <p className="text-sm text-blue-800 leading-relaxed">
                By clicking "Confirm & Pay", you agree to the <strong>Cancellation Policy</strong> and <strong>Terms of Service</strong> for {mainData.title}.
              </p>
            </div>
          </div>

          {/* RIGHT: Summary Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl sticky top-24"
            >
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Order Summary</h2>

              {/* Item Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3">{mainData.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar size={14} className="text-blue-500" />
                    <span>{format(new Date(schedule.date), 'EEE, dd MMM yyyy')} • {schedule.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={14} className="text-blue-500" />
                    <span className="line-clamp-1">{cleanLocationText(mainData.venue)}</span>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3 mb-6">
                {lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.name}</p>
                      <p className="text-[10px] uppercase font-black text-gray-400">Qty: {item.quantity} × ₹{item.pricePerItem}</p>
                    </div>
                    <span className="font-bold text-gray-900">₹{item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t pt-5">
                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {appliedDiscounts.map((d, i) => (
                  <div key={i} className="flex justify-between text-green-600 text-sm font-bold">
                    <span className="flex items-center gap-1"><Tag size={12} /> {d.code}</span>
                    <span>-₹{promoDiscountAmount.toLocaleString()}</span>
                  </div>
                ))}

                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>Platform Fee</span>
                  <span>₹{platformFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <span className="text-gray-900 font-bold uppercase text-xs tracking-widest">Total Payable</span>
                  <span className="text-3xl font-black text-gray-900">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                disabled={isProcessing || isPaymentLoading}
                className="w-full mt-8 bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-gray-200 hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirm & Pay'}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
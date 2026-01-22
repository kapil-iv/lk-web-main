import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { format, parseISO, isValid } from 'date-fns';
import { SkeletonHero } from './Skeleton';
import { getAllServices } from '../api/apiUtils';
import { cleanLocationText } from '../utils/cleanLocationText';

const HeroSection = () => {
  const { events, isLoading } = useEvents();
  const [apiEvents, setApiEvents] = useState([]);
  const [processingData, setProcessingData] = useState(true);

  // Fetch services from API and enrich
  useEffect(() => {
    let cancelled = false;
    const fetchServices = async () => {
      try {
        const result = await getAllServices(7, 'active', 'approved');
        if (!cancelled && result?.success && Array.isArray(result?.data)) {
          const srv = result.data;
          // Enrich similar to EventsListPage
          const toRad = (value) => (value * Math.PI) / 180;
          const calcDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // KM
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return +(R * c).toFixed(2);
          };
          const parseIfJSON = (val) => {
            if (typeof val === 'object') return val;
            try { return JSON.parse(val); } catch { return {}; }
          };
          let currLocation = null;
          try {
            const locStr = localStorage.getItem('location');
            currLocation = locStr ? JSON.parse(locStr) : null;
          } catch { }
          if (!currLocation?.lat || !currLocation?.long) {
            currLocation = { lat: '28.031097', long: '73.319387' };
          }

          const enriched = [];
          srv.forEach((event) => {
            if (event?.provider?.isActive) {
              let eventDate = '';
              let eventTime = '';
              let eventLocation = {};
              let eventDistance = null;

              event?.attributes?.forEach((attribute) => {
                if (attribute?.categoryAttribute?.entity === 'service') {
                  switch (attribute?.categoryAttribute?.attributeKey) {
                    case 'event_date':
                      eventDate = attribute.value; break;
                    case 'event_time':
                      eventTime = attribute.value; break;
                    case 'event_location':
                      try {
                        eventLocation = parseIfJSON(attribute.value);
                        if (
                          eventLocation?.latitude && eventLocation?.longitude &&
                          currLocation?.lat && currLocation?.long
                        ) {
                          eventDistance = calcDistance(
                            Number(currLocation.lat),
                            Number(currLocation.long),
                            Number(eventLocation.latitude),
                            Number(eventLocation.longitude)
                          );
                        }
                      } catch { }
                      break;
                    default:
                      break;
                  }
                }
              });

              let min = { displayPriceMin: Infinity, overridePriceMin: Infinity };
              let max = { displayPriceMax: -Infinity, overridePriceMax: -Infinity };
              (event.variants || []).forEach((variant) => {
                const price = Number(variant?.price);
                const salePrice = Number(variant?.salePrice);
                if (salePrice) {
                  min.displayPriceMin = Math.min(min.displayPriceMin, salePrice);
                  max.displayPriceMax = Math.max(max.displayPriceMax, salePrice);
                  min.overridePriceMin = Math.min(min.overridePriceMin, price);
                  max.overridePriceMax = Math.max(max.overridePriceMax, price);
                } else if (!Number.isNaN(price)) {
                  min.displayPriceMin = Math.min(min.displayPriceMin, price);
                  max.displayPriceMax = Math.max(max.displayPriceMax, price);
                }
              });

              const mapped = {
                id: event.id,
                // title and image fallbacks
                title: event?.name || event?.title || 'Featured Event',
                image: event?.thumbnail || event?.image || (event?.provider?.images?.[0]) || '',
                // Map to HeroSection expected fields
                category: event?.category?.name,
                date: eventDate || event?.date,
                time: eventTime || event?.time,
                venue: cleanLocationText(eventLocation?.address || event?.provider?.address || event?.venue) || 'Venue',
                location: eventLocation?.address ? '' : cleanLocationText(event?.provider?.city || event?.location) || '',
                price: (min.displayPriceMin === Infinity ? (event?.price || 0) : min.displayPriceMin),
                originalPrice: (min.overridePriceMin === Infinity ? undefined : min.overridePriceMin),
                discount: undefined,
                eventDistance,
              };
              enriched.push(mapped);
            }
          });

          if (!cancelled) setApiEvents(enriched);
        }
      } catch (e) {
        // fail silently, fallback to context events
      } finally {
        if (!cancelled) {
          const t = setTimeout(() => setProcessingData(false), 400);
          return () => clearTimeout(t);
        }
      }
    };
    fetchServices();
    return () => { cancelled = true; };
  }, []);

  const featuredFromApi = apiEvents.slice(0, 5);
  const featuredEvents = (featuredFromApi.length > 0 ? featuredFromApi : events.slice(0, 5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredEvents.length);
  }, [featuredEvents.length]);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000); // Auto-play every 5 seconds
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  if (isLoading || processingData) {
    return <SkeletonHero />;
  }

  const currentEvent = featuredEvents[currentIndex];
  if (!currentEvent) return null;

  // Robust date/time formatting with fallbacks
  let dateObj = null;
  if (currentEvent?.date) {
    // Try parse ISO first; fallback to Date constructor
    const tryIso = parseISO(currentEvent.date);
    dateObj = isValid(tryIso) ? tryIso : new Date(currentEvent.date);
    if (!isValid(dateObj)) {
      dateObj = null;
    }
  }

  const formattedDate = dateObj
    ? `${format(dateObj, 'EEE, d MMM')}${currentEvent?.time ? ` - ${currentEvent.time}` : ''}`
    : (currentEvent?.time ? `${currentEvent.time}` : 'Date TBA');

  // Use dynamic image from the current event
  const displayImage = currentEvent.image || '';

  const slideVariants = {
    hidden: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    visible: {
      x: '0%',
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    exit: (dir) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    }),
  };

  // Swipe handling using Framer Motion drag
  const swipeConfidenceThreshold = 800; // tune for sensitivity
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className="relative w-full md:h-[600px] h-auto bg-white md:bg-gray-50 overflow-hidden pb-8 md:pb-0">
      {/* Background Image with Blur - Hidden on Mobile */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-60 scale-110 hidden md:block"
          style={{
            backgroundImage: `url(${displayImage})`
          }}
        />
      </AnimatePresence>

      {/* Bottom Fade Gradient - Desktop Only */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-[5]" />

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-0">
        {/* Mobile Header */}
        <div className="md:hidden mb-4">
          <h2 className="text-xl font-bold text-gray-900">Featured Events</h2>
        </div>

        <div className="w-full h-full flex items-center">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={direction}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  nextSlide();
                } else if (swipe > swipeConfidenceThreshold) {
                  prevSlide();
                }
              }}
              className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center cursor-grab active:cursor-grabbing"
            >
              {/* Left Arrows (Desktop) */}
              <div className="hidden md:flex justify-end col-span-1">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 text-gray-800" />
                </button>
              </div>

              {/* Right: Poster Image (Mobile: Order 1) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex order-1 md:order-last col-span-1 md:col-span-4 justify-center relative group"
              >
                <div className="w-[240px] aspect-[2/3] md:w-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg md:shadow-2xl ring-1 ring-black/5 relative z-10 bg-white mx-auto">
                  <img
                    src={displayImage}
                    alt={currentEvent.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle glare effect - Desktop only or subtle */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Mobile-only overlay gradient for text legibility if we were overlaid, but we are stacking. */}
                </div>
              </motion.div>


              {/* Left: Text Content (Mobile: Order 2) */}
              <div className="order-2 md:order-first md:col-span-6 flex flex-col justify-center">
                <motion.p
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-500 md:text-gray-900 mb-2 md:mb-4"
                >
                  {formattedDate}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="text-2xl md:text-6xl font-black text-gray-900 leading-tight md:leading-[1.1] mb-2 md:mb-6 tracking-tight line-clamp-2"
                >
                  {currentEvent.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-sm md:text-xl font-medium text-gray-600 md:text-gray-900 mb-4 md:mb-8 max-w-lg line-clamp-2 md:line-clamp-none"
                >
                  {currentEvent.venue}{currentEvent.location ? `, ${currentEvent.location}` : ''}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6"
                >
                  <div className="text-lg md:text-xl font-bold text-gray-900">
                    ₹{currentEvent.price} onwards
                  </div>
                  <Link
                    to={`/event/${currentEvent.id}`}
                    className="bg-gray-900 text-white px-6 py-3 md:px-8 md:py-3.5 rounded-xl md:rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl text-center text-sm tracking-wide transform hover:-translate-y-0.5 w-full md:w-auto"
                  >
                    Book tickets
                  </Link>
                </motion.div>
              </div>



              {/* Right Arrow (Desktop) */}
              <div className="hidden md:flex justify-start col-span-1 order-last">
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                >
                  <ChevronRight className="w-8 h-8 text-gray-800" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-2 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {featuredEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-gray-900 w-8' : 'bg-gray-300 w-1.5'
              }`}
          />
        ))}
      </div>
    </section >
  );
};

export default HeroSection;

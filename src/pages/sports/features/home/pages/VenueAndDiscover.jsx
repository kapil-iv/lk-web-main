import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Mousewheel } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import { paths } from "../../../../../routes/paths";
import SportsCardCarousel from "../../../../../components/ui/SportsCardCarousel";
import { trimTextBig } from "../../../../../utils/helpers";
import useGeoLocation from "../../../../../hooks/useGeoLocation";
// import {
//   getServiceProviders,
//   getAllServiceCategories,
// } from "../../../api/apiUtils";

import {
  fetchSportsVenues,
  fetchFitnessVenues,
  fetchSportsCategories,
} from "../../../../../services/venues.services";
import useLatLngStore from "../../../../../store/useLatLngStore";




const BookVenueAndDiscover = () => {
  const navigate = useNavigate();
  // const { lat, lng, loading: locationLoading, error } = useGeoLocation();
  const { lat, lng, locationLoading, error } = useLatLngStore();
  const venueSwiperRef = useRef(null);

  const [venues, setVenues] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  const swiperOptions = {
    modules: [Navigation, Autoplay, Mousewheel],
    spaceBetween: 20,
    slidesPerView: 1,
    loop: true,
    autoplay: { delay: 3500, disableOnInteraction: false },
    mousewheel: { forceToAxis: true },
    breakpoints: {
      640: { slidesPerView: 1.5 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  };

  useEffect(() => {
    if (!lat || !lng) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [sports, fitness, categories] = await Promise.all([
          fetchSportsVenues({ lat, lng }),
          fetchFitnessVenues({ lat, lng }),
          fetchSportsCategories(),
        ]);

        setVenues([...sports, ...fitness]);
        setSports(categories);
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lat, lng]);

  if (locationLoading) {
    return (
      <div className="py-12 text-center text-main-text opacity-60">
        Finding venues near you…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-danger font-medium">
        Enable location to see nearby venues.
      </div>
    );
  }

  const NavButton = ({ onClick, icon }) => (
    <button
      onClick={onClick}
      className="p-3 rounded-xl border border-card-border bg-card-bg text-main-text hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
    >
      {icon}
    </button>
  );

  return (
    <div className="md:mx-12 mx-4 md:mt-14 mt-8 bg-main-bg md:rounded-3xl rounded-2xl md:pt-12 pt-6 max-w-page mx-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-main-text mb-4">
            Book & <span className="text-primary">Discover</span>
          </h1>
          <p className="text-main-text opacity-70 text-lg max-w-3xl mx-auto">
            Find your perfect venue and explore exciting games.
          </p>
        </motion.div>

        {/* Venues */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-main-text flex items-center gap-3">
              <span className="w-3 h-8 bg-primary rounded-full"></span>
              Book Venues
            </h2>
            <button
              onClick={() => navigate(paths.book)}
              className="px-6 py-2 text-main-text hover:text-primary font-semibold transition-colors"
            >
              See All Venues
            </button>
          </div>

          <Swiper
            {...swiperOptions}
            onSwiper={(s) => (venueSwiperRef.current = s)}
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <div className="h-56 bg-muted animate-pulse rounded-2xl" />
                </SwiperSlide>
              ))
            ) : venues.length > 0 ? (
              venues.map((venue) => {
                const distanceKm = Number.isFinite(Number(venue.distance))
                  ? Number(venue.distance).toFixed(1)
                  : "--";
                {
                  console.log("Venue ID: ", venue.id);
                }
                return (
                  <SwiperSlide key={venue.id} className="pb-4">
                    <div
                      onClick={() =>
                        navigate(paths.sports.providerDetail(venue.id), {
                          state: { venue },
                        })
                      }
                      className="group bg-card-bg border border-card-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer"
                    >
                      <div className="aspect-video bg-muted rounded-xl overflow-hidden flex items-center justify-center relative">
                        <img
                          src={
                            venue.logo ||
                            venue.image ||
                            "https://placehold.co/400x300"
                          }
                          alt={venue.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 flex items-center bg-card-bg/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-card-border shadow-sm">
                          <Star size={12} className="text-yellow-400 mr-1 fill-yellow-400" />
                          <span className="text-xs font-bold text-main-text">
                            {venue.rating || "--"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3">
                        <h3 className="font-bold text-main-text line-clamp-1">{venue.name}</h3>
                        <p className="text-sm text-main-text opacity-60">
                          {trimTextBig(venue.address, 15)}{" "}
                          <span className="text-primary font-medium">
                            • {distanceKm} km
                          </span>
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              <div className="text-center py-8 text-main-text opacity-50">
                No venues found nearby.
              </div>
            )}
          </Swiper>

          <div className="flex justify-center gap-4 mt-4 pb-8">
            <NavButton
              onClick={() => venueSwiperRef.current?.slidePrev()}
              icon={<ChevronLeft size={20} />}
            />
            <NavButton
              onClick={() => venueSwiperRef.current?.slideNext()}
              icon={<ChevronRight size={20} />}
            />
          </div>
        </section>

        {/* Popular Sports */}
        <div className="mt-12 pb-12">
          <SportsCardCarousel sports={sports}>
            <h2 className="text-2xl md:text-4xl font-bold text-main-text mb-4 font-bold mb-8 text-main-text flex items-center gap-3">
              <span className="w-3 h-8 bg-primary rounded-full"></span>
              Popular Sports
            </h2>
          </SportsCardCarousel>
        </div>
      </div>
    </div>
  );
};

export default BookVenueAndDiscover;
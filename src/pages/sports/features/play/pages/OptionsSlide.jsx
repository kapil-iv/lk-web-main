import { useState } from "react";
import {
  ChevronDown,
  Dribbble,
  ToggleLeft,
  ToggleRight,
  Settings2,
  Trophy,
  Calendar,
  CreditCard
} from "lucide-react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper modules
import { Mousewheel, FreeMode } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

const OptionsSlide = () => {
  const [toggleTrue, setToggleTrue] = useState(true);

  const filters = [
    { id: 1, label: "Filter & Sort By", icon: Settings2 },
    { id: 2, label: "Sports", icon: Trophy },
    { id: 3, label: "Date", icon: Calendar },
    { id: 4, label: "Pay & Join Game", icon: CreditCard },
  ];

  return (
    <div className="w-full bg-stone-50 border-b border-gray-100">
      <Swiper
        // Add Modules here
        modules={[Mousewheel, FreeMode]}
        spaceBetween={16}
        slidesPerView={"auto"}
        grabCursor={true}
        // Enable mouse wheel scrolling
        mousewheel={{
          forceToAxis: true, // Prevents page scrolling up/down while swiping left/right
        }}
        // Enable free scrolling (doesn't snap strictly to slides)
        freeMode={true}
        className="w-full !py-4 !px-4"
      >
        {/* Slide 1: Main Toggle */}
        <SwiperSlide className="!w-auto">
          <div className="min-w-[280px] md:min-w-[320px] rounded-2xl bg-white px-6 py-3 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow select-none">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Dribbble className="text-primary flex-shrink-0" size={24} />
              </div>
              <p className="text-sm md:text-base text-gray-700 font-semibold whitespace-nowrap">
                GameTime by LK Sports
              </p>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation(); // Prevents swiper from jumping when clicking toggle
                setToggleTrue(!toggleTrue);
              }}
              className="cursor-pointer transition-transform active:scale-90"
            >
              {toggleTrue ? (
                <ToggleLeft size={38} className="text-gray-300" />
              ) : (
                <ToggleRight size={38} className="text-primary" />
              )}
            </div>
          </div>
        </SwiperSlide>

        {/* Filter Slides */}
        {filters.map((item) => (
          <SwiperSlide key={item.id} className="!w-auto">
            <div className="min-w-[200px] md:min-w-[240px] rounded-2xl bg-white px-5 py-3 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all hover:border-primary group cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <item.icon className="text-primary flex-shrink-0" size={20} />
                </div>
                <p className="text-sm md:text-base text-gray-600 font-medium whitespace-nowrap group-hover:text-gray-900">
                  {item.label}
                </p>
              </div>
              <ChevronDown size={18} className="text-gray-400 group-hover:text-primary transition-colors ml-2" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default OptionsSlide;
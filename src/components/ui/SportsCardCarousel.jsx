import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// const TRENDING_CARDS = [
//   { id: 1, name: "Football", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0RIEjylorsyjJ-CINApa3OJlOEDs4adq06g&s" },
//   { id: 2, name: "Basketball", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9SIhIwS6OVHrGIRa_G_G_kMIg3xktu0I4WQ&s" },
//   { id: 3, name: "Baseball", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCE1VJ3jRJODMJzN1Eqs34F4bF4t7peMHmfQ&s" },
//   { id: 4, name: "Cricket", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrva3MguYw3zp8T8PLtxgOxBJ4AXbTO71X4A&s" },
// ];

export default function SportsCardCarousel({ sports, children }) {
  const TRENDING_CARDS = sports
  console.log(sports);

  return (
    <div className="w-full py-8 pb-10 md:mt-10">
      {children}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24} // Controlled spacing here
        slidesPerView={1.2}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.5 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-12 px-4" // Padding here ensures shadow isn't clipped
      >
        {TRENDING_CARDS.map((card) => (
          <SwiperSlide key={card.id}>
            {/* Removed w-64 to let Swiper define the width based on slidesPerView */}
            <div className={`bg-[${card.backgroundColor
              }] relative h-80 rounded-[2rem] overflow-hidden shadow-lg group cursor-pointer`}>
              <img
                src={card.icon}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Smoother Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-8 left-6">
                <h3 className="text-white text-3xl font-bold tracking-wide">
                  {card.name}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
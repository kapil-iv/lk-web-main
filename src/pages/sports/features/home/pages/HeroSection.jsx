import { MapPin } from 'lucide-react';
import CircularScrollingText from '../../../../../components/ui/RollingText';

const HeroSection = () => {
  return (
    <>
      <section className="relative pt-10 overflow-visible rounded-2xl p-2">
        <div className="md:flex max-w-7xl mx-auto">
          {/* Left Text Content */}
          <div className="text-left mb-8 md:w-1/2 content-center flex flex-col justify-center px-4 ">
            <div className="hidden md:flex md:gap-5 md:text-gray-700 md:bg-gray-200 md:w-[250px] md:h-[50px] md:rounded-2xl md:mb-4">
              <span className='md:flex ml-2 capitalize truncate md:max-w-full w-fit md:font-semibold md:text-md leading-6 items-center gap-2'>
                <MapPin size={16} />
                <p>Bikaner</p>
              </span>
            </div>
            <h1 className="uppercase text-[22px] md:text-[30px] md:font-bold font-extrabold text-main-text mb-6 leading-tight flex flex-col gap-2">
              <p>Book sports venues.</p>
              <p>Join games.</p>
              <p>Find trainers near you.</p>
            </h1>
            <h2 className="text-xl md:text-[20px] text-gray-400 mb-8 font-medium md:max-w-[450px]">
              The World's Largest Sports Community to Book Venues, Find Trainers, and Join Games Near you.
            </h2>
          </div>

          {/* Right Images Container */}
          <div className="flex w-full h-[400px] md:h-[600px] mb-8 relative">

            {/* THE ROLLING TEXT: Responsive positioning */}
            {/* THE ROLLING TEXT: Positioned left-bottom on mobile, centered on desktop */}
            <div className="absolute 
   
    left-0 bottom-0 -translate-x-1/2 translate-y-1/2 
   
    md:top-1/2 md:left-1/100 md:-translate-x-1/2 md:-translate-y-1/2 
    flex items-center justify-center pointer-events-none z-20"
            >
              <CircularScrollingText />
            </div>

            {/* LEFT SIDE IMAGE */}
            <div className="w-1/2 shadow-lg overflow-hidden">
              <img
                src="https://www.shutterstock.com/image-photo/image-which-there-several-different-600nw-2657097099.jpg"
                alt="Sports Basketball"
                className="w-full h-full object-cover"
              />
            </div>

            {/* RIGHT SIDE STACKED IMAGES */}
            <div className="relative w-1/2 flex flex-col">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5351/5351486.png"
                className="w-12 h-12 md:w-24 md:h-24 absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-30 bg-white rounded-full p-2 shadow-lg"
                alt="Logo"
              />
              <div className="flex-1 overflow-hidden">
                <img src="https://playo-website.gumlet.io/playo-website-v3/hero/hero_right_top.png?q=50" className="w-full h-full object-cover" alt="Top" />
              </div>
              <div className="flex-1 overflow-hidden">
                <img src="https://playo-website.gumlet.io/playo-website-v3/hero/hero_right_bottom.png?q=50" className="w-full h-full object-cover" alt="Bottom" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
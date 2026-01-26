
import HeroSection from './pages/HeroSection';
import VenueAndDiscover from './pages/VenueAndDiscover';


const Home = () => {

  return (
    <div className="min-h-screen w-full bg-card-bg rounded-xl px-4">
      {/* Hero Section */}
      <HeroSection />

      {/* Book venue and discover sports section */}
      <VenueAndDiscover/>

    </div>
  );
};

export default Home;

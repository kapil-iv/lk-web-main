
import HeroSection from './pages/HeroSection';
import VenueAndDiscover from './pages/VenueAndDiscover';
// import BlogsSection from './pages/BlogSection';
// import AboutSection from './pages/AboutSection';
// import DownloadAppSection from '../../components/DownloadSection';
// import TopSportsComplexes from './../../components/TopSportsComplexes';
import {games} from './dummyData.js' 

const Home = () => {

  return (
    <div className="min-h-screen w-full bg-card-bg rounded-xl px-4">
      {/* Hero Section */}
      <HeroSection />

      {/* Book venue and discover sports section */}
      <VenueAndDiscover games={games}/>

      {/* Blogs Section */}
      {/* <BlogsSection /> */}

      {/* About Section */}
      {/* <AboutSection /> */}

      {/* Download App Section */}
      {/* <DownloadAppSection /> */}

      {/* Top Sports Complexes in Cities */}
      {/* <TopSportsComplexes /> */}

    </div>
  );
};

export default Home;

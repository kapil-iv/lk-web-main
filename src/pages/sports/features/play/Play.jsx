import GameSection from "./pages/GameSection";
import VenueCollection from './pages/VenueCollection'
// import TopSportsComplexes from './../../components/TopSportsComplexes';
import Button from "../../../../components/ui/Button";

const Play = () => {


  return (
   <>
    <GameSection/>
    <Button>
      Load More
    </Button>
    <VenueCollection/>
    {/* <TopSportsComplexes/> */}
    </>
  );
};

export default Play;
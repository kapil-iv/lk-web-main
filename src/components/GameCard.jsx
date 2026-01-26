import { MapPin, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../routes/paths'; // Check karein aapka path sahi ho

const GameCard = ({ game }) => {
  const navigate = useNavigate();
  const { id, venue, sport, host, playersJoined, gameType, skillLevel, gameDate, startTime, pricePerPlayer, slotsLeft } = game;
  const avatarUrl = `https://robohash.org/${host?.id}?set=set3`;

  const handleCardClick = () => {
    const targetPath = paths.sports.joinGame.replace(':id', id);
    navigate(targetPath);
  };

  const dateObj = new Date(gameDate);
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });

  const dateTime = new Date(`${gameDate}T${startTime}`);

  const timePeriod = dateTime.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }); 


  return (
    <div className="max-w-full md:max-w-[340px] md:min-w-[340px] grow md:grow-0 mb-6">
      <div
        onClick={handleCardClick}
        className="flex flex-col p-5 bg-white border border-blue-100 rounded-[20px] shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[260px] group"
      >
        {/* Type Header */}
        <div className="flex items-center gap-1 text-[#707A75] text-[15px] font-medium mb-3">
          <span className="capitalize">{gameType}</span>
          <span>•</span>
          <span className="capitalize">{sport?.name || "Regular"}</span>
        </div>

        {/* Going Status */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={host?.profileImg || avatarUrl}
            alt="Host"
            className="w-12 h-12 rounded-full object-cover border border-gray-100"
          />
          <span className="text-[22px] font-bold text-[#3B4540]">
            {playersJoined} Going
          </span>
        </div>

        {/* Host Info */}
        <div className="text-[#707A75] text-[15px] font-medium mb-5">
          {host?.name} | {host?.followersCount || 0} Followers
        </div>
        {/* players joined and slots left */}
        <div className="text-[#707A75] text-[15px] font-medium mb-5">
          {playersJoined} Joined • {slotsLeft} Slots Left
        </div>

        {/* Date & Time */}
        <div className="text-[#3B4540] text-[17px] font-bold mb-4">
          {formattedDate}, {timePeriod}
        </div>

        {/* Location & Price */}
        <div className="flex items-start gap-3 mb-5">
          <MapPin size={20} className="text-[#707A75] mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[#3B4540] text-[16px] font-medium line-clamp-1">{venue?.name}</span>
            <span className="text-[#707A75] text-[14px]">₹{Math.round(pricePerPlayer)} per player</span>
          </div>
        </div>

        {/* Skill Level Pill */}
        <div className="flex items-center gap-3 mt-auto pt-2">
          <Award size={18} className="text-[#707A75]" />
          <div className="bg-[#F1F3F2] px-6 py-2 rounded-xl flex-1 text-center group-hover:bg-blue-50 transition-colors">
            <span className="text-[#3B4540] text-[15px] font-semibold capitalize tracking-tight">
              {skillLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
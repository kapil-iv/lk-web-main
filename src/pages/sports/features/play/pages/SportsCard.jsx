import { MapPin, Globe } from "lucide-react";

const dummyGames = [
  {
    id: 1,
    court: "Half Court",
    type: "Regular",
    going: "1/8",
    host: "Kishlay",
    karma: 184,
    date: "Sat, 27 Dec 2025",
    time: "09:00 AM - 10:00 AM",
    location: "Basecamp by Push Spo...",
    distance: "1.41 Kms",
    skill: "Beginner - Intermediate",
    status: "BOOKED",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kishlay"
  },
  {
    id: 2,
    court: "Full Court",
    type: "Competitive",
    going: "10/12",
    host: "Amit",
    karma: 250,
    date: "Sun, 28 Dec 2025",
    time: "05:00 PM - 07:00 PM",
    location: "Karni Singh Stadium",
    distance: "2.5 Kms",
    skill: "Intermediate - Advanced",
    status: "JOINED",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
  },
  {
    id: 3,
    court: "Half Court",
    type: "Regular",
    going: "3/8",
    host: "Rahul",
    karma: 95,
    date: "Mon, 29 Dec 2025",
    time: "06:00 AM - 07:00 AM",
    location: "LK Sports Arena",
    distance: "0.8 Kms",
    skill: "Beginner",
    status: "BOOKED",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  }
];

const SportsCard = () => {
  return (
    <div className="py-4 rounded-2xl">
      {/* Grid Container: 1 col on mobile, 2 on md, 3 on lg */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mx-auto">
        {dummyGames.map((game) => (
          <div 
            key={game.id} 
            className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-center text-gray-400 text-xs mb-3 font-medium uppercase tracking-wider">
              <span>{game.court}</span>
              <span className="mx-2">•</span>
              <span>{game.type}</span>
            </div>

            {/* Going Info */}
            <div className="flex items-center gap-3 mb-1">
              <img 
                src={game.img} 
                alt="Host" 
                className="w-10 h-10 rounded-full bg-gray-100 border border-gray-100" 
              />
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-gray-800 text-xl">{game.going}</span>
                <span className="font-bold text-gray-800 text-xl">Going</span>
              </div>
            </div>

            {/* Karma */}
            <p className="text-gray-500 text-sm mb-5">
              {game.host} <span className="text-gray-300 mx-1">|</span> {game.karma} Karma
            </p>

            {/* Date/Time */}
            <h3 className="font-bold text-gray-800 text-[15px] mb-4 leading-tight">
              {game.date}, {game.time}
            </h3>

            {/* Location */}
            <div className="flex items-start gap-2 mb-6">
              <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-600 text-sm font-medium">
                {game.location} 
                <span className="text-gray-400 ml-1 font-normal">~{game.distance}</span>
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Globe size={14} className="text-gray-500" />
                <span className="text-gray-700 text-[11px] font-bold uppercase tracking-tight">
                  {game.skill}
                </span>
              </div>

              <div className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide text-white shadow-sm ${
                game.status === 'BOOKED' ? 'bg-primary' : 'bg-primary'
              }`}>
                {game.status}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-semibold shadow-md mx-auto block hover:bg-primary/90 transition">
        LOAD MORE
      </button>
    </div>
  );
};

export default SportsCard;
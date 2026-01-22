import {games} from '../data/dummyData'

const GamesSection = () => {
  // Mock data for the cards to demonstrate reusability

  return (
    <section className="flex flex-col md:mx-auto max-w-[1080px] mt-6 md:mt-[52px] w-full">
      {/* Header Section */}
      <div className="mx-4 md:mx-0 md:px-6">
        <div className="flex justify-between items-center mx-auto w-full">
          <h1 className="text-[32px] font-bold leading-[48px]">
            Games in <span className="capitalize">bangalore</span>
          </h1>
          
          {/* App Promotion Banner */}
          <div className="max-w-[613px] bg-white border border-[#E3E8E6] rounded-3xl h-14 hidden md:flex justify-between items-center overflow-hidden w-full pl-[30px] pr-6">
            <p className="font-bold leading-6">To create a game, download Playo app</p>
            <div className="flex justify-between items-center bg-[url('https://playo-website.gumlet.io/playo-website-v3/spiral_grey.png')] bg-contain bg-no-repeat bg-left py-6 h-full gap-2">
              <img src="https://playo-website.gumlet.io/playo-website-v3/google_play_badge.png" width="127" height="52" alt="Play Store" className="cursor-pointer" />
              <img src="https://playo-website.gumlet.io/playo-website-v3/apple_store_badge.png" width="127" height="52" alt="App Store" className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-6 w-full flex gap-2 px-4 md:mx-2 overflow-auto no-scrollbar">
        {/* GameTime Toggle */}
        <FilterPill icon="https://playo-website.gumlet.io/playo-website-v3/icons/activity/gameTime_logo.png" label="GameTime by Playo">
          <div className="flex items-center justify-center">
            <button className="relative inline-flex items-center bg-white border-2 border-gray-200 h-4 w-6 rounded-full">
              <span className="translate-x-[2px] bg-white border-2 border-gray-400 inline-block h-2 w-2 transform rounded-full" />
            </button>
          </div>
        </FilterPill>

        <FilterPill label="Filter & Sort By" showChevron iconType="sort" />
        <FilterPill label="Sports" showChevron iconType="sports" />
        <FilterPill label="Date" showChevron iconType="date" />
        <FilterPill label="Pay & Join Game" iconType="pay" />
      </div>

      {/* Cards Grid */}
      <div className="flex gap-x-6 flex-wrap mt-6 mb-12 md:mx-0 md:px-6 px-4">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
};

// Reusable Filter Pill Component
const FilterPill = ({ icon, label, children, showChevron, iconType }) => (
  <div className="flex justify-center items-center gap-4 border border-[#E3E8E6] bg-white py-3 px-4 rounded-2xl cursor-pointer min-w-fit hover:bg-gray-50 transition-colors">
    {icon && <img src={icon} alt="" className="h-6 w-6" />}
    <span className="font-medium text-[#3B4540]">{label}</span>
    {children}
    {showChevron && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="ml-[-8px]">
            <path d="M15.0572 3.95264L8.47124 10.5386C8.34449 10.6603 8.1756 10.7282 7.99991 10.7282C7.82421 10.7282 7.65533 10.6603 7.52857 10.5386L0.946573 3.95597L0.00390625 4.89864L6.58591 11.4813C6.96714 11.8447 7.47359 12.0473 8.00024 12.0473C8.52689 12.0473 9.03334 11.8447 9.41457 11.4813L15.9999 4.8953L15.0572 3.95264Z" fill="#3B4540"/>
        </svg>
    )}
  </div>
);

// Reusable Game Card Component
const GameCard = ({ game }) => (
  <div className="max-w-full md:max-w-[328px] md:min-w-[328px] grow md:grow-0 mb-6">
    <div className="flex overflow-hidden relative h-[250px] flex-col space-y-2 items-start p-4 justify-start shadow-sm border rounded-[16px] border-[#E3E8E6] cursor-pointer bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-row items-center justify-start w-full font-medium py-[2px]">
        <span className="md:text-sm text-xs text-gray-500 capitalize">{game.type} • {game.category}</span>
      </div>
      
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <div className="flex items-center">
            {game.profiles.map((p, i) => (
              <div key={i} className={`h-10 w-10 rounded-full border-2 border-white overflow-hidden ${i > 0 ? 'ml-[-14px]' : ''}`}>
                <img src={p} alt="profile" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className={`ml-4 px-2 py-1 rounded-lg text-xs font-medium ${game.status.includes('🚀') ? 'bg-[#FFF3CC] border border-[#FFC400]' : 'font-bold text-sm'}`}>
            {game.status}
          </div>
        </div>
      </div>

      <div className="text-gray-500 font-medium md:text-sm text-xs">
        {game.organizer} | {game.karma} Karma
      </div>

      <div className="mt-2 text-gray-900 font-semibold text-xs md:text-sm">
        {game.date}, {game.time}
      </div>

      <div className="flex items-center mt-1 space-x-2 w-full">
        <img src="https://playo-website.gumlet.io/playo-website-v2/web-home-screen/act-card-loc-icon.png" className="h-4 w-4" alt="loc" />
        <span className="text-xs md:text-sm truncate text-gray-700">{game.location} ~{game.distance}</span>
      </div>

      <div className="flex flex-row items-center w-full pt-2">
        <img src={game.sportIcon} className="h-6 w-6" alt="sport" />
        <div className="bg-[#F1F3F2] rounded-lg flex-1 ml-2 h-8 flex items-center px-2 justify-between overflow-hidden">
          <span className="text-[10px] md:text-xs font-medium truncate">{game.level}</span>
          {game.badge && <span className="bg-[#3B4540] text-white text-[10px] px-1.5 py-0.5 rounded ml-1">{game.badge}</span>}
        </div>
      </div>
    </div>
  </div>
);

export default GamesSection;
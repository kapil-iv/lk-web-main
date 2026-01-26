import { useState, useEffect, useMemo } from "react";
import { Star, MapPin, Search, Loader2, ChevronRight } from "lucide-react";
import {
  fetchSportsVenues,
  fetchFitnessVenues,
} from "../../../../../services/venues.services";
import useLatLngStore from "../../../../../store/useLatLngStore";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../../../routes/paths";

const LKExplores = () => {
  const navigate = useNavigate();
  const { lat, lng, locationLoading, error } = useLatLngStore();
  const [activeTab, setActiveTab] = useState("sports");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "sports", label: "Sports", categoryId: "3" },
    { id: "fitness", label: "Fitness", categoryId: "8" },
    // { id: "coaching", label: "Coaching", categoryId: "4" },
    // { id: "events", label: "Events", categoryId: "5" },
    // { id: "experiences", label: "Experiences", categoryId: "6" },
  ];

  const currentTab = useMemo(() => tabs.find((t) => t.id === activeTab), [activeTab]);

  useEffect(() => {
    if (!lat || !lng || !currentTab) return;
    const loadData = async () => {
      setLoading(true);
      try {
        let data = [];
        if (currentTab.categoryId === "3") {
          data = await fetchSportsVenues({ lat, lng });
        } else if (currentTab.categoryId === "8") {
          data = await fetchFitnessVenues({ lat, lng });
        }
        setItems(data);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [lat, lng, currentTab]);

  if (locationLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-brand-secondary mb-4" size={32} />
      <p className="text-gray-500 font-medium animate-pulse">Finding venues near you...</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      
      {/* STICKY TABS NAVIGATION */}
      <div className="sticky top-[64px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center px-4">
          <div className="flex overflow-x-auto no-scrollbar space-x-6 scroll-smooth py-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative whitespace-nowrap px-2 py-4 text-sm font-bold transition-all ${
                  activeTab === tab.id ? "text-brand-secondary" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-secondary rounded-full" />
                )}
                {!loading && activeTab === tab.id && items.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-blue-50 text-brand-secondary px-1.5 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(paths.sports.providerDetail(item.id), { state: { item } })}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                {/* Image Wrap */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={item.cover || "https://placehold.co/600x400?text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <span className="text-[11px] font-bold text-gray-800">{item.rating || "4.2"}</span>
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 truncate">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-gray-500 mb-4">
                    <MapPin size={14} className="text-brand-secondary shrink-0" />
                    <p className="text-xs truncate">{item.address || "Location Details Available"}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Starts from</p>
                        <p className="text-sm font-black text-gray-900">₹{item.price || '500'}<span className="text-[10px] font-normal text-gray-500">/hr</span></p>
                    </div>
                    <div className="bg-brand-secondary text-white p-2 rounded-xl group-hover:bg-brand-primary transition-colors">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No {activeTab} Found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">
              We couldn't find anything in this category near your current location.
            </p>
            <button 
              onClick={() => setActiveTab('venues')}
              className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Explore Other Categories
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default LKExplores;
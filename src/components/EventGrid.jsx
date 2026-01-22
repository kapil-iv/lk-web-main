import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, SortAsc } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import EventCard from './EventCard';
import { SkeletonEventCard } from './Skeleton';
import { getAllServices } from '../api/apiUtils';
import { cleanLocationText } from '../utils/cleanLocationText';



const EventGrid = () => {
  const { events, selectedLocation, searchQuery, selectedCategory, selectedCategoryId, isLoading } = useEvents();
  const [apiEvents, setApiEvents] = useState([]);
  const [loadingApi, setLoadingApi] = useState(true);

  // Fetch services from API and enrich to the same shape used by EventCard
  useEffect(() => {
    let cancelled = false;
    const fetchServices = async () => {
      try {
        setLoadingApi(true);
        const result = await getAllServices(7, 'active', 'approved');
        if (!cancelled && result?.success && Array.isArray(result?.data)) {
          const srv = result.data;
          const parseIfJSON = (val) => {
            if (typeof val === 'object') return val;
            try { return JSON.parse(val); } catch { return {}; }
          };
          const mapped = [];
          srv.forEach((event) => {
            if (event?.provider?.isActive) {
              let eventDate = '';
              let eventTime = '';
              let eventLocation = {};
              event?.attributes?.forEach((attribute) => {
                if (attribute?.categoryAttribute?.entity === 'service') {
                  switch (attribute?.categoryAttribute?.attributeKey) {
                    case 'event_date':
                      eventDate = attribute.value; break;
                    case 'event_time':
                      eventTime = attribute.value; break;
                    case 'event_location':
                      try {
                        eventLocation = parseIfJSON(attribute.value);
                      } catch { } // ignore
                      break;
                  }
                }
              });
              const min = { displayPriceMin: Infinity, overridePriceMin: Infinity };
              const max = { displayPriceMax: -Infinity, overridePriceMax: -Infinity };
              (event.variants || []).forEach((variant) => {
                const price = Number(variant?.price);
                const salePrice = Number(variant?.salePrice);
                if (!Number.isNaN(salePrice) && salePrice > 0) {
                  min.displayPriceMin = Math.min(min.displayPriceMin, salePrice);
                  max.displayPriceMax = Math.max(max.displayPriceMax, salePrice);
                  min.overridePriceMin = Math.min(min.overridePriceMin, price);
                  max.overridePriceMax = Math.max(max.overridePriceMax, price);
                } else if (!Number.isNaN(price)) {
                  min.displayPriceMin = Math.min(min.displayPriceMin, price);
                  max.displayPriceMax = Math.max(max.displayPriceMax, price);
                }
              });
              mapped.push({
                id: String(event.id),
                title: event?.name || event?.title || 'Event',
                category: event?.category?.name || event?.categoryName || 'Other',
                date: eventDate || event?.date,
                time: eventTime || event?.time,
                venue: cleanLocationText(eventLocation?.address || event?.provider?.address || event?.venue) || 'Venue',
                location: cleanLocationText(eventLocation?.city || event?.provider?.city || event?.location) || 'City',
                price: min.displayPriceMin === Infinity ? (event?.price || 0) : min.displayPriceMin,
                originalPrice: min.overridePriceMin === Infinity ? undefined : min.overridePriceMin,
                discount: undefined,
                image: event?.thumbnail || event?.image || (event?.provider?.images?.[0]) || '',
              });
            }
          });
          setApiEvents(mapped);
        }
      } catch (e) {
        // ignore errors; fallback to context events
      } finally {
        if (!cancelled) setLoadingApi(false);
      }
    };
    fetchServices();
    return () => { cancelled = true; };
  }, [selectedCategoryId]);

  const usingApi = true;
  const sourceEvents = apiEvents;

  const filteredEvents = useMemo(() => {
    return sourceEvents.filter((event) => {
      const matchesLocation = usingApi ? true : (event.location === selectedLocation);
      const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.artist && event.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
        event.venue?.toLowerCase().includes(searchQuery.toLowerCase());

      // Since we removed the filter UI, we might default to 'All', but still enforce isEventCategory
      const matchesCategory = usingApi ? true : (selectedCategory === 'All' || event.category === selectedCategory);

      return matchesLocation && matchesSearch && matchesCategory;


    });
  }, [sourceEvents, selectedLocation, searchQuery, selectedCategory, usingApi]);



  return (
    <section id="event-grid-section" className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Events Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                Trending in {selectedLocation}
              </h2>
              <p className="text-gray-600">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <SortAsc className="w-4 h-4" />
                <span className="hidden sm:inline">Sort</span>
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {(isLoading || loadingApi) ? (
            <div className="relative">
              {/* Mobile Horizontal Slider */}
              <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex space-x-4 w-max">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="w-48 flex-shrink-0">
                      <SkeletonEventCard />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonEventCard key={index} />
                ))}
              </div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="relative">
              {/* Mobile Horizontal Slider */}
              <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex space-x-4 w-max">
                  {filteredEvents.map((event, index) => (
                    <div key={event.id} className="w-48 flex-shrink-0">
                      <EventCard event={event} index={index} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {filteredEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or explore different categories.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-brand-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-accent transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>



      </div>
    </section>
  );
};

export default EventGrid;

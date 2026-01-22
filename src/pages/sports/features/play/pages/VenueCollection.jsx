const dummyData = [
  {
    id: 1,
    title: 'Top Venue Near You',
    subtitle: '400+ venues',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Explore Best Coaches',
    subtitle: '400+ venues',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Discover Best Events',
    subtitle: '100+ venues',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop',
  }
];

const Collection = () => {
  return (
    <div className="bg-zinc-50 py-12 px-4 md:px-16 rounded-3xl">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="h-8 w-1.5 bg-primary rounded-full"></div>
        <h2 className="text-2xl md:text-4xl text-zinc-900 font-bold tracking-tight">
          Collection For You
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {dummyData.map((item) => (
          <div 
            key={item.id}
            style={{ backgroundImage: `url(${item.image})` }}
            className="group relative bg-cover bg-center h-80 w-full md:w-1/3 rounded-3xl flex items-end overflow-hidden shadow-lg hover:shadow-orange-200/50 transition-all duration-300 border border-zinc-200"
          >
            {/* Dark Overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            
            <div className="relative z-10 m-4 bg-white/95 backdrop-blur-sm flex flex-col p-5 rounded-2xl w-full shadow-xl transform group-hover:-translate-y-1 transition-transform duration-300 border-l-4 border-primary">
              <h3 className="text-zinc-900 font-extrabold text-lg uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="text-primary font-semibold text-sm">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collection;
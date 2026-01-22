import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

const ExperienceCard = ({ item }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all"
  >
    <div className="relative h-56">
      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">
        {item.tag}
      </div>
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        {item.categories.map((cat, i) => (
          <span key={i} className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded uppercase">
            {cat}
          </span>
        ))}
      </div>
    </div>

    <div className="p-5">
      <h3 className="text-lg font-black text-zinc-900 leading-tight mb-1">{item.title}</h3>
      <p className="text-zinc-500 text-xs font-medium mb-4 line-clamp-1">{item.location}</p>

      <div className="flex items-center gap-4 text-zinc-900 font-bold text-xs pt-4 border-t border-zinc-50">
        <span className="flex items-center gap-1 text-primary">
          <Clock size={14} /> {item.time}
        </span>
        {item.date && (
          <span className="flex items-center gap-1 text-zinc-500">
            <Calendar size={14} /> {item.date}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

export default ExperienceCard;

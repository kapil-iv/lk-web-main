import React from 'react';
import { motion } from 'framer-motion';

// Import icons
import xmasIcon from '../assets/icons/xmas.png';
import fireIcon from '../assets/icons/fire.png';
import musicIcon from '../assets/icons/music.png';
import micIcon from '../assets/icons/mic.png';
import snowIcon from '../assets/icons/snowman.png';
import pumpkinIcon from '../assets/icons/pumpkin.png';

const categories = [
    { id: 1, name: 'CHRISTMAS', icon: xmasIcon },
    { id: 2, name: 'NEW YEAR', icon: fireIcon },
    { id: 3, name: 'MUSIC', icon: musicIcon },
    { id: 4, name: 'COMEDY', icon: micIcon },
    { id: 5, name: 'FESTS', icon: pumpkinIcon },
    { id: 6, name: 'SEASONAL', icon: snowIcon },
];

const ExploreEvents = () => {
    return (
        <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Events</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md border border-gray-100 cursor-pointer h-40 transition-all"
                        >
                            <div className="h-20 w-20 mb-3 flex items-center justify-center">
                                <img
                                    src={category.icon}
                                    alt={category.name}
                                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                                />
                            </div>
                            <span className="text-sm font-bold text-gray-800 tracking-wide">
                                {category.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExploreEvents;

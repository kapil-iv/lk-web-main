import React from 'react';
import { motion } from 'framer-motion';

const CategoryTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 overflow-x-auto no-scrollbar flex items-center gap-6 border-b border-zinc-100">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => setActiveTab(tab.label)}
          className={`flex-shrink-0 flex items-center gap-2 pb-2 transition-all relative ${
            activeTab === tab.label ? 'text-zinc-900 font-bold' : 'text-zinc-500 font-medium'
          }`}
        >
          {tab.highlight ? (
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${tab.highlight}`}>
              {tab.icon} {tab.label} ({tab.count})
            </span>
          ) : (
            <>
              <span>
                {tab.label} ({tab.count})
              </span>
              {activeTab === tab.label && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;

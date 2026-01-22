import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CirclePlay, Trophy, Dumbbell, HomeIcon, Search, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from "../../../../assets/images/LKlogo.png";

const Navbar = () => {
  return (
    <nav className="hidden md:flex items-center justify-between w-full bg-white border-b border-gray-100 fixed top-16 z-50 h-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">



        {/* Center: Main Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { to: "/sports", icon: <HomeIcon size={18} />, label: "Home" },
            { to: "/sports/play", icon: <CirclePlay size={18} />, label: "Play" },
            { to: "/sports/book", icon: <Trophy size={18} />, label: "Book" },
            { to: "/sports/train", icon: <Dumbbell size={18} />, label: "Train" }
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/sports"}
              className={({ isActive }) =>
                `flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest transition-all relative h-8 group ${isActive ? 'text-brand-secondary' : 'text-gray-500 hover:text-brand-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="transition-transform group-hover:-translate-y-0.5">{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>



      </div>
    </nav>
  );
};

export default Navbar;
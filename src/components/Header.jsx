import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Search, MapPin, Menu, X, User, LogOut, ChevronDown, HomeIcon, CirclePlay, Trophy, Settings, Calendar } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import LocationModal from './LocationModal';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LKLogo from '../assets/images/LK.png';

const Header = () => {
  const { selectedLocation, setSelectedLocation } = useEvents();
  const { openAuthModal, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSportsHovered, setIsSportsHovered] = useState(false);
  const [isMobileSportsOpen, setIsMobileSportsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  
  // Refs for closing dropdowns on outside click
  const profileRef = useRef(null);
  const sportsDropdownRef = useRef(null);

  const isSportsRoute = location.pathname.startsWith('/sports');

  useEffect(() => {
    function handleClickOutside(event) {
      // Profile dropdown close logic
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      // Sports dropdown close logic (Desktop)
      if (sportsDropdownRef.current && !sportsDropdownRef.current.contains(event.target)) {
        setIsSportsHovered(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sportsLinks = [
    { to: "/sports", icon: <HomeIcon size={16} />, label: "Sports Home" },
    { to: "/sports/play", icon: <CirclePlay size={16} />, label: "Play" },
    { to: "/sports/book", icon: <Trophy size={16} />, label: "Book" },
    { to: "/sports/play/my-games", icon: <Calendar size={16} />, label: "My Games" },
  ];

  const navItems = [
    { name: 'Kuicko it', path: 'https://www.kuicko.in/' },
    { name: 'Events', path: '/' },
    { name: 'Sports', path: '/sports', hasDropdown: true },
    { name: 'About Us', path: 'https://localkonnect.com/about.html' },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 left-0 z-50 w-full bg-white shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Left Side: Logo & Location */}
            <div className="flex items-center gap-4 lg:gap-8 min-w-[150px]">
              <Link to="/" className="flex-shrink-0">
                <img src={LKLogo} alt="Logo" className="h-10 w-auto md:h-12" />
              </Link>

              <button onClick={() => setIsLocationModalOpen(true)} className="hidden md:flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</span>
                  <span className="text-sm font-semibold text-gray-900 truncate max-w-[80px]">{selectedLocation}</span>
                </div>
              </button>
            </div>

            {/* Center: Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  ref={item.hasDropdown ? sportsDropdownRef : null}
                  onMouseEnter={() => item.hasDropdown && setIsSportsHovered(true)}
                  // onMouseLeave ko hataya ya rakha ja sakta hai depending on preference, 
                  // par click behavior ke liye hum isse rehne dete hain:
                  onMouseLeave={() => item.hasDropdown && setIsSportsHovered(false)}
                >
                  {item.hasDropdown ? (
                    <div
                      onClick={() => setIsSportsHovered(!isSportsHovered)} // Toggle logic
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 cursor-pointer ${
                        location.pathname.startsWith(item.path)
                          ? "bg-[#FDF7E7] text-gray-900" 
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isSportsHovered ? 'rotate-180' : ''}`} />
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                        (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path))
                          ? "bg-[#FDF7E7] text-gray-900" 
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}

                  <AnimatePresence>
                    {item.hasDropdown && isSportsHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      >
                        {sportsLinks.map((sLink) => (
                          <Link 
                            key={sLink.to} 
                            to={sLink.to} 
                            onClick={() => setIsSportsHovered(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-primary transition-colors"
                          >
                            {sLink.icon} {sLink.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Tablet/Mobile Sports Nav */}
            <div className="hidden md:flex lg:hidden flex-1 justify-center">
              {isSportsRoute && (
                <div className="flex items-center gap-6">
                  {sportsLinks.map((sLink) => (
                    <NavLink
                      key={sLink.to}
                      to={sLink.to}
                      end={sLink.to === "/sports"}
                      className={({ isActive }) => `text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${isActive ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {sLink.icon} {sLink.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Search & Profile */}
            <div className="flex items-center gap-2 lg:gap-4 min-w-[150px] justify-end">
              <button className="p-2 text-gray-500 hover:text-brand-primary transition-colors">
                <Search className="w-5 h-5" />
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => user ? setIsProfileOpen(!isProfileOpen) : openAuthModal()}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shadow-md hover:bg-gray-800 transition-colors border-2 border-white">
                    {user ? (user.name ? user.name[0].toUpperCase() : 'U') : <User className="w-5 h-5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name || 'User'}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="pt-1 border-t border-gray-50">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          <LogOut size={18} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="lg:hidden bg-white border-t overflow-hidden">
              <nav className="flex flex-col p-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div>
                        <button onClick={() => setIsMobileSportsOpen(!isMobileSportsOpen)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50">
                          {item.name} <ChevronDown className={`w-4 h-4 transition-transform ${isMobileSportsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isMobileSportsOpen && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pl-6 space-y-1 overflow-hidden">
                              {sportsLinks.map((sLink) => (
                                <Link key={sLink.to} to={sLink.to} onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-500 hover:text-brand-primary">
                                  {sLink.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link to={item.path} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50">
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                {user && (
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} setSelectedLocation={setSelectedLocation} />
    </>
  );
};

export default Header;
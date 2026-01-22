import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { CirclePlay, Trophy, Dumbbell, UserCircle, MapPin, LogOut, HomeIcon } from 'lucide-react';
import useAuthStore from "../../store/useAuthStore";
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  // Tailwind config theme classes based on your file:
  // text-brand-secondary -> #0080ff (Blue)
  // bg-brand-primary -> #1a1a1a (Dark Gray)
  // border-brand-accent -> #333333

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-brand-primary border-b border-brand-accent z-50 flex justify-center px-4 transition-all duration-300">
      <div className="w-full flex items-center justify-between max-w-7xl">

        {/* Left: Brand & Desktop Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center text-2xl font-black text-white tracking-tighter">
            <img className='w-[25px] h-[25px] mr-1' src={logo} alt="LK" />
            Sports<span className="text-[10px] align-top mb-2 text-brand-secondary">®</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { to: "/", icon: <HomeIcon size={18} />, label: "Home" },
              { to: "/sports/play", icon: <CirclePlay size={18} />, label: "Play" },
              { to: "/book", icon: <Trophy size={18} />, label: "Book" },
              { to: "/train", icon: <Dumbbell size={18} />, label: "Train" }
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all ${isActive
                    ? 'text-brand-secondary'
                    : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Location Badge */}
          <div className="flex flex-row items-center gap-2 px-3 py-1.5 bg-brand-accent rounded-xl text-white border border-white/5">
            <MapPin size={14} className="text-brand-secondary" />
            <span className="text-xs font-bold uppercase tracking-tighter">Bikaner</span>
          </div>

          {/* Auth Button using Brand Secondary (Blue) */}
          <div className="hidden md:flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAuth}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-[10px] tracking-widest transition-all shadow-lg ${isAuthenticated
                  ? "bg-transparent text-gray-400 border border-brand-accent hover:border-red-500 hover:text-red-500"
                  : "bg-brand-secondary text-white border-transparent shadow-brand-secondary/20 hover:brightness-110"
                }`}
            >
              {isAuthenticated ? (
                <>
                  <LogOut size={14} />
                  <span>LOGOUT</span>
                </>
              ) : (
                <>
                  <UserCircle size={14} />
                  <span>LOGIN</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
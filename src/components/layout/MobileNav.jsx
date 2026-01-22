import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, CirclePlay, Trophy, Dumbbell, UserCircle2, LogOut } from 'lucide-react';
import useAuthStore from "../../store/useAuthStore";

const MobileNav = () => {
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

  // Theme based styles using your config:
  // Brand Primary: #1a1a1a (Dark)
  // Brand Secondary: #0080ff (Blue)
  // Brand Accent: #333333 (Gray)

  const linkStyles = "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300";
  const activeStyles = "text-brand-secondary border-t-2 border-brand-secondary bg-brand-secondary/5";
  const inactiveStyles = "border-transparent text-gray-500 opacity-80";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-brand-primary border-t border-brand-accent z-50 h-16 transition-colors duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <div className="flex justify-around items-center h-full">

        <NavLink to="/" className={({ isActive }) => `${linkStyles} ${isActive ? activeStyles : inactiveStyles}`}>
          <Home size={18} />
          <span className="text-[10px] font-black uppercase tracking-wider">Home</span>
        </NavLink>

        <NavLink to="/sports/play" className={({ isActive }) => `${linkStyles} ${isActive ? activeStyles : inactiveStyles}`}>
          <CirclePlay size={18} />
          <span className="text-[10px] font-black uppercase tracking-wider">Play</span>
        </NavLink>

        <NavLink to="/book" className={({ isActive }) => `${linkStyles} ${isActive ? activeStyles : inactiveStyles}`}>
          <Trophy size={18} />
          <span className="text-[10px] font-black uppercase tracking-wider">Book</span>
        </NavLink>

        <NavLink to="/train" className={({ isActive }) => `${linkStyles} ${isActive ? activeStyles : inactiveStyles}`}>
          <Dumbbell size={18} />
          <span className="text-[10px] font-black uppercase tracking-wider">Train</span>
        </NavLink>

        {/* Mobile Auth Button */}
        <button
          onClick={handleAuth}
          className={`${linkStyles} border-transparent ${isAuthenticated ? 'text-red-500' : 'text-gray-500'} active:opacity-100`}
        >
          {isAuthenticated ? (
            <LogOut size={18} />
          ) : (
            <UserCircle2 size={18} />
          )}
          <span className="text-[10px] font-black uppercase tracking-wider">
            {isAuthenticated ? 'Logout' : 'Login'}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
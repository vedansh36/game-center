import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  const navCls = ({ isActive }) =>
    `text-sm font-semibold tracking-wide transition-colors duration-200 ${
      isActive ? 'text-purple-400' : 'text-gray-300 hover:text-white'
    }`;

  return (
    <nav className="glass border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎮</span>
          <span className="font-display text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-widest">
            GAMECENTRE
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/"            className={navCls} end>Home</NavLink>
          <NavLink to="/leaderboard" className={navCls}>Leaderboard</NavLink>
          {user && <NavLink to="/games"   className={navCls}>Games</NavLink>}
          {user && <NavLink to="/profile" className={navCls}>Profile</NavLink>}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-400">
                <span className="text-purple-400 font-semibold">{user.totalPoints}</span> pts
              </span>
              <button onClick={handleLogout} className="btn-outline text-sm py-1.5 px-4">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn-outline text-sm py-1.5 px-4">Login</Link>
              <Link to="/signup" className="btn-primary text-sm py-1.5 px-4">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-300 hover:text-white p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-4 flex flex-col gap-4 glass">
          <NavLink to="/"            className={navCls} end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/leaderboard" className={navCls} onClick={() => setOpen(false)}>Leaderboard</NavLink>
          {user && <NavLink to="/games"   className={navCls} onClick={() => setOpen(false)}>Games</NavLink>}
          {user && <NavLink to="/profile" className={navCls} onClick={() => setOpen(false)}>Profile</NavLink>}
          <div className="pt-2 border-t border-white/10 flex gap-3">
            {user
              ? <button onClick={handleLogout} className="btn-outline text-sm w-full">Logout</button>
              : <>
                  <Link to="/login"  onClick={() => setOpen(false)} className="btn-outline text-sm flex-1 text-center">Login</Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary text-sm flex-1 text-center">Sign Up</Link>
                </>
            }
          </div>
        </div>
      )}
    </nav>
  );
}

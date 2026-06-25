import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineClipboardList } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/25">
              <HiOutlineClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">TaskFlow</h1>
              <p className="text-[10px] text-slate-500 -mt-1 font-medium">by Kanggo</p>
            </div>
          </div>

          {/* Desktop User Info */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-violet-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <button
              onClick={logout}
              id="logout-button"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <HiOutlineLogout className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
          >
            {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 animate-slide-down">
            <div className="flex items-center gap-3 px-2 py-3 border-t border-slate-700/50">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-violet-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg"
            >
              <HiOutlineLogout className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

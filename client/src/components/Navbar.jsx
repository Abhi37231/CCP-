import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { clearProfile } from '../redux/slices/profileSlice';

import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearProfile());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Do not show the public navbar on dashboard routes, as they have their own sidebar/header
  const isDashboardRoute = location.pathname.includes('/dashboard') || location.pathname.includes('/employer-dashboard');

  if (isDashboardRoute) {
    return null;
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="h-20 w-full px-margin-desktop flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-base outline-none focus:outline-none"
        >
          <img alt="Career Connect Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo5npLZXO93JC1NE5Nsd7bTvZBFv_1CqFPiPhrUpbQBeyXYVkDs3hxsLN8XYNvgOJ6xHY4xplBp0-i4oQVe-U5RctZg7osKiNGh4T-FYslnD4l4yCAcfiG_A9KxzeTEWcTi8Gxm2lC58PfQrbKwc3BSoffZKg5WqSOuxDTuiJlfvU6dYwRPkHJojQGxBPGo-DQ2gqZZLBpbG2-WBQhn6-BD0Fzvx8W3rymsqzgFmqKFU2e5eqi_9fNFQ"/>
          <span className="font-headline-md text-headline-md text-on-surface tracking-tight">Career Connect</span>
        </Link>
        <nav className="hidden md:flex items-center gap-gutter">
          <Link to="/jobs" className={`transition-colors font-bold ${location.pathname === '/jobs' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
            Find Jobs
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to={user?.role === 'employer' ? '/employer-dashboard' : user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} 
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Dashboard
              </Link>
              {user?.role === 'job_seeker' && (
                <Link 
                  to="/ats-analyzer" 
                  className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
                >
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold">AI</span> ATS
                </Link>
              )}
              <div className="h-6 w-px bg-white/10"></div>
              <span className="text-on-surface font-medium hidden sm:block text-body-md">Hi, {user?.name}</span>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-error/10 text-error rounded-lg font-label-sm text-label-sm hover:bg-error/20 transition-all border border-error/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-base py-2 bg-secondary-container text-on-secondary-container rounded-lg font-label-sm text-label-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(87,27,193,0.3)]">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

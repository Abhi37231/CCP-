import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { clearProfile } from '../redux/slices/profileSlice';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearProfile());
    toast.success('Logged out successfully');
    setMobileMenuOpen(false);
    navigate('/login');
  };

  // Do not show the public navbar on dashboard routes, as they have their own sidebar/header
  const isDashboardRoute = location.pathname.includes('/dashboard') || location.pathname.includes('/employer-dashboard');

  if (isDashboardRoute) {
    return null;
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="h-20 w-full px-4 md:px-margin-desktop flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 md:gap-base outline-none focus:outline-none"
        >
          <img alt="Career Connect Logo" className="h-6 md:h-8 w-auto object-contain" src={logo}/>
          <span className="font-headline-md text-[18px] md:text-headline-md text-on-surface tracking-tight">Career Connect</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-on-surface-variant hover:text-on-surface p-2"
        >
          <span className="material-symbols-outlined text-[28px]">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-gutter">
          {(!isAuthenticated || user?.role === 'job_seeker') && (
            <Link 
              to={isAuthenticated ? "/jobs" : "/login"} 
              className={`transition-colors font-bold ${location.pathname === '/jobs' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              onClick={(e) => {
                if (!isAuthenticated) {
                  toast.info('Please log in first to find jobs');
                }
              }}
            >
              Find Jobs
            </Link>
          )}
          
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-high border-t border-white/5 absolute w-full left-0 top-20 shadow-2xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col py-4 px-4 gap-4">
            {(!isAuthenticated || user?.role === 'job_seeker') && (
              <Link 
                to={isAuthenticated ? "/jobs" : "/login"} 
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (!isAuthenticated) {
                    toast.info('Please log in first to find jobs');
                  }
                }}
                className={`p-3 rounded-lg transition-colors font-bold ${location.pathname === '/jobs' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5'}`}
              >
                Find Jobs
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.role === 'employer' ? '/employer-dashboard' : user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-lg text-on-surface-variant hover:bg-white/5 transition-colors"
                >
                  Dashboard
                </Link>
                {user?.role === 'job_seeker' && (
                  <Link 
                    to="/ats-analyzer" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-lg text-on-surface-variant hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold">AI</span> ATS Analyzer
                  </Link>
                )}
                <div className="h-px w-full bg-white/5 my-2"></div>
                <div className="p-3 text-on-surface font-medium text-body-md">
                  Signed in as {user?.name}
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left p-3 text-error hover:bg-error/10 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="h-px w-full bg-white/5 my-2"></div>
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-lg text-on-surface-variant hover:bg-white/5 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-secondary-container text-on-secondary-container rounded-lg font-label-sm text-center shadow-[0_0_15px_rgba(87,27,193,0.3)] mt-2"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

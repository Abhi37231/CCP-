import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { clearProfile } from '../redux/slices/profileSlice';

import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearProfile());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
              CareerConnect
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/jobs" className="text-gray-600 hover:text-primary font-medium">
              Jobs
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.role === 'employer' ? '/employer-dashboard' : user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} 
                  className="text-gray-600 hover:text-primary font-medium"
                >
                  Dashboard
                </Link>
                {user?.role === 'job_seeker' && (
                  <Link 
                    to="/ats-analyzer" 
                    className="text-gray-600 hover:text-primary font-medium flex items-center gap-1"
                  >
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">AI</span> ATS Analyzer
                  </Link>
                )}
                <div className="h-6 w-px bg-gray-200"></div>
                <span className="text-gray-800 font-medium hidden sm:block">Hi, {user?.name}</span>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium">
                  Log in
                </Link>
                <Link to="/register" className="bg-primary text-white hover:bg-blue-700 px-5 py-2 rounded-md font-medium transition-colors shadow-sm">
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

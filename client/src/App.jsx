import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './assets/logo.png';
import heroImage from './assets/image.png';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RegisterSelection from './pages/RegisterSelection';
import RegisterFresher from './pages/RegisterFresher';
import RegisterEmployee from './pages/RegisterEmployee';
import RegisterEmployer from './pages/RegisterEmployer';
import VerifyOtp from './pages/VerifyOtp';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import EditCompany from './pages/EditCompany';
import PostJob from './pages/PostJob';
import JobsList from './pages/JobsList';
import JobDetails from './pages/JobDetails';
import JobApplicants from './pages/JobApplicants';
import ApplicationDetails from './pages/ApplicationDetails';
import EditJob from './pages/EditJob';
import EmployerJobs from './pages/EmployerJobs';
import EmployerInterviews from './pages/EmployerInterviews';
import MyApplications from './pages/MyApplications';
import MyInterviews from './pages/MyInterviews';

// Profile Layouts
import EditProfileLayout from './pages/profile/EditProfileLayout';
import PublicProfile from './pages/profile/PublicProfile';
import ResumeBuilder from './components/profile/ResumeBuilder';
import AtsAnalyzer from './pages/AtsAnalyzer';
import ResumeManager from './pages/ResumeManager';
import LearningRoadmap from './pages/LearningRoadmap';

// Home Page mapped to welcome_career_connect_portal
const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      <div className="flex flex-col w-full relative min-h-[calc(100vh-80px)] overflow-hidden bg-surface-container-lowest">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-20 md:opacity-30 mix-blend-luminosity">
          <img src={heroImage} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
        </div>

        {/* Ambient Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 -left-1/4 w-[1200px] h-[1200px] bg-secondary/10 rounded-full blur-[150px] opacity-30 mix-blend-screen animate-pulse" style={{ animationDuration: "8s" }}></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1400px] bg-[radial-gradient(ellipse_at_center,rgba(79,219,200,0.03)_0%,transparent_60%)]"></div>
        </div>
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
          {/* Pre-headline Chip */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/50 backdrop-blur-md shadow-[0_0_15px_rgba(208,188,255,0.1)] border border-white/5 transition-transform hover:scale-105 cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(79,219,200,0.8)] animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Elite Tech Recruitment</span>
          </div>
          {/* Typography Stack */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Welcome to <br className="md:hidden" />
              <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(208,188,255,0.3)]">Career Connect Portal</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed opacity-90">
              Your journey to a better career starts here. Connect with top-tier companies, showcase your skills, and land the role you deserve in the tech industry's most exclusive network.
            </p>
          </div>
          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
            {isAuthenticated ? (
              <Link to={user?.role === 'employer' ? '/employer-dashboard' : user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} className="group relative px-8 py-4 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider overflow-hidden shadow-[0_0_30px_rgba(77,142,255,0.2)] hover:shadow-[0_0_50px_rgba(208,188,255,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Go to Dashboard
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </span>
              </Link>
            ) : (
              <>
                <Link to="/register" className="group relative px-8 py-4 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider overflow-hidden shadow-[0_0_30px_rgba(77,142,255,0.2)] hover:shadow-[0_0_50px_rgba(208,188,255,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    Create Account
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </Link>
                <Link to="/login" className="group px-8 py-4 rounded-lg bg-surface-container/30 backdrop-blur-sm text-on-background font-label-sm text-label-sm uppercase tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(208,188,255,0.15)] transition-all duration-300 relative">
                  <div className="absolute inset-0 rounded-lg border border-outline/30 group-hover:border-secondary/50 transition-colors"></div>
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,rgba(208,188,255,0.1)_0%,transparent_100%)] pointer-events-none"></div>
                  <span className="relative z-10">Log In</span>
                </Link>
              </>
            )}
          </div>

          {/* Social Proof / Decorative Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl mx-auto relative z-20">
            <div className="flex flex-col items-center justify-center p-6 bg-surface-container/20 rounded-xl backdrop-blur-sm border-t border-white/5">
              <span className="font-display-lg-mobile text-display-lg-mobile text-secondary drop-shadow-[0_0_10px_rgba(208,188,255,0.3)]">10k+</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-2">Active Roles</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-surface-container/20 rounded-xl backdrop-blur-sm border-t border-white/5">
              <span className="font-display-lg-mobile text-display-lg-mobile text-primary drop-shadow-[0_0_10px_rgba(173,198,255,0.3)]">500+</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-2">Tech Partners</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-surface-container/20 rounded-xl backdrop-blur-sm border-t border-white/5">
              <span className="font-display-lg-mobile text-display-lg-mobile text-tertiary drop-shadow-[0_0_10px_rgba(79,219,200,0.3)]">98%</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-2">Placement Rate</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-surface-container/20 rounded-xl backdrop-blur-sm border-t border-white/5">
              <span className="font-display-lg-mobile text-display-lg-mobile text-inverse-primary drop-shadow-[0_0_10px_rgba(0,90,194,0.3)]">24h</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-2">Avg. Response</span>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full bg-surface-container-lowest py-margin-desktop border-t border-white/5">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6 md:gap-gutter">
          <div className="flex items-center gap-base">
            <img alt="Career Connect Logo" className="h-6 w-auto opacity-50" src={logo} />
            <span className="font-label-sm text-label-sm text-on-surface-variant">© 2026 Career Connect Portal. Elite Recruitment.</span>
          </div>
          <div className="flex gap-gutter">
            <Link to="/" className="text-label-sm text-on-surface-variant hover:text-tertiary transition-colors">Privacy</Link>
            <Link to="/" className="text-label-sm text-on-surface-variant hover:text-tertiary transition-colors">Terms</Link>
            <Link to="/" className="text-label-sm text-on-surface-variant hover:text-tertiary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

const AdminDashboard = () => <div className="p-8 text-2xl font-bold text-center text-red-600">Admin Dashboard</div>;

const DashboardRouter = () => {
  const { user } = useSelector((state) => state.auth);
  if (user?.experienceLevel === 'experienced') {
    return <EmployeeDashboard />;
  }
  return <JobSeekerDashboard />;
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.includes('/dashboard') || location.pathname.includes('/employer-dashboard');

  if (isDashboardRoute) {
    return <main className="flex-grow w-full">{children}</main>;
  }

  return <main className="flex-grow w-full pt-20">{children}</main>;
};

function App() {
  const dispatch = useDispatch();
  const { isLoading: isAuthLoading } = useSelector((state) => state.auth);
  
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    dispatch(loadUser());

    // Ensure loader shows for at least 800ms to prevent flashing
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthLoading && minTimePassed) {
      setShowLoader(false);
    }
  }, [isAuthLoading, minTimePassed]);

  return (
    <Router>
      {showLoader && <LoadingScreen isLoading={showLoader} />}
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />

        <MainLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterSelection />} />
            <Route path="/register/fresher" element={<RegisterFresher />} />
            <Route path="/register/employee" element={<RegisterEmployee />} />
            <Route path="/register/employer" element={<RegisterEmployer />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes (Job Seeker) */}
            <Route element={<ProtectedRoute allowedRoles={['job_seeker']} />}>
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/profile/edit" element={<EditProfileLayout />} />
              <Route path="/profile/preview" element={<PublicProfile />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/resume-management" element={<ResumeManager />} />
              <Route path="/ats-analyzer" element={<AtsAnalyzer />} />
              <Route path="/learning-roadmap" element={<LearningRoadmap />} />
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/interviews" element={<MyInterviews />} />
            </Route>

            {/* Protected Routes (Employer) */}
            <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
              <Route path="/employer-dashboard" element={<EmployerDashboard />} />
              <Route path="/employer/jobs" element={<EmployerJobs />} />
              <Route path="/employer/interviews" element={<EmployerInterviews />} />
              <Route path="/company/edit" element={<EditCompany />} />
              <Route path="/jobs/new" element={<PostJob />} />
              <Route path="/employer/jobs/:id/edit" element={<EditJob />} />
              <Route path="/employer/jobs/:id/applicants" element={<JobApplicants />} />
              <Route path="/employer/applications/:id" element={<ApplicationDetails />} />
            </Route>

            {/* Protected Routes (Admin) */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

          </Routes>
        </MainLayout>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </Router>
  );
}

export default App;

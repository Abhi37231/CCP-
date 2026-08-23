import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
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

// Profile Layouts
import EditProfileLayout from './pages/profile/EditProfileLayout';
import PublicProfile from './pages/profile/PublicProfile';
import ResumeBuilder from './components/profile/ResumeBuilder';
import AtsAnalyzer from './pages/AtsAnalyzer';

// Temporary placeholder pages
const Home = () => (
  <div className="flex flex-col items-center justify-center h-[80vh]">
    <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Career Connect Portal</h1>
    <p className="text-gray-600 text-lg mb-8">Your journey to a better career starts here.</p>
    <div className="space-x-4">
      <Link to="/login" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors font-medium">Log In</Link>
      <Link to="/register" className="px-6 py-3 border border-primary text-primary rounded-md hover:bg-blue-50 transition-colors font-medium">Create Account</Link>
    </div>
  </div>
);

const AdminDashboard = () => <div className="p-8 text-2xl font-bold text-center text-red-600">Admin Dashboard</div>;

const DashboardRouter = () => {
  const { user } = useSelector((state) => state.auth);
  if (user?.experienceLevel === 'experienced') {
    return <EmployeeDashboard />;
  }
  return <JobSeekerDashboard />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        
        <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
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
            
            {/* Protected Routes (Job Seeker) */}
            <Route element={<ProtectedRoute allowedRoles={['job_seeker']} />}>
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/profile/edit" element={<EditProfileLayout />} />
              <Route path="/profile/preview" element={<PublicProfile />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/ats-analyzer" element={<AtsAnalyzer />} />
            </Route>

            {/* Protected Routes (Employer) */}
            <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
              <Route path="/employer-dashboard" element={<EmployerDashboard />} />
              <Route path="/company/edit" element={<EditCompany />} />
              <Route path="/jobs/new" element={<PostJob />} />
              <Route path="/employer/jobs/:id/applicants" element={<JobApplicants />} />
            </Route>

            {/* Protected Routes (Admin) */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>
            
          </Routes>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../redux/slices/profileSlice';
import { Link } from 'react-router-dom';
import { Building, Users, FileText, TrendingUp } from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/JobCard';

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.profile);
  const [myJobs, setMyJobs] = useState([]);
  const [stats, setStats] = useState({ totalApplicants: 0, shortlisted: 0, interviews: 0 });
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      const employerId = user?._id || user?.id;
      if (!employerId) return;
      setLoadingJobs(true);
      try {
        const [jobsRes, statsRes] = await Promise.all([
          api.get(`/jobs?employer=${employerId}&sort=-createdAt`),
          api.get('/applications/stats')
        ]);
        
        setMyJobs(jobsRes.data.data);
        setStats(statsRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoadingJobs(false);
      }
    };
    if (user) {
      fetchMyJobs();
    }
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
        {profile ? (
          <Link to="/jobs/new" className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Post a New Job
          </Link>
        ) : (
           <Link to="/company/edit" className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Setup Company Profile
          </Link>
        )}
      </div>

      {/* Welcome Banner */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Welcome, {user?.name}!</h2>
          <p className="text-gray-500 mt-1">Manage your job postings and applicants from here.</p>
        </div>
        <div className="hidden sm:block">
           <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <Building size={40} />
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-primary rounded-lg"><FileText /></div>
          <div>
            <p className="text-gray-500 text-sm">Active Jobs</p>
            <p className="text-2xl font-bold">{myJobs.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Users /></div>
          <div>
            <p className="text-gray-500 text-sm">Total Applicants</p>
            <p className="text-2xl font-bold">{stats.totalApplicants}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><TrendingUp /></div>
          <div>
            <p className="text-gray-500 text-sm">Shortlisted</p>
            <p className="text-2xl font-bold">{stats.shortlisted}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Users /></div>
          <div>
            <p className="text-gray-500 text-sm">Interviews</p>
            <p className="text-2xl font-bold">{stats.interviews}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
             <h3 className="text-xl font-semibold mb-4">Recent Job Postings</h3>
             {!profile ? (
                <div className="text-gray-500 text-center py-8">
                  You must complete your company profile before posting jobs.
                </div>
             ) : loadingJobs ? (
                <div className="text-gray-500 text-center py-8">
                  Loading jobs...
                </div>
             ) : myJobs.length > 0 ? (
                <div className="space-y-4">
                  {myJobs.map(job => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
             ) : (
                <div className="text-gray-500 text-center py-8">
                  You haven't posted any jobs yet. Click "Post a New Job" to get started.
                </div>
             )}
           </div>
        </div>
        <div className="space-y-6">
           <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
             <h3 className="text-xl font-semibold mb-4">Company Profile</h3>
             {profile ? (
               <div className="space-y-4">
                 <div className="flex items-center space-x-4 mb-4">
                    <img src={profile.logo === 'default-company-logo.png' ? 'https://via.placeholder.com/150' : `http://localhost:5000${profile.logo}`} alt="Company Logo" className="w-16 h-16 rounded object-cover border" />
                    <div>
                      <p className="font-semibold text-lg">{profile.name}</p>
                      <p className="text-gray-500 text-sm">{profile.industry}</p>
                    </div>
                 </div>
                 <Link to="/company/edit" className="block text-center text-primary font-medium hover:underline mt-4">Edit Profile</Link>
               </div>
             ) : (
               <div className="text-center">
                 <p className="text-gray-500 mb-4">Please set up your company profile to start hiring.</p>
                 <Link to="/company/edit" className="w-full block bg-primary text-white py-2 rounded text-center hover:bg-blue-700">Setup Company</Link>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;

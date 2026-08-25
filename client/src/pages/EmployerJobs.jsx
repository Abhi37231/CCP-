import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../redux/slices/profileSlice';
import { logoutUser } from '../redux/slices/authSlice';
import { clearProfile } from '../redux/slices/profileSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import JobCard from '../components/JobCard';
import NotificationDropdown from '../components/NotificationDropdown';

const EmployerJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.profile);
  const [myJobs, setMyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      const employerId = user?._id || user?.id;
      if (!employerId) return;
      setLoadingJobs(true);
      try {
        const jobsRes = await api.get(`/jobs?employer=${employerId}&sort=-createdAt`);
        setMyJobs(jobsRes.data.data);
      } catch (error) {
        console.error('Error fetching jobs', error);
      } finally {
        setLoadingJobs(false);
      }
    };
    if (user) {
      fetchMyJobs();
    }
  }, [user]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearProfile());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (isLoading) {
    return <div className="flex justify-center mt-20 text-on-background">Loading...</div>;
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <aside className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low border-r border-white/5 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 md:p-margin-desktop mb-base flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-base outline-none focus:outline-none hover:opacity-80 transition-opacity">
            <img alt="Logo" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo5npLZXO93JC1NE5Nsd7bTvZBFv_1CqFPiPhrUpbQBeyXYVkDs3hxsLN8XYNvgOJ6xHY4xplBp0-i4oQVe-U5RctZg7osKiNGh4T-FYslnD4l4yCAcfiG_A9KxzeTEWcTi8Gxm2lC58PfQrbKwc3BSoffZKg5WqSOuxDTuiJlfvU6dYwRPkHJojQGxBPGo-DQ2gqZZLBpbG2-WBQhn6-BD0Fzvx8W3rymsqzgFmqKFU2e5eqi_9fNFQ"/>
            <span className="text-on-surface font-headline-md text-[18px] md:text-headline-md tracking-tight whitespace-nowrap">Career Connect</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-on-surface-variant p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <Link to="/employer-dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center px-4 md:px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface rounded-xl transition-all border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-3 md:mr-4">dashboard</span>Dashboard
          </Link>
          <Link to="/jobs/new" onClick={() => setSidebarOpen(false)} className="flex items-center px-4 md:px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface rounded-xl transition-all border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-3 md:mr-4">add_box</span>Post a Job
          </Link>
          <Link to="/employer/jobs" onClick={() => setSidebarOpen(false)} aria-current="page" className="flex items-center px-4 md:px-6 py-3 rounded-xl transition-all bg-secondary-container/20 text-secondary border-l-4 border-secondary">
            <span className="material-symbols-outlined mr-3 md:mr-4">work</span>Posted Jobs
          </Link>
        </nav>
        <div className="p-4 md:p-6 mt-auto">
          <div className="bg-surface-container-highest p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex flex-col">
                <span className="text-body-md font-bold text-on-surface truncate">{user?.name || 'Employer'}</span>
                <span className="text-label-sm text-on-surface-variant capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
            <Link to="/company/edit" onClick={() => setSidebarOpen(false)} className="flex items-center text-label-sm text-secondary hover:underline">
              <span className="material-symbols-outlined text-[16px] mr-1">settings</span>Company Settings
            </Link>
          </div>
        </div>
      </aside>

      <div className="md:pl-72 flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 md:left-72 right-0 h-20 bg-surface/70 backdrop-blur-xl border-b border-white/5 z-30 flex items-center justify-between px-4 md:px-margin-desktop">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-on-surface-variant hover:text-on-surface p-1 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative flex items-center bg-surface-container-high px-4 py-2 rounded-full border border-white/10">
                <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
                <input className="bg-transparent border-none outline-none text-on-surface placeholder:text-outline w-full text-body-md" placeholder="Search applicants..." type="text"/>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-gutter ml-auto">
            <NotificationDropdown />
            <button onClick={handleLogout} className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors cursor-pointer">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-sm text-label-sm">Logout</span>
            </button>
          </div>
        </header>

        <main className="relative pt-20 bg-background flex-1 flex flex-col">
          <div className="flex flex-col w-full p-4 md:p-margin-desktop gap-6 md:gap-margin-desktop">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="font-display-md text-display-md text-on-surface mb-2">Posted Jobs</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">View and manage all your job postings.</p>
              </div>
              <Link to="/jobs/new" className="px-6 py-3 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary-fixed-dim transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0">
                <span className="material-symbols-outlined">add</span>
                Post a New Job
              </Link>
            </div>
            
            <div className="flex flex-col gap-4 w-full max-w-5xl">
              {!profile ? (
                <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant border border-white/5">
                  You must complete your company profile before posting jobs.
                </div>
              ) : loadingJobs ? (
                <div className="bg-surface-container rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 opacity-60">
                  <div className="flex gap-4 items-start sm:items-center w-full max-w-md">
                    <div className="w-14 h-14 rounded-xl bg-surface-container-highest flex-shrink-0 animate-pulse"></div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="h-6 bg-surface-container-highest rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-surface-container-highest rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ) : myJobs.length > 0 ? (
                myJobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))
              ) : (
                <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant border border-white/5">
                  You haven't posted any jobs yet. Click "Post a New Job" to get started.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default EmployerJobs;

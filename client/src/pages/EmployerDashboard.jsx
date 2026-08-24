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

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low border-r border-white/5 z-50 flex flex-col shadow-2xl">
        <Link to="/" className="p-margin-desktop mb-base flex items-center gap-base outline-none focus:outline-none hover:opacity-80 transition-opacity">
          <img alt="Logo" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo5npLZXO93JC1NE5Nsd7bTvZBFv_1CqFPiPhrUpbQBeyXYVkDs3hxsLN8XYNvgOJ6xHY4xplBp0-i4oQVe-U5RctZg7osKiNGh4T-FYslnD4l4yCAcfiG_A9KxzeTEWcTi8Gxm2lC58PfQrbKwc3BSoffZKg5WqSOuxDTuiJlfvU6dYwRPkHJojQGxBPGo-DQ2gqZZLBpbG2-WBQhn6-BD0Fzvx8W3rymsqzgFmqKFU2e5eqi_9fNFQ"/>
          <span className="text-on-surface font-headline-md text-headline-md tracking-tight whitespace-nowrap">Career Connect</span>
        </Link>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/employer-dashboard" aria-current="page" className="flex items-center px-6 py-3 rounded-xl transition-all bg-secondary-container/20 text-secondary border-l-4 border-secondary">
            <span className="material-symbols-outlined mr-4">dashboard</span>Dashboard
          </Link>
          <Link to="/jobs/new" className="flex items-center px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface rounded-xl transition-all border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-4">add_box</span>Post a Job
          </Link>
          <Link to="/employer/jobs" className="flex items-center px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface rounded-xl transition-all border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-4">work</span>Posted Jobs
          </Link>
        </nav>
        <div className="p-6 mt-auto">
          <div className="bg-surface-container-highest p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex flex-col">
                <span className="text-body-md font-bold text-on-surface">{user?.name || 'Employer'}</span>
                <span className="text-label-sm text-on-surface-variant capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
            <Link to="/company/edit" className="flex items-center text-label-sm text-secondary hover:underline">
              <span className="material-symbols-outlined text-[16px] mr-1">settings</span>Company Settings
            </Link>
          </div>
        </div>
      </aside>

      <div className="pl-72">
        <header className="fixed top-0 left-72 right-0 h-20 bg-surface/70 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-margin-desktop">
          <div className="flex-1 max-w-md">
            <div className="relative flex items-center bg-surface-container-high px-4 py-2 rounded-full border border-white/10">
              <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
              <input className="bg-transparent border-none outline-none text-on-surface placeholder:text-outline w-full text-body-md" placeholder="Search applicants..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-gutter">
            <NotificationDropdown />
            <button onClick={handleLogout} className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors cursor-pointer">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-sm text-label-sm">Logout</span>
            </button>
          </div>
        </header>

        <main className="relative pt-20 bg-background min-h-screen">
          <div className="flex flex-col w-full p-margin-desktop gap-margin-desktop">
            
            {/* Welcome Banner */}
            <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-surface-container flex items-center min-h-[240px]">
              <div className="absolute inset-0 z-0">
                <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-60 mix-blend-screen blur-3xl transform rotate-12"></div>
                <div className="absolute bottom-[-50%] right-[-10%] w-[80%] h-[150%] bg-gradient-to-tl from-primary/10 via-transparent to-transparent opacity-50 mix-blend-screen blur-3xl transform -rotate-12"></div>
              </div>
              <div className="relative z-10 p-12 flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-8">
                <div className="flex flex-col max-w-2xl">
                  <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Welcome, {user?.name || 'Employer'}.</h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your job postings and find the perfect candidates for your team.</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {profile ? (
                    <Link to="/jobs/new" className="px-6 py-3 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary-fixed-dim transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0">
                      <span className="material-symbols-outlined">add</span>
                      Post a New Job
                    </Link>
                  ) : (
                    <Link to="/company/edit" className="px-6 py-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-fixed-dim transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0">
                      <span className="material-symbols-outlined">domain</span>
                      Setup Company Profile
                    </Link>
                  )}
                </div>
              </div>
            </section>

            {/* Metrics Row */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter w-full">
              <div className="group relative bg-surface-container rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active Jobs</span>
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:bg-primary-container/40 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>work</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-display-lg text-on-surface">{myJobs.length}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">postings</span>
                </div>
              </div>

              <div className="group relative bg-surface-container rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Applicants</span>
                  <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary group-hover:bg-secondary-container/40 transition-colors">
                    <span className="material-symbols-outlined text-secondary text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>group</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-display-lg text-on-surface">{stats.totalApplicants}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">candidates</span>
                </div>
              </div>

              <div className="group relative bg-surface-container rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tertiary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Shortlisted</span>
                  <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary group-hover:bg-tertiary-container/40 transition-colors">
                    <span className="material-symbols-outlined text-tertiary text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-display-lg text-on-surface">{stats.shortlisted}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">candidates</span>
                </div>
              </div>

              <div className="group relative bg-surface-container rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-inverse-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Interviews</span>
                  <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center text-inverse-primary group-hover:bg-inverse-surface transition-colors">
                    <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>event_available</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-display-lg text-on-surface">{stats.interviews}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">scheduled</span>
                </div>
              </div>
            </section>

            {/* Two Column Content */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-gutter w-full items-start">
              {/* Left Column: Recent Job Postings */}
              <div className="xl:col-span-8 flex flex-col gap-6 w-full" id="recent-jobs">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Recent Job Postings</h2>
                </div>

                <div className="flex flex-col gap-4">
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

              {/* Right Column: Company Profile */}
              <aside className="xl:col-span-4 w-full flex flex-col gap-6">
                <div className="bg-surface-container-high rounded-3xl p-8 shadow-xl relative overflow-hidden border border-white/5">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/20 rounded-full blur-[40px] pointer-events-none"></div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-6 relative z-10">Company Profile</h2>
                  
                  {profile ? (
                    <div className="flex flex-col gap-6 relative z-10">
                      <div className="flex items-center gap-4 bg-surface-container rounded-2xl p-4 border border-white/5">
                        <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex-shrink-0 flex items-center justify-center p-2 shadow-inner overflow-hidden border border-white/10">
                          {profile.logo && profile.logo !== 'default-company-logo.png' ? (
                            <img src={`http://localhost:5000${profile.logo}`} alt={profile.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant text-3xl">domain</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-headline-sm text-on-surface">{profile.name}</span>
                          <span className="font-body-md text-body-md text-on-surface-variant">{profile.industry || 'Industry not set'}</span>
                        </div>
                      </div>
                      <Link to="/company/edit" className="w-full py-4 rounded-xl bg-surface-container-lowest text-secondary font-label-sm text-label-sm border border-secondary/20 hover:bg-secondary/10 hover:border-secondary/50 hover:shadow-[0_0_20px_rgba(208,188,255,0.15)] transition-all duration-300 flex items-center justify-center gap-2 group">
                        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">edit</span>
                        Edit Profile
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 text-center relative z-10">
                      <p className="font-body-md text-body-md text-on-surface-variant">Please set up your company profile to start hiring and posting jobs.</p>
                      <Link to="/company/edit" className="w-full py-4 rounded-xl bg-secondary text-on-secondary font-label-sm text-label-sm hover:bg-secondary-fixed-dim transition-all shadow-[0_0_15px_rgba(208,188,255,0.3)]">
                        Setup Company
                      </Link>
                    </div>
                  )}
                </div>
              </aside>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default EmployerDashboard;

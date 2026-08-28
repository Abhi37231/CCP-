import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../redux/slices/profileSlice';
import { logoutUser } from '../redux/slices/authSlice';
import { clearProfile } from '../redux/slices/profileSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import api from '../services/api';
import JobCard from '../components/JobCard';
import NotificationDropdown from '../components/NotificationDropdown';
import { getMediaUrl } from '../utils/formatUrl';
import LoadingScreen from '../components/LoadingScreen';


const JobSeekerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.profile);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/me');
        setMyApplications(res.data.data);
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!profile || profile.profileCompletion < 50) return;
      
      setLoadingJobs(true);
      try {
        let skills = [];
        if (profile.skills) {
           Object.values(profile.skills).forEach(skillCategory => {
              if (Array.isArray(skillCategory)) {
                 skillCategory.forEach(s => skills.push(s.name));
              }
           });
        }
        
        let keywordQuery = skills.join(' ');
        let endpoint = keywordQuery ? `/jobs?keyword=${encodeURIComponent(keywordQuery)}&limit=3` : '/jobs?limit=3';
        
        if (user?.role === 'job_seeker' && user?.experienceLevel === 'fresher') {
           const audQuery = 'targetAudience=Student&targetAudience=Both';
           endpoint += `&${audQuery}`;
        }
        
        const res = await api.get(endpoint);
        setRecommendedJobs(res.data.data);
      } catch (err) {
        console.error('Error fetching recommended jobs', err);
      } finally {
        setLoadingJobs(false);
      }
    };
    
    fetchRecommendedJobs();
  }, [profile]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearProfile());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  const completionPercentage = profile?.profileCompletion || 0;

  const isPersonalInfoComplete = !!(profile?.personalInfo?.firstName);
  const isEducationComplete = !!(profile?.education?.length > 0);
  const isSkillsComplete = !!(profile?.skills && Object.keys(profile.skills).some(k => profile.skills[k]?.length > 0));
  const isProjectsComplete = !!(profile?.projects?.length > 0);
  const isResumeUploaded = !!(profile?.resume);
  const isCertificationsComplete = !!(profile?.certifications?.length > 0);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Shortlisted': 
        return <span className="bg-tertiary-container/30 text-tertiary border border-tertiary/20 px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[14px]">star</span> Shortlisted</span>;
      case 'Selected': 
      case 'Hired': 
        return <span className="bg-primary-container/30 text-primary border border-primary/20 px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[14px]">verified</span> Selected</span>;
      case 'Rejected': 
        return <span className="bg-error-container/30 text-error border border-error/20 px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[14px]">cancel</span> Rejected</span>;
      case 'Interview Scheduled':
      case 'Interview Completed':
      case 'Interviewing': 
        return <span className="bg-secondary-container/30 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[14px]">calendar_month</span> {status}</span>;
      case 'Under Review': 
      case 'Reviewed': 
        return <span className="bg-inverse-primary/20 text-inverse-primary border border-inverse-primary/20 px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[14px]">visibility</span> Under Review</span>;
      default: 
        return <span className="bg-surface-container-highest text-on-surface-variant border border-white/5 px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[14px]">hourglass_empty</span> Applied</span>;
    }
  };

  const interviewsCount = myApplications.filter(app => ['Interview Scheduled', 'Interview Completed', 'Interviewing'].includes(app.status)).length;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <aside className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low border-r border-white/5 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 md:p-margin-desktop mb-base flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-base outline-none focus:outline-none hover:opacity-80 transition-opacity">
            <img alt="Logo" className="h-8 w-auto" src={logo}/>
            <span className="text-on-surface font-headline-md text-[18px] md:text-headline-md tracking-tight whitespace-nowrap">Career Connect</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-on-surface-variant p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <Link to="/dashboard" onClick={() => setSidebarOpen(false)} aria-current="page" className="flex items-center px-4 md:px-6 py-3 rounded-xl transition-all bg-primary-container/20 text-primary border-l-4 border-primary">
            <span className="material-symbols-outlined mr-3 md:mr-4">dashboard</span>Dashboard
          </Link>
          <Link to="/jobs" onClick={() => setSidebarOpen(false)} className="flex items-center px-4 md:px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface rounded-xl transition-all border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-3 md:mr-4">search</span>Find Jobs
          </Link>
          <Link to="/resume-management" onClick={() => setSidebarOpen(false)} className="flex items-center px-4 md:px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface rounded-xl transition-all border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-3 md:mr-4">description</span>Resume
          </Link>
          <Link to="/ats-analyzer" onClick={() => setSidebarOpen(false)} className="flex items-center px-4 md:px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface rounded-xl transition-all border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-3 md:mr-4">smart_toy</span>ATS Analyzer
          </Link>
          <Link to="/learning-roadmap" onClick={() => setSidebarOpen(false)} className="flex items-center px-4 md:px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface rounded-xl transition-all border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-3 md:mr-4">route</span>AI Learning Roadmap
          </Link>
        </nav>
        <div className="p-4 md:p-6 mt-auto">
          <div className="bg-surface-container-highest p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex flex-col">
                <span className="text-body-md font-bold text-on-surface truncate">{user?.name || profile?.personalInfo?.firstName || 'User'}</span>
                <span className="text-label-sm text-on-surface-variant capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
            <Link to="/profile/edit" onClick={() => setSidebarOpen(false)} className="flex items-center text-label-sm text-primary hover:underline">
              <span className="material-symbols-outlined text-[16px] mr-1">settings</span>Account Settings
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72 flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-surface/70 backdrop-blur-xl border-b border-white/5 z-30 flex items-center justify-between px-4 md:px-margin-desktop">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-on-surface-variant hover:text-on-surface p-1 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative flex items-center bg-surface-container-high px-4 py-2 rounded-full border border-white/10">
                <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
                <input className="bg-transparent border-none outline-none text-on-surface placeholder:text-outline w-full text-body-md" placeholder="Search jobs or skills..." type="text"/>
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
            
            {/* Welcome Banner */}
            <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-surface-container flex items-center min-h-[240px]">
              <div className="absolute inset-0 z-0">
                <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60 mix-blend-screen blur-3xl transform rotate-12"></div>
                <div className="absolute bottom-[-50%] right-[-10%] w-[80%] h-[150%] bg-gradient-to-tl from-tertiary/10 via-transparent to-transparent opacity-50 mix-blend-screen blur-3xl transform -rotate-12"></div>
              </div>
              <div className="relative z-10 p-6 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-8">
                <div className="flex flex-col max-w-2xl">
                  <h1 className="font-display-sm md:font-display-lg text-[32px] md:text-display-lg text-on-surface mb-2">Welcome back, {user?.name || profile?.personalInfo?.firstName || 'User'}.</h1>
                  <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant">Your career velocity is accelerating. Let's find your next breakthrough role.</p>
                </div>
                <div className="hidden lg:block w-48 h-48 relative rounded-full overflow-hidden shadow-[0_0_40px_rgba(77,142,255,0.15)] bg-surface-container-highest">
                  {profile?.personalInfo?.profilePhoto ? (
                    <img 
                      src={getMediaUrl(profile.personalInfo.profilePhoto)} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <span className="material-symbols-outlined text-[64px] text-primary">rocket_launch</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Metrics Row */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter w-full">
              <Link to="/applications" className="group relative bg-surface-container rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden cursor-pointer block">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Applied</span>
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:bg-primary-container/40 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-display-lg text-on-surface">{loadingApps ? '-' : myApplications.length}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">jobs</span>
                </div>
              </Link>

              <Link to="/jobs?tab=saved" className="group relative bg-surface-container rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden cursor-pointer block">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tertiary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Saved</span>
                  <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary group-hover:bg-tertiary-container/40 transition-colors">
                    <span className="material-symbols-outlined text-tertiary text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>bookmark</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-display-lg text-on-surface">{profile?.savedJobs?.length || 0}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">jobs</span>
                </div>
              </Link>

              <Link to="/interviews" className="group relative bg-surface-container rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden cursor-pointer block">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Interviews</span>
                  <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary group-hover:bg-secondary-container/40 transition-colors">
                    <span className="material-symbols-outlined text-secondary text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>event_available</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-display-lg text-on-surface">{loadingApps ? '-' : interviewsCount}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">scheduled</span>
                </div>
              </Link>
            </section>

              {/* Two Column Content */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-gutter w-full items-start">
              {/* Left Column: Recommended Jobs & Applications */}
              <div className="xl:col-span-8 flex flex-col gap-8 w-full">
                
                {/* Applied Jobs Section */}
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="font-headline-md text-headline-md text-on-surface">My Applications</h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    {loadingApps ? (
                       <div className="bg-surface-container rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 opacity-60">
                         <div className="animate-pulse flex gap-4 w-full">
                           <div className="w-12 h-12 bg-surface-container-highest rounded-full"></div>
                           <div className="flex flex-col gap-2 w-full">
                             <div className="h-4 bg-surface-container-highest rounded w-1/3"></div>
                             <div className="h-3 bg-surface-container-highest rounded w-1/4"></div>
                           </div>
                         </div>
                       </div>
                    ) : myApplications.length > 0 ? (
                      myApplications.map(app => (
                        <div key={app._id} className="bg-surface-container-low rounded-2xl p-5 border border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between relative overflow-hidden">
                          {app.status === 'Interview Scheduled' && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                          )}
                          <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                              {app.job?.company?.logo ? (
                                <img src={getMediaUrl(app.job.company.logo)} alt={app.job.company.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-on-surface-variant">business</span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-bold text-on-surface text-lg">{app.job?.title || 'Unknown Job'}</h3>
                              <span className="text-on-surface-variant text-sm">{app.job?.company?.name || 'Unknown Company'}</span>
                              <span className="text-xs text-on-surface-variant opacity-70 mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                              
                              {app.interview && app.interview.date && (app.status === 'Interview Scheduled' || app.status === 'Interviewing') && (
                                <div className="mt-3 bg-secondary/10 border border-secondary/20 rounded-lg p-3 flex flex-col gap-1.5 w-full max-w-sm">
                                  <span className="text-secondary text-xs font-bold uppercase flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">event_available</span> 
                                    Interview Scheduled
                                  </span>
                                  <span className="text-on-surface text-sm font-medium">
                                    {new Date(app.interview.date).toLocaleDateString()} at {app.interview.time}
                                  </span>
                                  <span className="text-on-surface-variant text-xs">
                                    {app.interview.type} Interview
                                  </span>
                                  {app.interview.link && app.interview.type === 'Online' && (
                                    <a href={app.interview.link} target="_blank" rel="noreferrer" className="mt-1 text-primary hover:underline text-xs flex items-center gap-1 w-fit">
                                      <span className="material-symbols-outlined text-[14px]">link</span> Join Meeting
                                    </a>
                                  )}
                                  {app.interview.location && app.interview.type === 'Offline' && (
                                    <span className="mt-1 text-on-surface-variant text-xs flex items-center gap-1">
                                      <span className="material-symbols-outlined text-[14px]">location_on</span> {app.interview.location}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex shrink-0 self-start sm:self-center">
                            {getStatusBadge(app.status)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant border border-white/5">
                        You haven't applied to any jobs yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Jobs Section */}
                <div className="flex flex-col gap-4 w-full mt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-headline-md text-headline-md text-on-surface">Recommended for You</h2>
                    {recommendedJobs.length > 0 && (
                      <Link to="/jobs" className="text-primary font-label-sm text-label-sm hover:text-primary-container transition-colors flex items-center gap-1 group">
                        View all <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </Link>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    {completionPercentage < 50 ? (
                      <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant border border-white/5">
                        Complete your profile to see recommended jobs!
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
                    ) : recommendedJobs.length > 0 ? (
                      recommendedJobs.map(job => (
                        <JobCard key={job._id} job={job} />
                      ))
                    ) : (
                      <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant border border-white/5">
                        No recommendations at this time. We'll notify you when new jobs match your profile.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Profile Completion */}
              <aside className="xl:col-span-4 w-full flex flex-col gap-6">
                <div className="bg-surface-container-high rounded-3xl p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none"></div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-6 relative z-10">Profile Strength</h2>
                  
                  <div className="relative w-full h-3 bg-surface-container-highest rounded-full mb-8 overflow-hidden z-10 shadow-inner">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-tertiary to-primary rounded-full shadow-[0_0_12px_rgba(79,219,200,0.8)] relative after:content-[''] after:absolute after:top-0 after:right-0 after:w-4 after:h-full after:bg-white/30 after:blur-[2px]" style={{ width: `${completionPercentage}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6 z-10 relative">
                    <span className="font-display-lg text-display-lg text-on-surface leading-none">{completionPercentage}<span className="text-headline-md text-on-surface-variant">%</span></span>
                    <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest px-3 py-1 bg-tertiary/10 rounded-full">
                      {completionPercentage < 50 ? 'Beginner' : completionPercentage < 80 ? 'Intermediate' : 'Expert'}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-4 mb-8 relative z-10">
                    <li className={`flex items-start gap-3 ${isPersonalInfoComplete ? 'opacity-50' : ''}`}>
                      <span className={`material-symbols-outlined text-[20px] ${isPersonalInfoComplete ? 'text-primary' : 'text-outline'}`} style={{fontVariationSettings: isPersonalInfoComplete ? "'FILL' 1" : "'FILL' 0"}}>
                        {isPersonalInfoComplete ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className={`font-body-md text-body-md text-on-surface ${isPersonalInfoComplete ? 'line-through' : ''}`}>Personal Information</span>
                    </li>
                    <li className={`flex items-start gap-3 ${isEducationComplete ? 'opacity-50' : ''}`}>
                      <span className={`material-symbols-outlined text-[20px] ${isEducationComplete ? 'text-primary' : 'text-outline'}`} style={{fontVariationSettings: isEducationComplete ? "'FILL' 1" : "'FILL' 0"}}>
                        {isEducationComplete ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className={`font-body-md text-body-md text-on-surface ${isEducationComplete ? 'line-through' : ''}`}>Education</span>
                    </li>
                    <li className={`flex items-start gap-3 ${isSkillsComplete ? 'opacity-50' : ''}`}>
                      <span className={`material-symbols-outlined text-[20px] ${isSkillsComplete ? 'text-primary' : 'text-outline'}`} style={{fontVariationSettings: isSkillsComplete ? "'FILL' 1" : "'FILL' 0"}}>
                        {isSkillsComplete ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className={`font-body-md text-body-md text-on-surface ${isSkillsComplete ? 'line-through' : ''}`}>Skills</span>
                    </li>
                    <li className={`flex items-start gap-3 ${isProjectsComplete ? 'opacity-50' : ''}`}>
                      <span className={`material-symbols-outlined text-[20px] ${isProjectsComplete ? 'text-primary' : 'text-outline'}`} style={{fontVariationSettings: isProjectsComplete ? "'FILL' 1" : "'FILL' 0"}}>
                        {isProjectsComplete ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className={`font-body-md text-body-md text-on-surface ${isProjectsComplete ? 'line-through' : ''}`}>Projects</span>
                    </li>
                    <li className={`flex items-start gap-3 ${isResumeUploaded ? 'opacity-50' : ''}`}>
                      <span className={`material-symbols-outlined text-[20px] ${isResumeUploaded ? 'text-primary' : 'text-outline'}`} style={{fontVariationSettings: isResumeUploaded ? "'FILL' 1" : "'FILL' 0"}}>
                        {isResumeUploaded ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className={`font-body-md text-body-md text-on-surface ${isResumeUploaded ? 'line-through' : ''}`}>Resume Upload</span>
                    </li>
                    <li className={`flex items-start gap-3 ${isCertificationsComplete ? 'opacity-50' : ''}`}>
                      <span className={`material-symbols-outlined text-[20px] ${isCertificationsComplete ? 'text-primary' : 'text-outline'}`} style={{fontVariationSettings: isCertificationsComplete ? "'FILL' 1" : "'FILL' 0"}}>
                        {isCertificationsComplete ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className={`font-body-md text-body-md text-on-surface ${isCertificationsComplete ? 'line-through' : ''}`}>Certifications</span>
                    </li>
                  </ul>

                  <Link to="/resume-builder" className="w-full py-4 rounded-xl bg-surface-container-lowest text-primary font-label-sm text-label-sm border border-primary/20 hover:bg-primary/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(173,198,255,0.15)] transition-all duration-300 relative z-10 flex items-center justify-center gap-2 group">
                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">auto_awesome</span>
                    Build ATS Resume
                  </Link>
                </div>
              </aside>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default JobSeekerDashboard;

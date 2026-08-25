import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Briefcase } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import JobCard from '../components/JobCard';

const JobsList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'discover';

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab); // 'discover' | 'applied' | 'saved'
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const fetchJobs = async (search = '') => {
    setLoading(true);
    try {
      let endpoint = search ? `/jobs?keyword=${search}` : '/jobs';
      
      // Filter based on user experience level and target audience
      if (user?.role === 'job_seeker' && user?.experienceLevel === 'fresher') {
        const audQuery = 'targetAudience=Student&targetAudience=Both';
        endpoint += endpoint.includes('?') ? `&${audQuery}` : `?${audQuery}`;
      } else if (user?.role === 'job_seeker' && user?.experienceLevel === 'experienced') {
        const audQuery = 'targetAudience=Employee&targetAudience=Both';
        endpoint += endpoint.includes('?') ? `&${audQuery}` : `?${audQuery}`;
      }

      if (employmentType) {
        endpoint += endpoint.includes('?') ? `&employmentType=${encodeURIComponent(employmentType)}` : `?employmentType=${encodeURIComponent(employmentType)}`;
      }
      if (workMode) {
        endpoint += endpoint.includes('?') ? `&workMode=${encodeURIComponent(workMode)}` : `?workMode=${encodeURIComponent(workMode)}`;
      }
      
      const response = await api.get(endpoint);
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/applications/me');
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/profile/saved-jobs');
      setSavedJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'discover') {
      fetchJobs(searchQuery);
    } else if (activeTab === 'applied' && isAuthenticated) {
      fetchApplications();
    } else if (activeTab === 'saved' && isAuthenticated) {
      fetchSavedJobs();
    }
  }, [user, employmentType, workMode, activeTab, isAuthenticated]);

  const handleWithdraw = async (appId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await api.delete(`/applications/${appId}`);
        setApplications(applications.filter(app => app._id !== appId));
      } catch (error) {
        console.error('Error withdrawing application:', error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(keyword);
    fetchJobs(keyword);
  };

  return (
    <main className="pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full px-4 md:px-margin-desktop py-8 max-w-container-max mx-auto">
        
        {/* Banner and Search (Only show on Discover tab) */}
        {activeTab === 'discover' && (
          <div className="w-full bg-surface-container rounded-xl p-8 mb-8 shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-tertiary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <div className="relative z-10">
              <h1 className="font-display-lg text-display-lg text-on-surface mb-6">Discover Your Next Role</h1>
              
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input 
                  className="w-full h-14 pl-12 pr-4 rounded-lg bg-surface-container-highest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body-md text-body-md placeholder-on-surface-variant/50 border-none" 
                  placeholder="Job title, keywords, or company..." 
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <button type="submit" className="h-14 px-8 bg-gradient-to-r from-inverse-primary to-primary-container text-on-primary-container rounded-lg font-label-sm text-label-sm shadow-[0_0_20px_rgba(77,142,255,0.4)] hover:shadow-[0_0_30px_rgba(77,142,255,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                <span>Search Jobs</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
          </div>
          </div>
        )}

        {/* Tabs for Job Seekers/Employees */}
        {isAuthenticated && user?.role !== 'employer' && user?.role !== 'admin' && (
          <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => setActiveTab('discover')}
              className={`font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md px-4 py-2 rounded-lg transition-colors ${activeTab === 'discover' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Discover Jobs
            </button>
            <button
              onClick={() => setActiveTab('applied')}
              className={`font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md px-4 py-2 rounded-lg transition-colors ${activeTab === 'applied' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              My Applications
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md px-4 py-2 rounded-lg transition-colors ${activeTab === 'saved' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Saved Jobs
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-gutter relative">
          
          {/* Filters Sidebar */}
          {activeTab === 'discover' && (
            <div className="w-full lg:w-1/4 lg:sticky top-28 h-fit z-20">
            <div className="bg-surface-container rounded-xl p-6 shadow-sm flex flex-col gap-8">
              <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest">
                <h2 className="font-headline-md text-headline-md text-on-surface">Filters</h2>
                <button 
                  onClick={() => {
                    setEmploymentType('');
                    setWorkMode('');
                  }}
                  className="text-label-sm font-label-sm text-tertiary hover:text-tertiary-fixed transition-colors"
                >
                  Clear All
                </button>
              </div>
              
              <div className="flex flex-col gap-4">
                <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Employment Type</h3>
                <select 
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23d4e4fa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[right_16px_center]"
                >
                  <option value="">Any Employment Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Work Mode</h3>
                <select 
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23d4e4fa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[right_16px_center]"
                >
                  <option value="">Any Work Mode</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>
          </div>
          )}

          {/* Jobs List */}
          <div className={activeTab === 'discover' ? "w-full lg:w-3/4 flex flex-col gap-6" : "w-full flex flex-col gap-6"}>
            <div className="flex items-center justify-between">
              <p className="font-body-md text-body-md text-on-surface-variant">
                {activeTab === 'discover' ? (
                  searchQuery ? (
                    <>Showing results for <strong className="text-on-surface">"{searchQuery}"</strong> ({jobs.length} jobs)</>
                  ) : (
                    <>Showing <strong className="text-on-surface">{jobs.length}</strong> latest roles</>
                  )
                ) : activeTab === 'applied' ? (
                  <>Showing <strong className="text-on-surface">{applications.length}</strong> applied roles</>
                ) : (
                  <>Showing <strong className="text-on-surface">{savedJobs.length}</strong> saved roles</>
                )}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
                <select className="bg-surface-container text-on-surface font-body-md text-body-md rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer pr-8 border-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23d4e4fa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[right_10px_center]">
                  <option>Most Relevant</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : activeTab === 'discover' ? (
              jobs.length === 0 ? (
                <div className="bg-surface-container p-12 rounded-xl text-center border border-white/5">
                  <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[32px] text-on-surface-variant">search_off</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No jobs found</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                    We couldn't find any jobs matching your criteria. Try adjusting your search or clearing filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              )
            ) : activeTab === 'applied' ? (
              applications.length === 0 ? (
                <div className="bg-surface-container p-12 rounded-xl text-center border border-white/5">
                  <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[32px] text-on-surface-variant">work_off</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No applications yet</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                    You haven't applied to any jobs yet. Head over to the Discover tab to find your next opportunity!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {applications.map((app) => (
                    <JobCard 
                      key={app._id} 
                      job={app.job} 
                      applicationId={app._id} 
                      applicationStatus={app.status} 
                      onWithdraw={() => handleWithdraw(app._id)} 
                    />
                  ))}
                </div>
              )
            ) : (
              savedJobs.length === 0 ? (
                <div className="bg-surface-container p-12 rounded-xl text-center border border-white/5">
                  <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[32px] text-on-surface-variant">bookmark_remove</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No saved jobs</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                    You haven't saved any jobs yet. Click the bookmark icon on jobs you're interested in!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {savedJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              )
            )}
          </div>

        </div>
      </div>
    </main>
  );
};

export default JobsList;

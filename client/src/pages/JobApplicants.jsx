import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { getMediaUrl } from '../utils/formatUrl';

const JobApplicants = () => {
  const { id } = useParams(); // Job ID
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  // ATS Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState('-createdAt');
  
  // Bulk Actions
  const [selectedApps, setSelectedApps] = useState([]);

  // ATS Analysis
  const [analyzingAll, setAnalyzingAll] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleAnalyzeAll = async () => {
    setAnalyzingAll(true);
    let count = 0;
    const appsToAnalyze = applications.filter(app => typeof app.atsScore !== 'number');

    if (appsToAnalyze.length === 0) {
      toast.info("All applicants are already analyzed! Sorting by score...");
      setSortOption('-atsScore');
      setAnalyzingAll(false);
      return;
    }

    try {
      let successCount = 0;
      let failCount = 0;
      
      for (const app of appsToAnalyze) {
        try {
          await api.post(`/ats/analyze-application/${app._id}`);
          successCount++;
        } catch (err) {
          console.error(`Failed to analyze applicant ${app._id}:`, err);
          failCount++;
        }
        count++;
        setAnalysisProgress(Math.round((count / appsToAnalyze.length) * 100));
      }
      
      if (failCount > 0) {
        toast.warning(`Analysis finished: ${successCount} succeeded, ${failCount} failed (likely missing files).`);
      } else if (successCount > 0) {
        toast.success('AI Analysis complete!');
      }

      if (sortOption === '-atsScore') {
        fetchApplications();
      } else {
        setSortOption('-atsScore');
      }
    } catch (error) {
      toast.error('An unexpected error occurred during bulk analysis.');
    } finally {
      setAnalyzingAll(false);
      setAnalysisProgress(0);
    }
  };

  // Pipeline Summary metrics
  const [pipelineMetrics, setPipelineMetrics] = useState({
    total: 0,
    applied: 0,
    underReview: 0,
    shortlisted: 0,
    interviewing: 0,
    selected: 0,
    rejected: 0
  });

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const jobRes = await api.get(`/jobs/${id}`);
      setJobTitle(jobRes.data.data.title);

      let url = `/applications/job/${id}?sort=${sortOption}`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const appRes = await api.get(url);
      setApplications(appRes.data.data);
      
      // Calculate metrics based on ALL applications if no filters applied, or just compute dynamically.
      // For simplicity, compute dynamically based on current fetched data if not server-paginated.
      if (!searchTerm && !statusFilter) {
        const metrics = {
          total: appRes.data.data.length,
          applied: 0, underReview: 0, shortlisted: 0, interviewing: 0, selected: 0, rejected: 0
        };
        appRes.data.data.forEach(app => {
          if (app.status === 'Applied') metrics.applied++;
          else if (app.status === 'Under Review') metrics.underReview++;
          else if (app.status === 'Shortlisted') metrics.shortlisted++;
          else if (['Interview Scheduled', 'Interview Completed', 'Interviewing'].includes(app.status)) metrics.interviewing++;
          else if (['Selected', 'Hired'].includes(app.status)) metrics.selected++;
          else if (app.status === 'Rejected') metrics.rejected++;
        });
        setPipelineMetrics(metrics);
      }
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const delayDebounceFn = setTimeout(() => {
      fetchApplications();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [id, searchTerm, statusFilter, sortOption]);

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedApps.length === 0) return;
    
    let feedback = '';
    if (newStatus === 'Rejected') {
      feedback = window.prompt(`Are you sure you want to reject ${selectedApps.length} applicants? If so, please provide a rejection reason (this will be emailed to them):`);
      if (feedback === null) return;
    } else if (newStatus === 'Selected') {
      feedback = window.prompt(`Are you sure you want to select ${selectedApps.length} applicants? If so, please provide an optional congratulatory message or next steps:`);
      if (feedback === null) return;
    }

    try {
      await api.put(`/applications/bulk-status`, { applicationIds: selectedApps, status: newStatus, feedback });
      toast.success(`${selectedApps.length} applications marked as ${newStatus}`);
      setSelectedApps([]);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update applications');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedApps(applications.map(app => app._id));
    } else {
      setSelectedApps([]);
    }
  };

  const handleSelect = (appId) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(selectedApps.filter(id => id !== appId));
    } else {
      setSelectedApps([...selectedApps, appId]);
    }
  };

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

  return (
    <main className="relative pt-20 bg-background min-h-screen pb-24">
      <div className="flex flex-col w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10 gap-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <Link to="/employer-dashboard" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 w-fit mb-2 text-sm">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Jobs
            </Link>
            <h1 className="text-3xl font-display-lg text-on-background tracking-tight">{jobTitle || 'Applicants'}</h1>
          </div>
        </header>

        {/* Pipeline Summary */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-surface-container rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center text-center shadow-md">
            <span className="text-3xl font-bold text-on-surface">{pipelineMetrics.total}</span>
            <span className="text-xs text-on-surface-variant uppercase mt-1">Total</span>
          </div>
          <div onClick={() => setStatusFilter('Applied')} className={`bg-surface-container rounded-2xl p-4 border flex flex-col items-center justify-center text-center shadow-md cursor-pointer transition-all ${statusFilter === 'Applied' ? 'border-primary/50 bg-primary/5' : 'border-white/5 hover:border-white/20'}`}>
            <span className="text-3xl font-bold text-on-surface-variant">{pipelineMetrics.applied}</span>
            <span className="text-xs text-on-surface-variant uppercase mt-1">Applied</span>
          </div>
          <div onClick={() => setStatusFilter('Under Review')} className={`bg-surface-container rounded-2xl p-4 border flex flex-col items-center justify-center text-center shadow-md cursor-pointer transition-all ${statusFilter === 'Under Review' ? 'border-inverse-primary/50 bg-inverse-primary/5' : 'border-white/5 hover:border-white/20'}`}>
            <span className="text-3xl font-bold text-inverse-primary">{pipelineMetrics.underReview}</span>
            <span className="text-xs text-inverse-primary uppercase mt-1">Review</span>
          </div>
          <div onClick={() => setStatusFilter('Shortlisted')} className={`bg-surface-container rounded-2xl p-4 border flex flex-col items-center justify-center text-center shadow-md cursor-pointer transition-all ${statusFilter === 'Shortlisted' ? 'border-tertiary/50 bg-tertiary/5' : 'border-white/5 hover:border-white/20'}`}>
            <span className="text-3xl font-bold text-tertiary">{pipelineMetrics.shortlisted}</span>
            <span className="text-xs text-tertiary uppercase mt-1">Shortlisted</span>
          </div>
          <div onClick={() => setStatusFilter('Interview Scheduled')} className={`bg-surface-container rounded-2xl p-4 border flex flex-col items-center justify-center text-center shadow-md cursor-pointer transition-all ${statusFilter === 'Interview Scheduled' ? 'border-secondary/50 bg-secondary/5' : 'border-white/5 hover:border-white/20'}`}>
            <span className="text-3xl font-bold text-secondary">{pipelineMetrics.interviewing}</span>
            <span className="text-xs text-secondary uppercase mt-1">Interview</span>
          </div>
          <div onClick={() => setStatusFilter('Selected')} className={`bg-surface-container rounded-2xl p-4 border flex flex-col items-center justify-center text-center shadow-md cursor-pointer transition-all ${statusFilter === 'Selected' ? 'border-primary/50 bg-primary/5' : 'border-white/5 hover:border-white/20'}`}>
            <span className="text-3xl font-bold text-primary">{pipelineMetrics.selected}</span>
            <span className="text-xs text-primary uppercase mt-1">Selected</span>
          </div>
        </div>

        {/* ATS Controls: Search, Filter, Sort, Bulk */}
        <div className="bg-surface-container-high rounded-2xl p-4 border border-white/5 shadow-lg flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                placeholder="Search by name, email, or skills..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-container-highest text-on-surface rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 transition-all text-sm"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 text-sm appearance-none cursor-pointer w-full sm:w-auto"
              >
                <option value="">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Interview Completed">Interview Completed</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 text-sm appearance-none cursor-pointer w-full sm:w-auto"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="-rating">Highest Rating</option>
                <option value="-atsScore">Highest ATS Score</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end border-t border-white/5 pt-4 mt-2 w-full">
            <button 
              onClick={handleAnalyzeAll} 
              disabled={analyzingAll || applications.length === 0}
              className="bg-tertiary text-on-tertiary hover:bg-tertiary-fixed px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-tertiary/20 flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
            >
              {analyzingAll ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-on-tertiary border-t-transparent rounded-full"></span>
                  Analyzing... {analysisProgress}%
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">psychiatry</span>
                  AI Rank & Analyze
                </>
              )}
            </button>
          </div>

          {/* Bulk Actions Bar (Visible only when items selected) */}
          {selectedApps.length > 0 && (
            <div className="bg-primary-container/20 border border-primary/20 rounded-xl p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 animate-in fade-in slide-in-from-top-4 mt-2 md:mt-0">
              <span className="text-primary font-medium text-sm flex items-center gap-2">
                <span className="material-symbols-outlined">check_box</span>
                {selectedApps.length} applicant{selectedApps.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button onClick={() => handleBulkStatusUpdate('Under Review')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-inverse-primary/20 text-inverse-primary hover:bg-inverse-primary/30 transition-colors flex-1 sm:flex-none">Review</button>
                <button onClick={() => handleBulkStatusUpdate('Shortlisted')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-tertiary/20 text-tertiary hover:bg-tertiary/30 transition-colors flex-1 sm:flex-none">Shortlist</button>
                <button onClick={() => handleBulkStatusUpdate('Rejected')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-error/20 text-error hover:bg-error/30 transition-colors flex-1 sm:flex-none">Reject</button>
              </div>
            </div>
          )}
        </div>

        {/* Content: Applicant Stack */}
        <div className="flex flex-col gap-4 w-full">
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
             </div>
          ) : applications.length === 0 ? (
            <div className="bg-surface-container-low rounded-2xl p-16 text-center border border-white/5 shadow-md flex flex-col items-center">
              <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-4 opacity-50">search_off</span>
              <h3 className="text-xl font-headline-md text-on-surface mb-2">No applicants found</h3>
              <p className="text-sm text-on-surface-variant">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              {/* Select All Checkbox Header */}
              <div className="px-6 flex items-center gap-4 text-on-surface-variant text-sm border-b border-white/5 pb-2">
                <input 
                  type="checkbox" 
                  checked={selectedApps.length === applications.length && applications.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-outline bg-surface-container-highest checked:bg-primary accent-primary cursor-pointer"
                />
                <span>Select All</span>
              </div>
              
              {applications.map((app) => (
                <article key={app._id} className={`bg-surface-container-low rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border ${selectedApps.includes(app._id) ? 'border-primary/50 bg-primary/5' : 'border-white/5 hover:border-white/20'}`}>
                  
                  <div className="flex flex-row gap-3 md:gap-4 items-start md:items-center flex-grow w-full md:w-auto">
                    {/* Select Checkbox */}
                    <div className="flex items-center mt-1 md:mt-0">
                      <input 
                        type="checkbox" 
                        checked={selectedApps.includes(app._id)}
                        onChange={() => handleSelect(app._id)}
                        className="w-4 h-4 rounded border-outline bg-surface-container-highest checked:bg-primary accent-primary cursor-pointer"
                      />
                    </div>
                    
                    <div className="flex-shrink-0">
                      {app.profile?.personalInfo?.profilePhoto ? (
                        <img src={getMediaUrl(app.profile.personalInfo.profilePhoto)} alt={app.applicant?.name || 'Unknown'} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shadow-md bg-surface-container-highest border border-white/10" />
                      ) : (
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface-container-highest flex items-center justify-center shadow-md border border-white/10">
                          <span className="material-symbols-outlined text-[24px] md:text-[32px] text-on-surface-variant">person</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow flex flex-col justify-center gap-1 md:gap-2 relative z-10 min-w-0">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                        <div className="truncate w-full md:w-auto">
                          <h2 className="text-base md:text-lg font-bold text-on-surface truncate flex flex-wrap items-center gap-2">
                            {app.applicant?.name || 'Unknown User'}
                            {app.rating > 0 && (
                              <span className="flex text-tertiary text-[12px]"><span className="material-symbols-outlined text-[14px]">star</span> {app.rating}/5</span>
                            )}
                            {app.atsScore !== undefined && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${app.atsScore >= 75 ? 'bg-primary-container text-primary' : app.atsScore >= 50 ? 'bg-secondary-container text-secondary' : 'bg-error-container text-error'}`}>
                                ATS: {app.atsScore}%
                              </span>
                            )}
                          </h2>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] md:text-xs text-on-surface-variant">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">mail</span> {app.applicant?.email || 'N/A'}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> {new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center w-full md:w-auto">
                          {getStatusBadge(app.status)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-1 hidden sm:flex">
                        {app.profile?.skills && (
                          <>
                            {app.profile.skills.programmingLanguages?.slice(0, 3).map((s, i) => (
                              <span key={`p-${i}`} className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded text-[11px] border border-white/5">{s.name}</span>
                            ))}
                          </>
                        )}
                        {app.profile?.skills?.programmingLanguages?.length > 3 && (
                          <span className="text-on-surface-variant text-[11px] px-1 py-0.5">+{app.profile.skills.programmingLanguages.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Skills - Visible only on very small screens */}
                  <div className="flex flex-wrap gap-2 mt-2 sm:hidden pl-[3.25rem]">
                    {app.profile?.skills && (
                      <>
                        {app.profile.skills.programmingLanguages?.slice(0, 2).map((s, i) => (
                          <span key={`p-mob-${i}`} className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded text-[10px] border border-white/5">{s.name}</span>
                        ))}
                      </>
                    )}
                    {app.profile?.skills?.programmingLanguages?.length > 2 && (
                      <span className="text-on-surface-variant text-[10px] px-1 py-0.5">+{app.profile.skills.programmingLanguages.length - 2} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-6 shrink-0 mt-2 md:mt-0 w-full md:w-auto">
                    <Link 
                      to={`/employer/applications/${app._id}`}
                      className="bg-primary text-on-primary hover:bg-primary-fixed px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                      <span className="material-symbols-outlined text-[18px]">account_circle</span>
                      View Profile
                    </Link>
                  </div>
                </article>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default JobApplicants;

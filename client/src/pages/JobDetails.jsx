import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../services/api';
import { getMediaUrl } from '../utils/formatUrl';
import LoadingScreen from '../components/LoadingScreen';


const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [resumeOption, setResumeOption] = useState('default'); // 'default' | 'upload'
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data.data);
      } catch (error) {
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (isAuthenticated && user && user.role !== 'employer' && user.role !== 'admin') {
        try {
          const response = await api.get('/applications/me');
          const applications = response.data.data;
          const applied = applications.some(app => 
            (app.job?._id || app.job).toString() === id
          );
          setHasApplied(applied);
        } catch (err) {
          console.error('Failed to fetch applications', err);
        }
      }
    };

    checkApplicationStatus();
  }, [id, isAuthenticated, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    
    try {
      if (resumeOption === 'upload' && resumeFile) {
        const formData = new FormData();
        formData.append('coverLetter', coverLetter);
        formData.append('resume', resumeFile);
        await api.post(`/applications/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post(`/applications/${id}`, { coverLetter });
      }
      
      toast.success('Successfully applied for this job!');
      setShowApplyModal(false);
      setCoverLetter('');
      setResumeFile(null);
      setResumeOption('default');
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply for the job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    <LoadingScreen isLoading={true} />
  }

  if (!job) return null;

  const isEmployer = user?.role === 'employer';
  const isAdmin = user?.role === 'admin';
  const canApply = isAuthenticated && !isEmployer && !isAdmin;

  const locationStr = job.location?.city || job.location?.country ? `${job.location?.city || ''}${job.location?.city && job.location?.country ? ', ' : ''}${job.location?.country || ''}` : 'Location Not Specified';
  const salaryStr = job.salaryRange && (job.salaryRange.min || job.salaryRange.max) ? `${job.salaryRange.min || ''} ${job.salaryRange.min && job.salaryRange.max ? '-' : ''} ${job.salaryRange.max || ''} ${job.salaryRange.currency || 'INR'}` : 'Not Disclosed';

  return (
    <main className="pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen transform translate-x-1/3 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[100px] mix-blend-screen transform -translate-x-1/4 translate-y-1/4"></div>
        </div>

        <div className="max-w-container-max mx-auto w-full px-4 md:px-margin-desktop py-8 md:py-margin-desktop relative z-10">
          <Link to="/jobs" className="inline-flex items-center text-on-surface-variant hover:text-primary mb-6 transition-colors font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] mr-1">chevron_left</span> Back to Jobs
          </Link>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-gutter mb-8 md:mb-margin-desktop">
            <div className="flex flex-col gap-base md:w-2/3 relative z-10">
              <div 
                className="flex items-center gap-base cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowCompanyModal(true)}
              >
                <div className="w-16 h-16 rounded-lg bg-surface-container-high flex items-center justify-center shadow-lg overflow-hidden shrink-0 border border-white/5">
                  {job.company?.logo && job.company.logo !== 'default-company-logo.png' ? (
                    <img src={getMediaUrl(job.company.logo)} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[32px] text-on-surface-variant">domain</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider flex items-center gap-1">
                    {job.company?.name || 'Company Name'}
                    {job.company?.isVerified && (
                      <span className="material-symbols-outlined text-green-500 text-[14px]" title="Verified Company">verified</span>
                    )}
                  </span>
                  <h1 className="font-display-lg text-display-lg text-on-background mt-1">{job.title}</h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm shadow-sm border border-white/5">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>{locationStr}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm shadow-sm border border-white/5">
                  <span className="material-symbols-outlined text-[16px]">work</span>
                  <span>{job.employmentType}</span>
                </div>
                {job.workMode && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm shadow-sm border border-white/5">
                    <span className="material-symbols-outlined text-[16px]">home_work</span>
                    <span>{job.workMode}</span>
                  </div>
                )}
                {job.experienceRequired && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm shadow-sm border border-white/5">
                    <span className="material-symbols-outlined text-[16px]">history</span>
                    <span>{job.experienceRequired} Exp.</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm shadow-sm border border-white/5">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span>{salaryStr}</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/3 flex flex-col md:items-end items-start mt-6 md:mt-0 relative z-20 gap-3">
              {canApply ? (
                hasApplied ? (
                  <button 
                    disabled
                    className="group relative flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 rounded-xl bg-surface-container-highest text-primary font-headline-md text-headline-md shadow-inner border border-white/5 cursor-not-allowed opacity-75"
                  >
                    <span className="material-symbols-outlined relative z-10 text-[20px]">check_circle</span>
                    <span className="relative z-10">Applied</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowApplyModal(true)}
                    className="group relative flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-headline-md text-headline-md shadow-[0_0_30px_rgba(173,198,255,0.2)] hover:shadow-[0_0_40px_rgba(173,198,255,0.4)] transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10">Apply Now</span>
                    <span className="material-symbols-outlined relative z-10 transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                )
              ) : !isAuthenticated ? (
                <Link 
                  to="/login"
                  className="w-full md:w-auto bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm py-4 px-8 rounded-xl shadow-sm transition-colors text-center border border-white/10"
                >
                  Log in to Apply
                </Link>
              ) : (isEmployer && job.employer === user._id) ? (
                 <Link 
                  to={`/employer/jobs/${job._id}/applicants`}
                  className="w-full md:w-auto bg-tertiary-container hover:bg-tertiary text-on-tertiary-container hover:text-on-tertiary font-label-sm text-label-sm py-4 px-8 rounded-xl shadow-sm transition-colors text-center"
                >
                  View Applicants
                </Link>
              ) : null}

              <div className="text-center text-sm text-on-surface-variant flex items-center justify-center gap-1.5 md:mr-2">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span> 
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter relative z-10">
            {/* Left Column: Description */}
            <div className="lg:col-span-8 flex flex-col gap-6 md:gap-margin-desktop">
              <section className="p-8 rounded-2xl bg-surface-container shadow-xl relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl group-hover:bg-primary/20 transition-colors duration-700"></div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Job Description
                </h2>
                <div className="font-body-md text-body-md text-on-surface-variant space-y-4 whitespace-pre-line">
                  {job.description}
                </div>
              </section>

              <section className="p-8 rounded-2xl bg-surface-container shadow-xl border border-white/5">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">check_circle</span>
                  Key Responsibilities
                </h2>
                <div className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line p-4 rounded-xl bg-surface-container-highest/50">
                  {job.responsibilities}
                </div>
              </section>

              <section className="p-8 rounded-2xl bg-surface-container shadow-xl border border-white/5">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">school</span>
                  Qualifications
                </h2>
                <div className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line p-4 rounded-xl bg-surface-container-highest/50">
                  {job.qualifications}
                </div>
              </section>
            </div>

            {/* Right Column: Skills & Meta */}
            <div className="lg:col-span-4 flex flex-col gap-gutter">
              <div className="p-6 rounded-2xl bg-surface-container shadow-xl border border-white/5">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">bolt</span>
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired?.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-sm text-label-sm shadow-sm hover:bg-primary/20 hover:text-primary transition-colors cursor-default border border-white/5">
                      {skill}
                    </span>
                  ))}
                  {(!job.skillsRequired || job.skillsRequired.length === 0) && (
                    <span className="text-on-surface-variant text-sm italic">Not specified</span>
                  )}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface-container shadow-xl relative overflow-hidden border border-white/5">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Job Overview</h3>
                <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant relative z-10">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-on-surface-variant">Posted on:</span>
                    <span className="font-medium text-on-surface">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-on-surface-variant">Vacancies:</span>
                    <span className="font-medium text-on-surface">{job.vacancies} Position(s)</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-on-surface-variant">Category:</span>
                    <span className="font-medium text-on-surface">{job.category}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowApplyModal(false)}></div>
            
            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-surface-container rounded-2xl shadow-2xl overflow-hidden border border-white/10 z-10">
              
              {/* Modal Header */}
              <div className="p-6 bg-surface-container-highest flex justify-between items-center shadow-sm relative z-10 border-b border-white/5">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Submit Application</h2>
                  <p className="font-label-sm text-label-sm text-tertiary mt-1">{job.title} • {job.company?.name}</p>
                </div>
                <button onClick={() => setShowApplyModal(false)} className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors shadow-sm">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleApply} className="flex flex-col">
                <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  
                  {/* Resume Selection Area */}
                  <div className="space-y-4">
                    <label className="font-label-sm text-label-sm text-on-surface-variant block">Select Resume</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Default Resume Option */}
                      <label 
                        className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${resumeOption === 'default' ? 'border-primary bg-primary/5' : 'border-white/10 bg-surface-container hover:bg-surface-container-high'}`}
                      >
                        <input type="radio" name="resumeOption" value="default" className="hidden" checked={resumeOption === 'default'} onChange={() => setResumeOption('default')} />
                        <span className={`material-symbols-outlined text-[32px] ${resumeOption === 'default' ? 'text-primary' : 'text-on-surface-variant'}`}>account_box</span>
                        <div className="text-center">
                          <h4 className="font-headline-sm text-on-surface text-sm">Profile Resume</h4>
                          <p className="text-xs text-on-surface-variant mt-1">Use the resume saved in your profile.</p>
                        </div>
                        {resumeOption === 'default' && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px] text-on-primary">check</span>
                          </div>
                        )}
                      </label>
                      
                      {/* Upload Resume Option */}
                      <label 
                        className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${resumeOption === 'upload' ? 'border-primary bg-primary/5' : 'border-white/10 bg-surface-container hover:bg-surface-container-high'}`}
                      >
                        <input type="radio" name="resumeOption" value="upload" className="hidden" checked={resumeOption === 'upload'} onChange={() => setResumeOption('upload')} />
                        <span className={`material-symbols-outlined text-[32px] ${resumeOption === 'upload' ? 'text-primary' : 'text-on-surface-variant'}`}>upload_file</span>
                        <div className="text-center">
                          <h4 className="font-headline-sm text-on-surface text-sm">Upload New Resume</h4>
                          <p className="text-xs text-on-surface-variant mt-1">Upload a custom resume for this job.</p>
                        </div>
                        {resumeOption === 'upload' && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px] text-on-primary">check</span>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* File Input for Upload Option */}
                    {resumeOption === 'upload' && (
                      <div className="mt-4 p-4 border border-dashed border-white/20 rounded-xl bg-surface-container-low flex flex-col items-center justify-center">
                        <input 
                          type="file" 
                          id="resumeFile" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setResumeFile(e.target.files[0])}
                        />
                        <label htmlFor="resumeFile" className="cursor-pointer flex flex-col items-center gap-2 text-center w-full">
                          {resumeFile ? (
                            <div className="flex items-center gap-3 bg-surface-container-highest px-4 py-2 rounded-lg w-full">
                              <span className="material-symbols-outlined text-tertiary">description</span>
                              <span className="font-body-sm text-sm text-on-surface truncate flex-1">{resumeFile.name}</span>
                              <button type="button" onClick={(e) => { e.preventDefault(); setResumeFile(null); }} className="text-error hover:text-error-fixed">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[32px] text-primary">cloud_upload</span>
                              <div>
                                <span className="text-primary font-semibold hover:underline">Click to upload</span>
                                <span className="text-on-surface-variant text-sm ml-1">or drag and drop</span>
                              </div>
                              <p className="text-xs text-on-surface-variant/70">PDF, DOC, DOCX (Max 5MB)</p>
                            </>
                          )}
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter Area */}
                  <div className="space-y-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant block">Cover Letter (Optional)</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-primary/10 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                      <textarea 
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full relative z-10 bg-surface-container-highest text-on-surface font-body-md p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary placeholder-on-surface-variant/50 resize-y shadow-inner border border-white/5" 
                        placeholder="Why are you a great fit for this role? Share your experience..." 
                        rows="5"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-surface-container-highest flex justify-end gap-4 shadow-[0_-4px_15px_rgba(0,0,0,0.1)] relative z-10 border-t border-white/5">
                  <button type="button" onClick={() => setShowApplyModal(false)} className="px-6 py-3 rounded-xl bg-transparent text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container hover:text-on-surface transition-colors border border-transparent">
                    Cancel
                  </button>
                  <button type="submit" disabled={applying} className={`px-8 py-3 rounded-xl font-label-sm text-label-sm transition-colors flex items-center justify-center min-w-[200px] ${applying ? 'bg-surface-container-low text-on-surface-variant/50 cursor-not-allowed shadow-inner' : 'bg-primary text-on-primary-fixed hover:bg-primary-fixed shadow-sm'}`}>
                    {applying ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Company Details Modal */}
        {showCompanyModal && job.company && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-surface-container rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10 z-10">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-surface-container-highest">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden border border-white/5">
                    {job.company.logo && job.company.logo !== 'default-company-logo.png' ? (
                      <img src={getMediaUrl(job.company.logo)} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant">domain</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-display-sm text-on-surface flex items-center gap-2">
                    {job.company.name}
                    {job.company.isVerified && (
                      <span className="material-symbols-outlined text-green-500 text-[20px]" title="Verified Company">verified</span>
                    )}
                  </h2>
                </div>
                <button onClick={() => setShowCompanyModal(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-label-md text-on-surface-variant mb-1">Industry</p>
                    <p className="text-on-surface font-medium">{job.company.industry || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-label-md text-on-surface-variant mb-1">Company Size</p>
                    <p className="text-on-surface font-medium">{job.company.size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-label-md text-on-surface-variant mb-1">Website</p>
                    {job.company.website ? (
                      <a href={job.company.website} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                        {job.company.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <p className="text-on-surface font-medium">N/A</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-label-md text-on-surface-variant mb-1">Headquarters</p>
                    <p className="text-on-surface">
                      {[job.company.location?.address, job.company.location?.city, job.company.location?.state, job.company.location?.country].filter(Boolean).join(', ') || 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-label-md text-on-surface-variant mb-2">About the Company</p>
                    <p className="text-on-surface mt-1 whitespace-pre-line leading-relaxed text-body-md">
                      {job.company.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-label-md text-on-surface-variant mb-3">Social Profiles</p>
                    <div className="flex gap-4">
                      {job.company.socialLinks?.linkedin && (
                        <a href={job.company.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-[#0077b5] transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined">link</span> LinkedIn
                        </a>
                      )}
                      {job.company.socialLinks?.twitter && (
                        <a href={job.company.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-[#1DA1F2] transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined">link</span> Twitter
                        </a>
                      )}
                      {job.company.socialLinks?.facebook && (
                        <a href={job.company.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-[#4267B2] transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined">link</span> Facebook
                        </a>
                      )}
                      {!job.company.socialLinks?.linkedin && !job.company.socialLinks?.twitter && !job.company.socialLinks?.facebook && (
                        <span className="text-on-surface-variant text-sm italic">No social links provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-white/10 flex justify-end bg-surface-container-highest">
                <button 
                  onClick={() => setShowCompanyModal(false)}
                  className="px-6 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors border border-white/10"
                >
                  Close
                </button>
              </div>
            </div>
            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={() => setShowCompanyModal(false)}></div>
          </div>
        )}

      </div>
    </main>
  );
};

export default JobDetails;

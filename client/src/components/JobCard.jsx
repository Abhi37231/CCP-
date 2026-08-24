import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSaveJob } from '../redux/slices/profileSlice';
import api from '../services/api';
import { toast } from 'react-toastify';

const JobCard = ({ job, applicationId, applicationStatus, onWithdraw }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  
  if (!job) {
    return (
      <article className="group bg-surface-container rounded-xl p-6 border border-error/20 flex flex-col items-center justify-center gap-4 text-center">
        <span className="material-symbols-outlined text-[48px] text-error/50">work_off</span>
        <div>
          <h3 className="font-headline-md text-on-surface mb-1">Job Unavailable</h3>
          <p className="text-body-md text-on-surface-variant">This job has been removed or is no longer available.</p>
        </div>
        {applicationId && (
          <button 
            onClick={onWithdraw}
            className="px-4 py-2 mt-2 rounded-lg bg-error-container/10 text-error font-label-sm hover:bg-error-container hover:text-on-error-container transition-colors shadow-sm flex items-center gap-2 border border-error/20"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            Remove Application
          </button>
        )}
      </article>
    );
  }

  const isOwner = user?.role === 'employer' && (user?._id === job.employer || user?.id === job.employer);
  const isSaved = profile?.savedJobs?.includes(job._id);
  
  const formattedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown';
  const location = job.location?.city || job.location?.country ? `${job.location?.city || ''}${job.location?.city && job.location?.country ? ', ' : ''}${job.location?.country || ''}` : 'Location Not Specified';

  const handleToggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Please log in to save jobs');
      return;
    }
    dispatch(toggleSaveJob(job._id))
      .unwrap()
      .then(() => toast.success(isSaved ? 'Job removed from saved list' : 'Job saved successfully'))
      .catch((err) => toast.error(err || 'Failed to save job'));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await api.delete(`/jobs/${job._id}`);
        toast.success('Job deleted successfully');
        window.location.reload();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete job');
        console.error(error);
      }
    }
  };

  return (
    <article className="group bg-surface-container hover:bg-surface-container-high rounded-xl p-6 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 border border-white/5">
      <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none group-hover:border-primary/30 transition-colors duration-500 shadow-[inset_0_0_20px_transparent] group-hover:shadow-[inset_0_0_20px_rgba(173,198,255,0.05)]"></div>
      
      <div className="flex flex-col sm:flex-row gap-6 relative z-10">
        <div className="w-16 h-16 rounded-lg bg-surface-container-highest flex-shrink-0 flex items-center justify-center p-2 border border-white/10 overflow-hidden">
          {job.company?.logo && job.company.logo !== 'default-company-logo.png' ? (
            <img src={`http://localhost:5000${job.company.logo}`} alt={job.company.name} className="w-full h-full object-cover rounded" />
          ) : (
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">domain</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1 group-hover:text-primary transition-colors truncate">{job.title}</h3>
              <div className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant flex-wrap">
                <span className="text-inverse-primary font-semibold">{job.company?.name || 'Company Name'}</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span>{location}</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-label-sm font-label-sm">Posted {formattedDate}</span>
              </div>
              {applicationStatus && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm border border-white/5">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">history</span>
                  Status: <span className="font-medium text-on-surface">{applicationStatus}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
              {isOwner ? (
                <>
                  <Link to={`/employer/jobs/${job._id}/edit`} className="px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface font-label-sm text-label-sm hover:bg-primary-container/20 hover:text-primary transition-colors shadow-sm flex items-center gap-2 border border-white/5 whitespace-nowrap">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit
                  </Link>
                  <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-error-container/10 text-error font-label-sm text-label-sm hover:bg-error-container hover:text-on-error-container transition-colors shadow-sm flex items-center gap-2 border border-error/20 whitespace-nowrap">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete
                  </button>
                  <Link to={`/employer/jobs/${job._id}/applicants`} className="px-4 py-2 rounded-lg bg-secondary-container/20 text-secondary font-label-sm text-label-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap">
                    <span className="material-symbols-outlined text-[18px]">group</span>
                    Applicants
                  </Link>
                </>
              ) : applicationId ? (
                <button 
                  onClick={onWithdraw}
                  className="px-4 py-2 rounded-lg bg-error-container/10 text-error font-label-sm text-label-sm hover:bg-error-container hover:text-on-error-container transition-colors shadow-sm flex items-center gap-2 border border-error/20 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  Withdraw
                </button>
              ) : (
                <button 
                  onClick={handleToggleSave}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${isSaved ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20' : 'bg-surface-container-highest text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 border-white/5 hover:border-tertiary/30'}`}
                  title={isSaved ? "Remove from saved" : "Save job"}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                    {isSaved ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              )}
              {!isOwner && (
                <Link 
                  to="/ats-analyzer" 
                  state={{ jobDescription: `Job Title: ${job.title}\nCompany: ${job.company?.name || ''}\n\nDescription:\n${job.description || ''}\n\nRequirements:\n${job.requirements || ''}\n\nSkills Required: ${job.skillsRequired?.join(', ') || ''}` }}
                  className="px-4 py-2 rounded-lg bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm hover:bg-tertiary-container hover:text-on-tertiary-container transition-colors shadow-sm flex items-center gap-2 border border-tertiary/20 whitespace-nowrap"
                  title="Check ATS Match"
                >
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  Check Fit
                </Link>
              )}
              <Link to={`/jobs/${job._id}`} className="px-6 py-2 rounded-lg bg-surface-container-highest text-on-surface font-label-sm text-label-sm group-hover:bg-primary group-hover:text-on-primary transition-colors shadow-sm border border-white/5 border-transparent whitespace-nowrap">
                {isOwner ? 'View Job' : 'Details'}
              </Link>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 border border-white/5">
              <span className="material-symbols-outlined text-[14px] text-tertiary">work</span> 
              {job.employmentType || 'Full-time'}
            </span>
            <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 border border-white/5">
              <span className="material-symbols-outlined text-[14px] text-tertiary">home_work</span> 
              {job.workMode || 'Remote'}
            </span>
            {job.experienceRequired && (
              <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 border border-white/5">
                <span className="material-symbols-outlined text-[14px] text-tertiary">history</span> 
                {job.experienceRequired}
              </span>
            )}
            {job.salaryRange && (job.salaryRange.min || job.salaryRange.max) && (
              <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 border border-white/5">
                <span className="material-symbols-outlined text-[14px] text-secondary">payments</span> 
                {job.salaryRange.min || ''} {job.salaryRange.min && job.salaryRange.max ? '-' : ''} {job.salaryRange.max || ''} {job.salaryRange.currency || 'INR'}
              </span>
            )}
          </div>
          
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
              {job.skillsRequired.slice(0, 4).map((skill, index) => (
                <span key={index} className="text-on-surface-variant text-xs flex items-center before:content-['•'] before:mr-1 before:text-primary before:font-bold">
                  {skill}
                </span>
              ))}
              {job.skillsRequired.length > 4 && (
                <span className="text-on-surface-variant text-xs italic">
                  +{job.skillsRequired.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default JobCard;

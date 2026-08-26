import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getMediaUrl } from '../utils/formatUrl';

const MyApplications = () => {
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

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
    <div className="flex flex-col w-full p-4 md:p-margin-desktop max-w-container-max mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-display-md text-display-md text-on-surface">My Applications</h1>
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
            <div key={app._id} className="bg-surface-container-low rounded-2xl p-6 border border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between relative overflow-hidden">
              {app.status === 'Interview Scheduled' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
              )}
              <div className="flex gap-6 items-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                  {app.job?.company?.logo ? (
                    <img src={getMediaUrl(app.job.company.logo)} alt={app.job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant text-2xl">business</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-on-surface text-xl">{app.job?.title || 'Unknown Job'}</h3>
                  <span className="text-on-surface-variant">{app.job?.company?.name || 'Unknown Company'}</span>
                  <span className="text-sm text-on-surface-variant opacity-70 mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                  <Link to={`/jobs/${app.job?._id}`} className="mt-2 text-primary hover:underline text-sm flex items-center gap-1">
                    View Job Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 shrink-0">
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
  );
};

export default MyApplications;

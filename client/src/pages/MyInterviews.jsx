import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getMediaUrl } from '../utils/formatUrl';

const MyInterviews = () => {
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

  const interviews = myApplications.filter(app => ['Interview Scheduled', 'Interview Completed', 'Interviewing'].includes(app.status));

  return (
    <div className="flex flex-col w-full p-4 md:p-margin-desktop max-w-container-max mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-display-md text-display-md text-on-surface">My Interviews</h1>
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
        ) : interviews.length > 0 ? (
          interviews.map(app => (
            <div key={app._id} className="bg-surface-container-low rounded-2xl p-6 border border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
              
              <div className="flex gap-6 items-start">
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
                  <Link to={`/jobs/${app.job?._id}`} className="mt-2 text-primary hover:underline text-sm flex items-center gap-1">
                    View Job Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {app.interview && app.interview.date && (
                <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-5 flex flex-col gap-3 w-full md:max-w-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary text-sm font-bold uppercase flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">event_available</span> 
                      {app.status}
                    </span>
                    <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs text-on-surface-variant">
                      {app.interview.type}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-on-surface text-lg font-medium">
                      {new Date(app.interview.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      {app.interview.time} ({app.interview.duration} mins)
                    </span>
                  </div>

                  <div className="mt-2 pt-3 border-t border-secondary/10 flex flex-col gap-2">
                    {app.interview.link && app.interview.type === 'Online' && (
                      <a href={app.interview.link} target="_blank" rel="noreferrer" className="bg-secondary text-on-secondary hover:bg-secondary-fixed py-2 px-4 rounded-lg text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 w-full">
                        <span className="material-symbols-outlined text-[18px]">video_camera_front</span> Join Meeting
                      </a>
                    )}
                    {app.interview.location && app.interview.type === 'Offline' && (
                      <span className="text-on-surface text-sm flex items-start gap-2 bg-surface-container-low p-3 rounded-lg border border-white/5">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant mt-0.5">location_on</span>
                        <span>{app.interview.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant border border-white/5">
            You don't have any interviews scheduled yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInterviews;

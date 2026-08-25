import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { getMediaUrl } from '../utils/formatUrl';

const EmployerInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const res = await api.get('/applications/employer/interviews');
      setInterviews(res.data.data);
    } catch (error) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <main className="pt-20 bg-background min-h-screen">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  // Group interviews by Date
  const groupedInterviews = interviews.reduce((acc, app) => {
    const date = app.interview?.date ? new Date(app.interview.date).toLocaleDateString('en-GB') : 'Unscheduled / Pending Details';
    if (!acc[date]) acc[date] = [];
    acc[date].push(app);
    return acc;
  }, {});

  const formatTime12hr = (time24) => {
    if (!time24) return 'Time TBD';
    const [hours, minutes] = time24.split(':');
    if (!hours || !minutes) return time24;
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <main className="pt-20 bg-background min-h-screen pb-24">
      <div className="flex flex-col w-full px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-background tracking-tight">Interview Schedule</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Manage your upcoming interviews and avoid scheduling conflicts.
            </p>
          </div>
          <Link to="/employer-dashboard" className="bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">dashboard</span> Dashboard
          </Link>
        </div>

        {interviews.length === 0 ? (
          <div className="bg-surface-container p-12 rounded-xl text-center border border-white/5">
            <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant">event_busy</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No Interviews Scheduled</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              You don't have any upcoming interviews. When you schedule an interview for a candidate, it will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {Object.keys(groupedInterviews).map(date => (
              <div key={date}>
                <h2 className="text-lg font-headline-sm text-secondary mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="material-symbols-outlined">calendar_today</span>
                  {date}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedInterviews[date].map(app => (
                    <div key={app._id} className="bg-surface-container-low rounded-2xl p-6 border border-white/5 shadow-sm hover:border-secondary/30 transition-colors flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant overflow-hidden">
                            {app.applicant?.avatar ? (
                              <img src={getMediaUrl(app.applicant.avatar)} alt={app.applicant.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined">person</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-headline-sm text-on-surface text-base m-0 leading-tight">{app.applicant?.name}</h4>
                            <p className="text-xs text-on-surface-variant">{app.job?.title}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                          app.status === 'Interview Completed' ? 'bg-primary-container/30 text-primary' : 'bg-secondary-container/30 text-secondary'
                        }`}>
                          {app.status === 'Interview Completed' ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-6 flex-grow">
                        {app.interview ? (
                          <>
                            <div className="flex items-center gap-2 text-sm text-on-surface">
                              <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                              <span className="font-medium">{formatTime12hr(app.interview.time)}</span>
                              <span className="text-on-surface-variant mx-1">•</span>
                              <span className="text-on-surface-variant text-xs">{app.interview.type || 'Type TBD'}</span>
                            </div>
                            
                            {app.interview.type === 'Online' && app.interview.link && (
                              <div className="flex items-center gap-2 text-sm text-on-surface-variant bg-surface-container p-2 rounded-lg mt-2">
                                <span className="material-symbols-outlined text-[16px]">link</span>
                                <a href={app.interview.link} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">Join Meeting</a>
                              </div>
                            )}
                            
                            {app.interview.type === 'Offline' && app.interview.location && (
                              <div className="flex items-center gap-2 text-sm text-on-surface-variant bg-surface-container p-2 rounded-lg mt-2">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                <span className="truncate">{app.interview.location}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-on-surface-variant bg-surface-container p-3 rounded-lg mt-2 italic">
                            <span className="material-symbols-outlined text-[18px]">info</span>
                            <span>Status updated to interview, but details have not been scheduled yet.</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
                        <Link 
                          to={`/employer/applications/${app._id}`}
                          className="flex-1 bg-surface-container-highest hover:bg-surface-container-high text-on-surface text-center py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Manage Candidate
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default EmployerInterviews;

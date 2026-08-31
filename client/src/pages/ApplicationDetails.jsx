import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { getMediaUrl } from '../utils/formatUrl';
import LoadingScreen from '../components/LoadingScreen';


const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recruiter Workspace State
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [rating, setRating] = useState(0);
  
  // Interview Scheduling State
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    duration: 30,
    breakTime: 0,
    type: 'Online',
    link: '',
    location: '',
    notes: ''
  });

  const fetchApplicationDetails = async () => {
    try {
      const res = await api.get(`/applications/${id}`);
      setApplication(res.data.data);
      setNotes(res.data.data.recruiterNotes || '');
      setRating(res.data.data.rating || 0);
    } catch (error) {
      toast.error('Failed to load application details');
      navigate('/employer-dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    let feedback = '';
    if (newStatus === 'Rejected') {
      feedback = window.prompt("Please provide a reason for rejection (this will be sent to the candidate in an email):");
      if (feedback === null) {
        // User cancelled, abort update
        return;
      }
    } else if (newStatus === 'Selected') {
      feedback = window.prompt("Please provide an optional congratulatory message or next steps for the selected candidate:");
      if (feedback === null) {
        return;
      }
    }

    try {
      await api.put(`/applications/${id}/status`, { status: newStatus, feedback });
      toast.success(`Status updated to ${newStatus}`);
      fetchApplicationDetails();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleNotesSave = async () => {
    setSavingNotes(true);
    try {
      await api.put(`/applications/${id}/notes`, { notes });
      toast.success('Notes saved successfully');
      fetchApplicationDetails();
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleRatingUpdate = async (newRating) => {
    try {
      await api.put(`/applications/${id}/rating`, { rating: newRating });
      setRating(newRating);
      toast.success('Rating updated');
    } catch (error) {
      toast.error('Failed to update rating');
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    
    const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    if (interviewForm.date === todayStr) {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      
      if (interviewForm.time < currentTime) {
        toast.error('Interview time cannot be in the past for today.');
        return;
      }
    }

    try {
      await api.put(`/applications/${id}/interview`, interviewForm);
      toast.success('Interview scheduled successfully');
      setShowInterviewModal(false);
      fetchApplicationDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
    }
  };

  if (loading || !application) {
    return <LoadingScreen isLoading={true} />;
  }

  const { profile, applicant, job } = application;

  const handleOpenInterviewModal = async () => {
    setShowInterviewModal(true);
    
    // If this application already has an interview date, don't overwrite it
    if (application.interview && application.interview.date) {
      setInterviewForm({
        date: new Date(application.interview.date).toISOString().split('T')[0],
        time: application.interview.time || '',
        duration: application.interview.duration || 30,
        breakTime: application.interview.breakTime || 0,
        type: application.interview.type || 'Online',
        link: application.interview.link || '',
        location: application.interview.location || '',
        notes: application.interview.notes || ''
      });
      return;
    }

    try {
      const res = await api.get('/applications/employer/interviews');
      const interviews = res.data.data;
      if (interviews && interviews.length > 0) {
        // Find the last valid interview
        const validInterviews = interviews.filter(app => app.interview && app.interview.date && app.interview.time);
        if (validInterviews.length > 0) {
          const latest = validInterviews[validInterviews.length - 1];
          
          // Calculate + duration + breakTime
          const dateObj = new Date(latest.interview.date);
          const [hours, minutes] = latest.interview.time.split(':').map(Number);
          
          const latestDuration = latest.interview.duration || 30;
          const latestBreak = latest.interview.breakTime || 0;
          const totalOffset = latestDuration + latestBreak;

          let newHours = hours;
          let newMinutes = minutes + totalOffset;
          
          while (newMinutes >= 60) {
            newHours += 1;
            newMinutes -= 60;
          }
          
          if (newHours >= 24) {
             newHours = 0;
             dateObj.setDate(dateObj.getDate() + 1);
          }
          
          const suggestedTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
          
          setInterviewForm({
            date: dateObj.toISOString().split('T')[0],
            time: suggestedTime,
            duration: 30, // Default for the new interview
            breakTime: 0,
            type: latest.interview.type || 'Online',
            link: latest.interview.link || '',
            location: latest.interview.location || '',
            notes: ''
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch suggested slot', error);
    }
  };

  const formatTime12hr = (time24) => {
    if (!time24) return 'Time TBD';
    const [hours, minutes] = time24.split(':');
    if (!hours || !minutes) return time24;
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Shortlisted': 
        return <span className="bg-tertiary-container/30 text-tertiary border border-tertiary/20 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[16px]">star</span> Shortlisted</span>;
      case 'Selected': 
      case 'Hired': 
        return <span className="bg-primary-container/30 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[16px]">verified</span> Selected</span>;
      case 'Rejected': 
        return <span className="bg-error-container/30 text-error border border-error/20 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[16px]">cancel</span> Rejected</span>;
      case 'Interview Scheduled':
      case 'Interview Completed':
      case 'Interviewing': 
        return <span className="bg-secondary-container/30 text-secondary border border-secondary/20 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[16px]">calendar_month</span> {status}</span>;
      case 'Under Review': 
      case 'Reviewed': 
        return <span className="bg-inverse-primary/20 text-inverse-primary border border-inverse-primary/20 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[16px]">visibility</span> Under Review</span>;
      default: 
        return <span className="bg-surface-container-highest text-on-surface-variant border border-white/5 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-[16px]">hourglass_empty</span> Applied</span>;
    }
  };

  return (
    <main className="relative pt-20 bg-background min-h-screen pb-24">
      <div className="flex flex-col w-full px-4 md:px-margin-desktop max-w-container-max mx-auto relative z-10 gap-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <Link to={`/employer/jobs/${job._id}/applicants`} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 w-fit mb-2 text-sm">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to {job.title} Applicants
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-display-lg text-on-background tracking-tight m-0">{applicant.name}</h1>
              {getStatusBadge(application.status)}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">mail</span> {applicant.email}</span>
              {profile?.personalInfo?.phone && (
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">call</span> {profile.personalInfo.phone}</span>
              )}
              {profile?.location?.city && (
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">location_on</span> {profile.location.city}, {profile.location.country}</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={application.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="bg-surface-container text-on-surface rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 border border-white/10 text-sm cursor-pointer font-medium"
            >
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Interview Completed">Interview Completed</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </header>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Applicant Profile & Resume */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Professional Summary */}
            {profile?.about && (
              <section className="bg-surface-container-low rounded-2xl p-6 border border-white/5 shadow-sm">
                <h3 className="text-lg font-headline-sm text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">person_book</span> About
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">{profile.about}</p>
              </section>
            )}

            {/* Skills */}
            {profile?.skills && (
              <section className="bg-surface-container-low rounded-2xl p-6 border border-white/5 shadow-sm">
                <h3 className="text-lg font-headline-sm text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">code_blocks</span> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.programmingLanguages?.map((s, i) => (
                    <span key={`p-${i}`} className="bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg text-sm border border-white/5">{s.name} {s.proficiency && <span className="text-on-surface-variant text-xs opacity-70 ml-1">({s.proficiency})</span>}</span>
                  ))}
                  {profile.skills.frameworks?.map((s, i) => (
                    <span key={`f-${i}`} className="bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg text-sm border border-white/5">{s.name}</span>
                  ))}
                  {profile.skills.tools?.map((s, i) => (
                    <span key={`t-${i}`} className="bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg text-sm border border-white/5">{s.name}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Resume Preview */}
            {application.resume && (
              <section className="bg-surface-container-low rounded-2xl p-6 border border-white/5 shadow-sm flex flex-col h-[600px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-headline-sm text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-inverse-primary">description</span> Resume
                  </h3>
                  <a 
                    href={getMediaUrl(application.resume)}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary hover:text-primary-fixed text-sm font-medium flex items-center gap-1"
                  >
                    Open in new tab <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
                <div className="flex-grow bg-surface-container-highest rounded-xl overflow-hidden border border-white/5">
                  <iframe 
                    src={getMediaUrl(application.resume)} 
                    title="Resume Preview"
                    className="w-full h-full border-none"
                  ></iframe>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Recruiter Workspace */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Applicant Rating */}
            <section className="bg-surface-container-low rounded-2xl p-6 border border-white/5 shadow-sm">
              <h3 className="text-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-4">Recruiter Rating</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => handleRatingUpdate(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <span className={`material-symbols-outlined text-[32px] ${star <= rating ? 'text-tertiary drop-shadow-[0_0_10px_rgba(79,219,200,0.5)]' : 'text-on-surface-variant/30 font-light'}`}>
                      {star <= rating ? 'star' : 'star'}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Private Notes */}
            <section className="bg-surface-container-low rounded-2xl p-6 border border-white/5 shadow-sm flex flex-col gap-3">
              <h3 className="text-sm font-label-sm text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                Private Notes
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50">lock</span>
              </h3>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private thoughts, technical evaluation, or reminders..."
                className="w-full bg-surface-container-highest text-on-surface rounded-xl p-4 min-h-[150px] outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 resize-none text-sm placeholder:text-on-surface-variant/50"
              ></textarea>
              <button 
                onClick={handleNotesSave}
                disabled={savingNotes}
                className="bg-surface-container-highest hover:bg-surface-container-high text-on-surface border border-white/10 px-4 py-2 rounded-lg text-sm font-medium self-end transition-colors flex items-center gap-2"
              >
                {savingNotes ? 'Saving...' : <><span className="material-symbols-outlined text-[16px]">save</span> Save Note</>}
              </button>
            </section>

            {/* Interview Action */}
            <section className="bg-gradient-to-br from-secondary/10 to-primary/5 rounded-2xl p-6 border border-secondary/20 shadow-sm flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <h3 className="text-lg font-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">event_available</span> Interview
              </h3>
              
              {application.interview && application.interview.date ? (
                <div className="bg-surface-container-low/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-secondary">{application.interview.type} Interview</span>
                    <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">{new Date(application.interview.date).toLocaleDateString('en-GB')} at {formatTime12hr(application.interview.time)}</span>
                  </div>
                  {application.interview.link && (
                    <a href={application.interview.link} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-[14px]">link</span> Join Meeting
                    </a>
                  )}
                  {application.interview.location && (
                    <p className="text-sm text-on-surface-variant mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span> {application.interview.location}
                    </p>
                  )}
                  <button 
                    onClick={handleOpenInterviewModal}
                    className="mt-4 text-xs text-on-surface-variant hover:text-on-surface underline"
                  >
                    Reschedule
                  </button>
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No interview scheduled yet.</p>
              )}

              <button 
                onClick={handleOpenInterviewModal}
                className="w-full bg-secondary text-on-secondary hover:bg-secondary-fixed px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-secondary/20 flex items-center justify-center gap-2 z-10"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                {application.interview && application.interview.date ? 'Update Interview' : 'Schedule Interview'}
              </button>
            </section>

            {/* Application Timeline */}
            <section className="bg-surface-container-low rounded-2xl p-6 border border-white/5 shadow-sm">
              <h3 className="text-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-6">Timeline</h3>
              <div className="flex flex-col gap-0 relative pl-4 border-l border-white/10 ml-2">
                {application.history?.map((hist, idx) => (
                  <div key={idx} className="relative pb-6 last:pb-0 pl-6">
                    <span className="absolute -left-[5.5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-low"></span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-on-surface">{hist.status}</span>
                      <span className="text-xs text-on-surface-variant opacity-70 mt-0.5">{new Date(hist.date).toLocaleString()}</span>
                      {hist.note && <span className="text-xs text-on-surface-variant mt-1 italic">{hist.note}</span>}
                    </div>
                  </div>
                ))}
                {(!application.history || application.history.length === 0) && (
                  <div className="relative pb-6 pl-6">
                    <span className="absolute -left-[5.5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-low"></span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-on-surface">Applied</span>
                      <span className="text-xs text-on-surface-variant opacity-70 mt-0.5">{new Date(application.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Interview Scheduling Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10 relative">
            <button 
              onClick={() => setShowInterviewModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="text-xl font-display-md text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">calendar_add_on</span> Schedule Interview
            </h2>

            <form onSubmit={handleScheduleInterview} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface-variant uppercase tracking-wider">Date</label>
                  <input 
                    type="date" 
                    required
                    min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm({...interviewForm, date: e.target.value})}
                    className="bg-surface-container-highest text-on-surface rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 text-sm [color-scheme:dark]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface-variant uppercase tracking-wider">Time</label>
                  <input 
                    type="time" 
                    required
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm({...interviewForm, time: e.target.value})}
                    className="bg-surface-container-highest text-on-surface rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 text-sm [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface-variant uppercase tracking-wider">Duration</label>
                  <select 
                    value={interviewForm.duration}
                    onChange={(e) => setInterviewForm({...interviewForm, duration: Number(e.target.value)})}
                    className="bg-surface-container-highest text-on-surface rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 text-sm"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={90}>1.5 Hours</option>
                    <option value={120}>2 Hours</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface-variant uppercase tracking-wider">Break After</label>
                  <select 
                    value={interviewForm.breakTime}
                    onChange={(e) => setInterviewForm({...interviewForm, breakTime: Number(e.target.value)})}
                    className="bg-surface-container-highest text-on-surface rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 text-sm"
                  >
                    <option value={0}>No Break</option>
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant uppercase tracking-wider">Type</label>
                <select 
                  value={interviewForm.type}
                  onChange={(e) => setInterviewForm({...interviewForm, type: e.target.value})}
                  className="bg-surface-container-highest text-on-surface rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 text-sm"
                >
                  <option value="Online">Online / Video Call</option>
                  <option value="Offline">Offline / In-person</option>
                </select>
              </div>

              {interviewForm.type === 'Online' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface-variant uppercase tracking-wider">Meeting Link</label>
                  <input 
                    type="url" 
                    placeholder="https://zoom.us/..."
                    value={interviewForm.link}
                    onChange={(e) => setInterviewForm({...interviewForm, link: e.target.value})}
                    className="bg-surface-container-highest text-on-surface rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 text-sm"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface-variant uppercase tracking-wider">Location</label>
                  <input 
                    type="text" 
                    placeholder="Office address..."
                    value={interviewForm.location}
                    onChange={(e) => setInterviewForm({...interviewForm, location: e.target.value})}
                    className="bg-surface-container-highest text-on-surface rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 border border-white/5 text-sm"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5 mt-4">
                <button type="submit" className="bg-primary text-on-primary hover:bg-primary-fixed py-3 rounded-xl text-sm font-medium transition-all shadow-md flex justify-center">
                  Confirm Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ApplicationDetails;

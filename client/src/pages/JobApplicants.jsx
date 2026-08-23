import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronLeft, FileText, User, Mail, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const JobApplicants = () => {
  const { id } = useParams(); // Job ID
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // We could fetch job details to get the title, or it could be returned with applications
        const jobRes = await api.get(`/jobs/${id}`);
        setJobTitle(jobRes.data.data.title);

        const appRes = await api.get(`/applications/job/${id}`);
        setApplications(appRes.data.data);
      } catch (error) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
      toast.success(`Application marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Shortlisted': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Shortlisted</span>;
      case 'Rejected': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Rejected</span>;
      case 'Interviewing': return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">Interviewing</span>;
      case 'Reviewed': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Reviewed</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Link to="/employer-dashboard" className="inline-flex items-center text-gray-500 hover:text-primary mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applicants</h1>
          <p className="text-gray-600 text-lg">For Role: <span className="font-semibold text-gray-800">{jobTitle}</span></p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm text-gray-500">Total Applications:</span>
          <span className="ml-2 text-xl font-bold text-primary">{applications.length}</span>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500">Applications for this job will appear here once candidates apply.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                  {app.profile?.personalInfo?.profilePhoto ? (
                    <img src={`http://localhost:5000${app.profile.personalInfo.profilePhoto}`} alt={app.applicant.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{app.applicant.name}</h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1"><Mail className="w-4 h-4 text-gray-400"/> {app.applicant.email}</span>
                    {app.profile?.personalInfo?.phone && (
                      <span>• {app.profile.personalInfo.phone}</span>
                    )}
                  </div>
                  
                  {app.coverLetter && (
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 italic border-l-4 border-gray-300 mb-3 line-clamp-2 hover:line-clamp-none">
                      "{app.coverLetter}"
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                     {app.profile?.skills && (
                       <>
                         {app.profile.skills.programmingLanguages?.slice(0,2).map((s,i) => <span key={`p-${i}`} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100">{s.name}</span>)}
                         {app.profile.skills.frameworks?.slice(0,2).map((s,i) => <span key={`f-${i}`} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded border border-indigo-100">{s.name}</span>)}
                       </>
                     )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                {app.resume && (
                  <a 
                    href={`http://localhost:5000${app.resume}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <FileText className="w-4 h-4" /> View Resume
                  </a>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                    disabled={app.status === 'Shortlisted'}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-700 opacity-50 cursor-not-allowed' : 'bg-white border border-green-200 text-green-600 hover:bg-green-50'}`}
                  >
                    <CheckCircle className="w-4 h-4" /> Shortlist
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                    disabled={app.status === 'Rejected'}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${app.status === 'Rejected' ? 'bg-red-100 text-red-700 opacity-50 cursor-not-allowed' : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'}`}
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;

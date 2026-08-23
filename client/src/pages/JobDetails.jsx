import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MapPin, Briefcase, Clock, IndianRupee, Calendar, Building, ChevronLeft, Send } from 'lucide-react';
import api from '../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Application state
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

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

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    
    try {
      await api.post(`/applications/${id}`, { coverLetter });
      toast.success('Successfully applied for this job!');
      setShowApplyModal(false);
      setCoverLetter('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply for the job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) return null;

  const isEmployer = user?.role === 'employer';
  const isAdmin = user?.role === 'admin';
  const canApply = isAuthenticated && !isEmployer && !isAdmin;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Link to="/jobs" className="inline-flex items-center text-gray-500 hover:text-primary mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Jobs
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex gap-6">
              <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                {job.company?.logo && job.company.logo !== 'default-company-logo.png' ? (
                  <img src={`http://localhost:5000${job.company.logo}`} alt={job.company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{job.company?.name}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {job.location?.city || job.location?.country ? `${job.location?.city}, ${job.location?.country}` : 'Location Not Specified'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    {job.employmentType} ({job.workMode})
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {job.experienceRequired} Experience
                  </div>
                  {job.salaryRange && (job.salaryRange.min || job.salaryRange.max) && (
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4 text-gray-400" />
                      {job.salaryRange.min ? job.salaryRange.min : ''} {job.salaryRange.min && job.salaryRange.max ? '-' : ''} {job.salaryRange.max ? job.salaryRange.max : ''} {job.salaryRange.currency}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              {canApply ? (
                <button 
                  onClick={() => setShowApplyModal(true)}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Apply Now
                </button>
              ) : !isAuthenticated ? (
                <Link 
                  to="/login"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors text-center"
                >
                  Log in to Apply
                </Link>
              ) : (isEmployer && job.employer === user._id) ? (
                 <Link 
                  to={`/employer/jobs/${job._id}/applicants`}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors text-center"
                >
                  View Applicants
                </Link>
              ) : null}
              
              <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-1.5">
                <Calendar className="w-4 h-4" /> 
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.responsibilities}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Qualifications</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.qualifications}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.map((skill, index) => (
                  <span key={index} className="bg-white border border-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Job Overview</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Posted on:</span>
                  <span className="font-medium text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Vacancies:</span>
                  <span className="font-medium text-gray-900">{job.vacancies} Position(s)</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium text-gray-900">{job.category}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
              <p className="text-gray-500 text-sm mt-1">Submit your application to {job.company?.name}</p>
            </div>
            
            <form onSubmit={handleApply} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-700"
                  placeholder="Why are you a great fit for this role?"
                ></textarea>
                <p className="text-xs text-gray-500 mt-2">
                  Note: Your profile's resume will be automatically attached to this application. Ensure your profile is up to date before applying.
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className={`px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center ${applying ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {applying ? (
                    <>
                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                       Applying...
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
    </div>
  );
};

export default JobDetails;

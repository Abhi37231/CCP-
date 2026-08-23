import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../redux/slices/profileSlice';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, Star, Calendar, CheckCircle, Circle, FileText, ExternalLink } from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/JobCard';

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.profile);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!profile || profile.profileCompletion < 50) return;
      
      setLoadingJobs(true);
      try {
        // Extract skills to use as search keywords
        let skills = [];
        if (profile.skills) {
           Object.values(profile.skills).forEach(skillCategory => {
              if (Array.isArray(skillCategory)) {
                 skillCategory.forEach(s => skills.push(s.name));
              }
           });
        }
        
        let keywordQuery = skills.join(' ');
        const endpoint = keywordQuery ? `/jobs?keyword=${encodeURIComponent(keywordQuery)}&limit=3` : '/jobs?limit=3';
        
        const res = await api.get(endpoint);
        setRecommendedJobs(res.data.data);
      } catch (err) {
        console.error('Error fetching recommended jobs', err);
      } finally {
        setLoadingJobs(false);
      }
    };
    
    fetchRecommendedJobs();
  }, [profile]);

  if (isLoading) {
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  const completionPercentage = profile?.profileCompletion || 0;

  // Determine what sections are complete for the checklist
  const isPersonalInfoComplete = !!(profile?.personalInfo?.firstName);
  const isEducationComplete = !!(profile?.education?.length > 0);
  const isSkillsComplete = !!(profile?.skills && Object.keys(profile.skills).some(k => profile.skills[k]?.length > 0));
  const isProjectsComplete = !!(profile?.projects?.length > 0);
  const isResumeUploaded = !!(profile?.resume);
  const isCertificationsComplete = !!(profile?.certifications?.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-3">
           <Link to="/profile/preview" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 flex items-center">
             <ExternalLink className="w-4 h-4 mr-2" /> View Profile
           </Link>
           <Link to="/profile/edit" className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-blue-700">
             {profile ? 'Edit Profile' : 'Complete Your Profile'}
           </Link>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Welcome back, {user?.name || profile?.personalInfo?.firstName}!</h2>
          <p className="text-gray-500 mt-1">Here is what is happening with your job search today.</p>
        </div>
        <div className="hidden sm:block">
           <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-primary">
              <Briefcase size={40} />
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-primary rounded-lg"><Briefcase /></div>
          <div>
            <p className="text-gray-500 text-sm">Applied Jobs</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Bookmark /></div>
          <div>
            <p className="text-gray-500 text-sm">Saved Jobs</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Star /></div>
          <div>
            <p className="text-gray-500 text-sm">Interviews</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Calendar /></div>
          <div>
            <p className="text-gray-500 text-sm">Profile Views</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-semibold">Recommended Jobs</h3>
               {recommendedJobs.length > 0 && <Link to="/jobs" className="text-primary text-sm hover:underline">View All</Link>}
             </div>
             
             {completionPercentage < 50 ? (
               <div className="text-gray-500 text-center py-8">
                 Complete your profile to see recommended jobs!
               </div>
             ) : loadingJobs ? (
               <div className="text-center py-8 text-gray-500">Loading recommendations...</div>
             ) : recommendedJobs.length > 0 ? (
               <div className="space-y-4">
                 {recommendedJobs.map(job => (
                   <JobCard key={job._id} job={job} />
                 ))}
               </div>
             ) : (
               <div className="text-gray-500 text-center py-8">
                 No recommendations at this time. We'll notify you when new jobs match your profile.
               </div>
             )}
           </div>
        </div>
        
        {/* Profile Completion Checklist */}
        <div className="space-y-6">
           <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
             <h3 className="text-xl font-semibold mb-4">Profile Completion</h3>
             
             <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-sm font-medium text-gray-700">Progress</span>
                   <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                   <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
                </div>
             </div>

             <div className="space-y-3">
               <div className="flex items-center gap-3">
                 {isPersonalInfoComplete ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                 <span className={isPersonalInfoComplete ? 'text-gray-800 line-through opacity-70' : 'text-gray-700'}>Personal Information</span>
               </div>
               <div className="flex items-center gap-3">
                 {isEducationComplete ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                 <span className={isEducationComplete ? 'text-gray-800 line-through opacity-70' : 'text-gray-700'}>Education</span>
               </div>
               <div className="flex items-center gap-3">
                 {isSkillsComplete ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                 <span className={isSkillsComplete ? 'text-gray-800 line-through opacity-70' : 'text-gray-700'}>Skills</span>
               </div>
               <div className="flex items-center gap-3">
                 {isProjectsComplete ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                 <span className={isProjectsComplete ? 'text-gray-800 line-through opacity-70' : 'text-gray-700'}>Projects</span>
               </div>
               <div className="flex items-center gap-3">
                 {isResumeUploaded ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                 <span className={isResumeUploaded ? 'text-gray-800 line-through opacity-70' : 'text-gray-700'}>Resume Upload</span>
               </div>
               <div className="flex items-center gap-3">
                 {isCertificationsComplete ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                 <span className={isCertificationsComplete ? 'text-gray-800 line-through opacity-70' : 'text-gray-700'}>Certifications</span>
               </div>
             </div>

             <div className="mt-6 pt-6 border-t border-gray-100">
               <Link to="/resume-builder" className="w-full flex items-center justify-center gap-2 bg-gray-50 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition">
                 <FileText className="w-4 h-4" /> Build ATS Resume
               </Link>
             </div>

           </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;

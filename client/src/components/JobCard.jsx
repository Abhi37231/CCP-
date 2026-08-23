import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, IndianRupee, Users } from 'lucide-react';
import { useSelector } from 'react-redux';

const JobCard = ({ job }) => {
  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.role === 'employer' && (user?._id === job.employer || user?.id === job.employer);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded border border-gray-100 flex items-center justify-center bg-gray-50 flex-shrink-0 overflow-hidden">
            {job.company?.logo && job.company.logo !== 'default-company-logo.png' ? (
              <img src={`http://localhost:5000${job.company.logo}`} alt={job.company.name} className="w-full h-full object-cover" />
            ) : (
              <Briefcase className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
            <p className="text-gray-600 text-sm">{job.company?.name}</p>
          </div>
        </div>
        <span className="bg-blue-50 text-primary text-xs px-3 py-1 rounded-full font-medium">
          {job.employmentType}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-gray-400" />
          {job.location?.city || job.location?.country ? `${job.location?.city}, ${job.location?.country}` : 'Location Not Specified'}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-400" />
          {job.experienceRequired}
        </div>
        <div className="flex items-center gap-1.5 col-span-2 mt-1">
           <Briefcase className="w-4 h-4 text-gray-400" />
           <span className="truncate">
             {job.workMode}
           </span>
        </div>
        {job.salaryRange && (job.salaryRange.min || job.salaryRange.max) && (
          <div className="flex items-center gap-1.5 col-span-2 mt-1">
             <IndianRupee className="w-4 h-4 text-gray-400" />
             <span>
               {job.salaryRange.min ? job.salaryRange.min : ''} {job.salaryRange.min && job.salaryRange.max ? '-' : ''} {job.salaryRange.max ? job.salaryRange.max : ''} {job.salaryRange.currency}
             </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.skillsRequired?.slice(0, 3).map((skill, index) => (
          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            {skill}
          </span>
        ))}
        {job.skillsRequired?.length > 3 && (
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            +{job.skillsRequired.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-4">
          {isOwner && (
            <Link to={`/employer/jobs/${job._id}/applicants`} className="text-purple-600 font-medium text-sm hover:underline flex items-center gap-1">
              <Users className="w-4 h-4" /> Applicants
            </Link>
          )}
          <Link to={`/jobs/${job._id}`} className="text-primary font-medium text-sm hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

import { useState, useEffect } from 'react';
import { Search, Filter, Briefcase } from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/JobCard';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchJobs = async (search = '') => {
    setLoading(true);
    try {
      const endpoint = search ? `/jobs?keyword=${search}` : '/jobs';
      const response = await api.get(endpoint);
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(keyword);
    fetchJobs(keyword);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header and Search */}
      <div className="bg-primary rounded-xl p-8 mb-8 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-blue-100 mb-8 max-w-2xl text-lg">
          Explore thousands of job opportunities and take the next step in your career.
        </p>
        
        <form onSubmit={handleSearch} className="flex gap-4 max-w-3xl">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by job title, skills, or keywords..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar (Mockup) */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-4">
            <div className="flex items-center gap-2 mb-6 text-gray-800 font-semibold text-lg">
              <Filter className="w-5 h-5" /> Filters
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Employment Type</h4>
                <div className="space-y-2">
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-gray-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Work Mode</h4>
                <div className="space-y-2">
                  {['Remote', 'Hybrid', 'Onsite'].map((mode) => (
                    <label key={mode} className="flex items-center gap-2 text-gray-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                      {mode}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="flex-grow">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Jobs'}
            </h2>
            <span className="text-gray-500 text-sm">{jobs.length} jobs found</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">
                We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsList;

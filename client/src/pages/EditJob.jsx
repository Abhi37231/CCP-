import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    skillsRequired: '',
    category: '',
    salaryRange: { min: '', max: '' },
    targetAudience: 'Both',
    experienceRequired: 'Fresher',
    employmentType: 'Full-time',
    workMode: 'Onsite',
    location: { city: '', state: '', country: '' },
    vacancies: 1,
    deadline: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const job = res.data.data;
        
        setFormData({
          title: job.title || '',
          description: job.description || '',
          responsibilities: job.responsibilities || '',
          qualifications: job.qualifications || '',
          skillsRequired: job.skillsRequired ? job.skillsRequired.join(', ') : '',
          category: job.category || '',
          salaryRange: {
            min: job.salaryRange?.min || '',
            max: job.salaryRange?.max || ''
          },
          targetAudience: job.targetAudience || 'Both',
          experienceRequired: job.experienceRequired || 'Fresher',
          employmentType: job.employmentType || 'Full-time',
          workMode: job.workMode || 'Onsite',
          location: {
            city: job.location?.city || '',
            state: job.location?.state || '',
            country: job.location?.country || ''
          },
          vacancies: job.vacancies || 1,
          deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
        });
      } catch (error) {
        toast.error('Failed to load job details');
        navigate('/employer-dashboard');
      } finally {
        setFetching(false);
      }
    };
    
    fetchJob();
  }, [id, navigate]);

  const { title, description, responsibilities, qualifications, skillsRequired, category, salaryRange, targetAudience, experienceRequired, employmentType, workMode, location, vacancies, deadline } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        skillsRequired: skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill !== '')
      };

      await api.put(`/jobs/${id}`, jobData);
      toast.success('Job updated successfully!');
      navigate('/employer-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <LoadingScreen isLoading={true} />;
  }

  return (
    <main className="relative pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full relative">
        <div className="max-w-[800px] w-full mx-auto pb-24 px-4 md:px-margin-desktop">
          {/* Header Section */}
          <div className="mt-8 mb-12">
            <h1 className="font-display-lg text-display-lg text-on-background mb-2">Edit Job</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Update the details of your posted job.
            </p>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-12">
            {/* Section 1: Basic Information */}
            <section className="bg-surface-container rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-xl border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-headline-md text-headline-md relative z-10">
                  1
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface relative z-10">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Job Title <span className="text-error">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={onChange}
                    required
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Category / Industry <span className="text-error">*</span></label>
                  <input
                    type="text"
                    name="category"
                    value={category}
                    onChange={onChange}
                    required
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                    placeholder="e.g. Information Technology"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Job Description <span className="text-error">*</span></label>
                  <textarea
                    name="description"
                    value={description}
                    onChange={onChange}
                    required
                    rows="4"
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"
                    placeholder="Describe the role in detail..."
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Section 2: Requirements */}
            <section className="bg-surface-container rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-xl border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary font-headline-md text-headline-md">
                  2
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Requirements</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Responsibilities <span className="text-error">*</span></label>
                  <textarea
                    name="responsibilities"
                    value={responsibilities}
                    onChange={onChange}
                    required
                    rows="4"
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"
                    placeholder="List key responsibilities..."
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Qualifications <span className="text-error">*</span></label>
                  <textarea
                    name="qualifications"
                    value={qualifications}
                    onChange={onChange}
                    required
                    rows="4"
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"
                    placeholder="List required qualifications..."
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Skills Required <span className="text-error">*</span></label>
                  <input
                    type="text"
                    name="skillsRequired"
                    value={skillsRequired}
                    onChange={onChange}
                    required
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                    placeholder="Comma separated values (e.g. React, Node.js, MongoDB)"
                  />
                  {skillsRequired && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skillsRequired.split(',').map((skill, index) => skill.trim() && (
                        <span key={index} className="inline-flex items-center px-3 py-1 bg-tertiary-container/30 text-tertiary rounded-lg font-label-sm text-label-sm border border-tertiary/20">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Section 3: Logistics & Compensation */}
            <section className="bg-surface-container rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-xl border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-headline-md text-headline-md relative z-10">
                  3
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface relative z-10">Logistics & Compensation</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Target Audience <span className="text-error">*</span></label>
                  <select
                    name="targetAudience"
                    value={targetAudience}
                    onChange={onChange}
                    required
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                  >
                    <option value="Both">Both (Students & Employees)</option>
                    <option value="Student">Students (Freshers)</option>
                    <option value="Employee">Employees (Experienced)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Experience Required <span className="text-error">*</span></label>
                  <select
                    name="experienceRequired"
                    value={experienceRequired}
                    onChange={onChange}
                    required
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                  >
                    <option value="Any">Any Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5-10 Years">5-10 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Employment Type <span className="text-error">*</span></label>
                  <select
                    name="employmentType"
                    value={employmentType}
                    onChange={onChange}
                    required
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Work Mode <span className="text-error">*</span></label>
                  <select
                    name="workMode"
                    value={workMode}
                    onChange={onChange}
                    required
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Vacancies <span className="text-error">*</span></label>
                  <input
                    type="number"
                    name="vacancies"
                    value={vacancies}
                    onChange={onChange}
                    min="1"
                    required
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Application Deadline <span className="text-error">*</span></label>
                  <input
                    type="date"
                    name="deadline"
                    value={deadline}
                    onChange={onChange}
                    required
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 [color-scheme:dark]"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Min Salary</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-on-surface-variant">₹</span>
                    <input
                      type="number"
                      name="salaryRange.min"
                      value={salaryRange.min}
                      onChange={onChange}
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-8 pr-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Max Salary</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-on-surface-variant">₹</span>
                    <input
                      type="number"
                      name="salaryRange.max"
                      value={salaryRange.max}
                      onChange={onChange}
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-8 pr-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-2 border-t border-white/5">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      name="location.city"
                      value={location.city}
                      onChange={onChange}
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      name="location.state"
                      value={location.state}
                      onChange={onChange}
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Country</label>
                    <input
                      type="text"
                      name="location.country"
                      value={location.country}
                      onChange={onChange}
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-4 md:bottom-8 z-30 flex justify-end gap-4 bg-surface-container/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10">
              <button 
                type="button" 
                onClick={() => navigate('/employer-dashboard')}
                className="px-6 py-3 bg-transparent text-on-surface font-label-sm text-label-sm rounded-xl hover:bg-surface-container-highest transition-colors border border-transparent"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary-container text-on-primary font-label-sm text-label-sm rounded-xl shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:shadow-[0_0_30px_rgba(173,198,255,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-on-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Update Job
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditJob;

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile, getProfile, clearProfileError } from '../redux/slices/profileSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, error } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    about: '',
    skills: '',
    city: '',
    state: '',
    country: '',
    currentCompany: '',
    currentDesignation: '',
    totalExperienceYears: '',
    noticePeriodDays: '',
    currentSalary: ''
  });
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    } else {
      setFormData({
        about: profile.about || '',
        skills: profile.skills ? profile.skills.join(', ') : '',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || '',
        currentCompany: profile.professionalDetails?.currentCompany || '',
        currentDesignation: profile.professionalDetails?.currentDesignation || '',
        totalExperienceYears: profile.professionalDetails?.totalExperienceYears || '',
        noticePeriodDays: profile.professionalDetails?.noticePeriodDays || '',
        currentSalary: profile.professionalDetails?.currentSalary || ''
      });
    }
  }, [profile, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProfileError());
    }
  }, [error, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (user?.experienceLevel === 'experienced') {
      if (!formData.currentCompany || !formData.currentDesignation || !formData.totalExperienceYears || !formData.noticePeriodDays || !formData.currentSalary) {
        toast.error('Please fill in all required Professional Details.');
        return;
      }
    }

    const data = new FormData();
    data.append('about', formData.about);
    data.append('skills', formData.skills);
    data.append('location.city', formData.city);
    data.append('location.state', formData.state);
    data.append('location.country', formData.country);
    if (user?.experienceLevel === 'experienced') {
      data.append('professionalDetails.currentCompany', formData.currentCompany);
      data.append('professionalDetails.currentDesignation', formData.currentDesignation);
      data.append('professionalDetails.totalExperienceYears', formData.totalExperienceYears);
      data.append('professionalDetails.noticePeriodDays', formData.noticePeriodDays);
      data.append('professionalDetails.currentSalary', formData.currentSalary);
    }
    if (resume) {
      data.append('resume', resume);
    }

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <main className="relative pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full relative">
        <div className="max-w-[800px] w-full mx-auto pb-24 px-margin-desktop">
          {/* Header Section */}
          <div className="mt-8 mb-12">
            <h1 className="font-display-lg text-display-lg text-on-background mb-2">Edit Profile</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Build a standout portfolio. 94% of tech roles are filled through highly detailed profiles.
            </p>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-12">
            {/* Section 1: Basic Info */}
            <section className="bg-surface-container rounded-3xl p-8 relative overflow-hidden group shadow-xl border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-headline-md text-headline-md relative z-10">
                  1
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface relative z-10">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="flex flex-col gap-2 col-span-1 md:col-span-3">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">About Me</label>
                  <textarea 
                    name="about"
                    value={formData.about}
                    onChange={onChange}
                    placeholder="Tell employers about yourself..."
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5" 
                    rows="4"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">City</label>
                  <input 
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={onChange}
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">State</label>
                  <input 
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={onChange}
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Country</label>
                  <input 
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={onChange}
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" 
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Professional Details (Experienced Only) */}
            {user?.experienceLevel === 'experienced' && (
              <section className="bg-surface-container rounded-3xl p-8 relative overflow-hidden group shadow-xl border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary font-headline-md text-headline-md">
                    2
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Professional Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Current Company <span className="text-error">*</span></label>
                    <input 
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={onChange}
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 transition-all w-full border border-white/5" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Current Designation <span className="text-error">*</span></label>
                    <input 
                      type="text"
                      name="currentDesignation"
                      value={formData.currentDesignation}
                      onChange={onChange}
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 transition-all w-full border border-white/5" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Experience (Years) <span className="text-error">*</span></label>
                    <input 
                      type="number"
                      step="0.1"
                      name="totalExperienceYears"
                      value={formData.totalExperienceYears}
                      onChange={onChange}
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 transition-all w-full border border-white/5" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Notice Period (Days) <span className="text-error">*</span></label>
                    <input 
                      type="number"
                      name="noticePeriodDays"
                      value={formData.noticePeriodDays}
                      onChange={onChange}
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 transition-all w-full border border-white/5" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Current Salary (LPA) <span className="text-error">*</span></label>
                    <input 
                      type="number"
                      name="currentSalary"
                      value={formData.currentSalary}
                      onChange={onChange}
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 transition-all w-full border border-white/5" 
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Section 3: Skills */}
            <section className="bg-surface-container rounded-3xl p-8 relative overflow-hidden group shadow-xl border border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-headline-md text-headline-md">
                  {user?.experienceLevel === 'experienced' ? '3' : '2'}
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Tech Stack & Skills</h2>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Skills (Comma separated)</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant">terminal</span>
                    <input 
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={onChange}
                      className="w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner border border-white/5" 
                      placeholder="e.g. JavaScript, React, Node.js"
                    />
                  </div>
                </div>
                
                {/* Preview tags */}
                {formData.skills && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.split(',').map((skill, index) => skill.trim() && (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary-container/30 text-secondary rounded-lg font-label-sm text-label-sm shadow-sm backdrop-blur-sm border border-secondary/20">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Section 4: Resume Upload */}
            <section className="bg-surface-container rounded-3xl p-8 relative overflow-hidden shadow-xl border border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-headline-md text-headline-md">
                  {user?.experienceLevel === 'experienced' ? '4' : '3'}
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Resume Upload</h2>
              </div>
              
              <div 
                className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-surface-container-lowest/50 hover:bg-surface-container-highest/30 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  name="resume"
                  onChange={onFileChange}
                  accept=".pdf,.doc,.docx"
                  ref={fileInputRef}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary-container/20 group-hover:text-primary border border-white/5">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary">cloud_upload</span>
                </div>
                
                {resume ? (
                  <>
                    <h3 className="font-headline-md text-body-lg text-primary mb-2">{resume.name}</h3>
                    <p className="font-body-md text-label-sm text-on-surface-variant mb-0">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <h3 className="font-headline-md text-body-lg text-on-surface mb-2">Click to select your resume</h3>
                    <p className="font-body-md text-label-sm text-on-surface-variant mb-6">PDF or DOCX up to 5MB</p>
                    <button type="button" className="px-6 py-2.5 bg-surface-container-highest text-on-surface font-label-sm text-label-sm rounded-lg hover:bg-surface-bright transition-colors shadow-sm border border-white/5">
                      Browse Files
                    </button>
                  </>
                )}
              </div>
              
              {!resume && profile?.resume && (
                <div className="mt-4 flex items-center gap-2 text-tertiary bg-tertiary/10 p-3 rounded-xl border border-tertiary/20">
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  <span className="font-label-sm text-label-sm">Current Resume: {profile.resume.split('-').pop()}</span>
                </div>
              )}
            </section>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-8 z-30 flex justify-end gap-4 bg-surface-container/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-transparent text-on-surface font-label-sm text-label-sm rounded-xl hover:bg-surface-container-highest transition-colors border border-transparent"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary-container text-on-primary font-label-sm text-label-sm rounded-xl shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:shadow-[0_0_30px_rgba(173,198,255,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-on-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Save Profile
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

export default EditProfile;

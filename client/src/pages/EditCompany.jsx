import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile, getProfile, clearProfileError } from '../redux/slices/profileSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMediaUrl } from '../utils/formatUrl';

const EditCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, error } = useSelector((state) => state.profile);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: '1-10',
    city: '',
    state: '',
    country: ''
  });
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    } else {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        website: profile.website || '',
        industry: profile.industry || '',
        size: profile.size || '1-10',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || ''
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
      setLogo(e.target.files[0]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('website', formData.website);
    data.append('industry', formData.industry);
    data.append('size', formData.size);
    data.append('location.city', formData.city);
    data.append('location.state', formData.state);
    data.append('location.country', formData.country);
    if (logo) {
      data.append('logo', logo);
    }

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Company profile updated successfully!');
      navigate('/employer-dashboard');
    }
  };

  return (
    <main className="relative pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full relative">
        <div className="max-w-[800px] w-full mx-auto pb-24 px-margin-desktop">
          {/* Header Section */}
          <div className="mt-8 mb-12">
            <h1 className="font-display-lg text-display-lg text-on-background mb-2">Company Profile</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Showcase your company's culture and attract elite tech talent.
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Company Name <span className="text-error">*</span></label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={onChange}
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Website URL</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant">language</span>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={onChange}
                      placeholder="https://example.com"
                      className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Company Description <span className="text-error">*</span></label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={onChange}
                    rows="4"
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"
                    placeholder="What does your company do?"
                  ></textarea>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Industry <span className="text-error">*</span></label>
                  <input
                    type="text"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={onChange}
                    placeholder="e.g. Information Technology"
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Company Size</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={onChange}
                    className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
                  >
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-500">201-500 Employees</option>
                    <option value="501-1000">501-1000 Employees</option>
                    <option value="1000+">1000+ Employees</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Section 2: Location */}
            <section className="bg-surface-container rounded-3xl p-8 relative overflow-hidden group shadow-xl border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary font-headline-md text-headline-md">
                  2
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Location</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">City</label>
                  <input type="text" name="city" value={formData.city} onChange={onChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">State</label>
                  <input type="text" name="state" value={formData.state} onChange={onChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Country</label>
                  <input type="text" name="country" value={formData.country} onChange={onChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
                </div>
              </div>
            </section>

            {/* Section 3: Brand */}
            <section className="bg-surface-container rounded-3xl p-8 relative overflow-hidden group shadow-xl border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-headline-md text-headline-md">
                  3
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Brand Identity</h2>
              </div>
              
              <div className="relative z-10">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-4 block">Company Logo (Image)</label>
                <div 
                  className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-surface-container-lowest/50 hover:bg-surface-container-highest/30 hover:border-secondary/50 transition-all cursor-pointer group"
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    name="logo"
                    onChange={onFileChange}
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-secondary-container/20 group-hover:text-secondary border border-white/5">
                    <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-secondary">add_photo_alternate</span>
                  </div>
                  
                  {logo ? (
                    <>
                      <h3 className="font-headline-md text-body-lg text-secondary mb-2">{logo.name}</h3>
                      <p className="font-body-md text-label-sm text-on-surface-variant mb-0">{(logo.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-headline-md text-body-lg text-on-surface mb-2">Upload Logo</h3>
                      <p className="font-body-md text-label-sm text-on-surface-variant mb-6">PNG or JPG up to 5MB</p>
                      <button type="button" className="px-6 py-2.5 bg-surface-container-highest text-on-surface font-label-sm text-label-sm rounded-lg hover:bg-surface-bright transition-colors shadow-sm border border-white/5">
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
                
                {!logo && profile?.logo && profile.logo !== 'default-company-logo.png' && (
                  <div className="mt-6">
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">Current Logo</p>
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-white p-2">
                      <img src={getMediaUrl(profile.logo)} alt="Logo preview" className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-8 z-30 flex justify-end gap-4 bg-surface-container/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10">
              <button 
                type="button" 
                onClick={() => navigate('/employer-dashboard')}
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
                    <span className="material-symbols-outlined text-[18px]">domain_add</span>
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

export default EditCompany;

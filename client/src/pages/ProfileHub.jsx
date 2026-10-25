import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile } from '../redux/slices/profileSlice';
import { updateUserDetails } from '../redux/slices/authSlice';
import LoadingScreen from '../components/LoadingScreen';
import { getMediaUrl } from '../utils/formatUrl';
import { toast } from 'react-toastify';

const ProfileHub = () => {
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  
  const [isHrModalOpen, setIsHrModalOpen] = useState(false);
  const [hrFormData, setHrFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    }
  }, [dispatch, profile]);

  if (isLoading || !user) {
    return <LoadingScreen isLoading={true} />;
  }

  const handleOpenHrModal = () => {
    setHrFormData({
      name: user?.name || '',
      phone: user?.phone || profile?.personalInfo?.phone || ''
    });
    setIsHrModalOpen(true);
  };

  const handleUpdateHr = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserDetails(hrFormData)).unwrap();
      toast.success('HR Profile updated successfully');
      setIsHrModalOpen(false);
    } catch (err) {
      toast.error(err || 'Failed to update HR Profile');
    }
  };

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [profile?.logo, profile?.personalInfo?.profilePhoto, user?.avatar]);

  const isEmployer = user?.role === 'employer';
  const editLink = isEmployer ? '/company/edit' : '/profile/edit';
  
  // Data resolution based on role
  const displayName = isEmployer 
    ? (profile?.name || user?.name || 'Company Name')
    : (profile?.personalInfo?.firstName ? `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}` : user?.name || 'User');
    
  const displayTitle = isEmployer
    ? (profile?.industry || 'Employer')
    : (profile?.about?.title || user?.role?.replace('_', ' ') || 'Professional');

  const displayLocation = isEmployer
    ? (profile?.location ? [profile.location.address, profile.location.city, profile.location.state, profile.location.country].filter(Boolean).join(', ') || `${profile.location.city || ''}${profile.location.country ? `, ${profile.location.country}` : ''}` : 'Location not set')
    : (profile?.location ? `${profile.location.city || ''}${profile.location.country ? `, ${profile.location.country}` : ''}` : 'Location not set');

  const displayAbout = isEmployer
    ? (profile?.description || 'No description provided.')
    : (profile?.about?.summary || 'No summary provided.');

  // Logo & Avatar resolution
  const hasCompanyLogo = isEmployer && !!(profile?.logo && profile.logo !== 'default-company-logo.png');
  const hasUserAvatar = !isEmployer && !!(profile?.personalInfo?.profilePhoto || (user?.avatar && user.avatar !== 'default-avatar.png'));
  const avatarSrc = hasCompanyLogo ? profile.logo : hasUserAvatar ? (profile?.personalInfo?.profilePhoto || user.avatar) : null;

  // Completion calculation & checklist
  const isLogoUploaded = hasCompanyLogo;
  const isDescriptionComplete = !!(profile?.description && profile.description !== 'New verified company registration');
  const isIndustryComplete = !!(profile?.industry && profile.industry !== 'Other');
  const isWebsiteComplete = !!profile?.website;
  const isLocationComplete = !!(profile?.location?.city || profile?.location?.address);

  const employerChecklist = [
    { label: 'Company Overview', completed: isDescriptionComplete, icon: 'article' },
    { label: 'Company Logo', completed: isLogoUploaded, icon: 'image' },
    { label: 'Industry & Size', completed: isIndustryComplete, icon: 'domain' },
    { label: 'Office Location', completed: isLocationComplete, icon: 'location_on' },
    { label: 'Website URL', completed: isWebsiteComplete, icon: 'language' }
  ];

  const employerCompletedCount = employerChecklist.filter(item => item.completed).length;
  const employerCompletion = profile ? Math.round((employerCompletedCount / employerChecklist.length) * 100) : 0;

  const jobSeekerChecklist = [
    { label: 'Personal Information', completed: !!profile?.personalInfo?.firstName, icon: 'person' },
    { label: 'Education Details', completed: !!(profile?.education?.length > 0), icon: 'school' },
    { label: 'Skills & Proficiencies', completed: !!(profile?.skills && Object.keys(profile.skills).some(k => profile.skills[k]?.length > 0)), icon: 'code' },
    { label: 'Projects & Experience', completed: !!(profile?.projects?.length > 0 || profile?.experience?.length > 0), icon: 'cases' },
    { label: 'Resume Upload', completed: !!profile?.resume, icon: 'description' }
  ];
  const jobSeekerCompletion = profile?.profileCompletion || 0;

  const checklist = isEmployer ? employerChecklist : jobSeekerChecklist;
  const completionPercentage = isEmployer ? employerCompletion : jobSeekerCompletion;

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-margin-desktop">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-display-sm font-display-sm text-on-background">Your Profile</h1>
          <div className="flex flex-wrap gap-3">
            {isEmployer && (
              <button 
                onClick={handleOpenHrModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-surface-container text-on-surface rounded-xl hover:bg-surface-variant transition-colors shadow-lg shadow-black/20 border border-white/5 cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span className="font-label-md text-label-md uppercase tracking-wider text-xs">Edit HR Profile</span>
              </button>
            )}
            <Link 
              to={editLink} 
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">{isEmployer ? 'domain' : 'edit'}</span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-xs">
                {isEmployer ? 'Edit Company Profile' : 'Edit Profile'}
              </span>
            </Link>
          </div>
        </div>
        
        {/* Profile Header Card */}
        <div className="bg-surface-container rounded-3xl p-6 sm:p-8 mb-8 border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative z-10">
            {/* Avatar / Company Logo */}
            <div className={`w-28 h-28 sm:w-32 sm:h-32 ${isEmployer ? 'rounded-2xl p-2.5' : 'rounded-full'} bg-surface-container-highest border-2 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden shrink-0`}>
              {avatarSrc && !imageError ? (
                <img 
                  src={getMediaUrl(avatarSrc)} 
                  alt={displayName} 
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover ${isEmployer ? 'rounded-xl' : 'rounded-full'}`} 
                />
              ) : isEmployer ? (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-container/30 via-surface-container-highest to-secondary-container/20 flex items-center justify-center text-primary font-display-md text-[36px] sm:text-[44px] font-bold">
                  {displayName?.charAt(0)?.toUpperCase() || 'C'}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface font-display-lg text-[44px]">
                  {displayName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 justify-center md:justify-start">
                <h2 className="text-xl sm:text-2xl md:text-display-sm font-bold text-on-surface truncate max-w-full" title={displayName}>
                  {displayName}
                </h2>
                {profile?.isVerified && (
                  <span className="material-symbols-outlined text-green-500 text-[22px] shrink-0" title="Verified Company">verified</span>
                )}
                {isEmployer && profile?.status && (
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    profile.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    profile.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {profile.status}
                  </span>
                )}
              </div>

              <p className="text-title-md text-primary mb-4 flex items-center gap-2 justify-center md:justify-start font-medium">
                <span>{displayTitle}</span>
                {isEmployer && profile?.size && (
                  <span className="text-on-surface-variant font-normal text-sm"> • {profile.size} Employees</span>
                )}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-on-surface-variant text-body-md text-sm sm:text-base">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                  <span>{displayLocation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                  <span>{profile?.companyEmail || user?.email}</span>
                </div>
                {(user?.phone || profile?.personalInfo?.phone) && (
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                    <span>{user?.phone || profile.personalInfo.phone}</span>
                  </div>
                )}
                {isEmployer && profile?.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">language</span>
                    <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-title-lg font-title-lg text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person_book</span>
                  {isEmployer ? 'About Company' : 'About Me'}
                </h3>
                {isEmployer && profile?.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    Visit Website
                  </a>
                )}
              </div>
              <p className="text-body-md sm:text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {displayAbout}
              </p>
            </div>

            {/* Employer: Company Details Section */}
            {isEmployer && (
              <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-lg space-y-6">
                <h3 className="text-title-lg font-title-lg text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">business</span>
                  Company Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-container-highest/40 border border-white/5">
                    <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-1">Industry</span>
                    <span className="text-base font-semibold text-on-surface">{profile?.industry || 'Not specified'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container-highest/40 border border-white/5">
                    <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-1">Company Size</span>
                    <span className="text-base font-semibold text-on-surface">{profile?.size ? `${profile.size} Employees` : 'Not specified'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container-highest/40 border border-white/5">
                    <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-1">Website</span>
                    {profile?.website ? (
                      <a href={profile.website} target="_blank" rel="noreferrer" className="text-base font-semibold text-primary hover:underline flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[16px]">language</span>
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-base font-medium text-on-surface-variant">Not provided</span>
                    )}
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container-highest/40 border border-white/5">
                    <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-1">Headquarters</span>
                    <span className="text-base font-semibold text-on-surface">
                      {[profile?.location?.address, profile?.location?.city, profile?.location?.state, profile?.location?.country].filter(Boolean).join(', ') || 'Not specified'}
                    </span>
                  </div>
                  {profile?.cin && (
                    <div className="p-4 rounded-2xl bg-surface-container-highest/40 border border-white/5">
                      <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-1">Corporate ID (CIN)</span>
                      <span className="text-base font-semibold text-on-surface font-mono">{profile.cin}</span>
                    </div>
                  )}
                  {profile?.gstin && (
                    <div className="p-4 rounded-2xl bg-surface-container-highest/40 border border-white/5">
                      <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-1">GSTIN</span>
                      <span className="text-base font-semibold text-on-surface font-mono">{profile.gstin}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Employer: HR Representative Contact Card */}
            {isEmployer && (
              <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-title-lg font-title-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">badge</span>
                    HR Representative Details
                  </h3>
                  <button 
                    onClick={handleOpenHrModal}
                    className="text-xs font-semibold text-secondary hover:text-secondary/80 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    Edit HR
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-container-highest/40 border border-white/5">
                    <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-1">HR Name</span>
                    <span className="text-base font-semibold text-on-surface">{user?.name || 'Not set'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container-highest/40 border border-white/5">
                    <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-1">HR Email</span>
                    <span className="text-base font-semibold text-on-surface truncate block" title={user?.email}>{user?.email || 'Not set'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container-highest/40 border border-white/5">
                    <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-1">HR Phone</span>
                    <span className="text-base font-semibold text-on-surface">{user?.phone || profile?.personalInfo?.phone || 'Not set'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Role-specific Content */}
            {!isEmployer && profile?.skills && (
              <div className="bg-surface-container rounded-3xl p-8 border border-white/5 shadow-lg">
                <h3 className="text-title-lg font-title-lg text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">code</span>
                  Skills Overview
                </h3>
                
                {Object.keys(profile.skills).some(key => profile.skills[key]?.length > 0) ? (
                  <div className="space-y-6">
                    {profile.skills.programmingLanguages?.length > 0 && (
                      <div>
                        <h4 className="text-label-lg text-on-surface-variant mb-3 uppercase tracking-wider">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.programmingLanguages.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-surface-container-highest text-on-surface rounded-full text-body-sm border border-white/10">
                              {skill.name || skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.skills.frameworks?.length > 0 && (
                      <div>
                        <h4 className="text-label-lg text-on-surface-variant mb-3 uppercase tracking-wider">Frameworks</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.frameworks.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-surface-container-highest text-on-surface rounded-full text-body-sm border border-white/10">
                              {skill.name || skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-body-md text-on-surface-variant italic">No skills listed yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Quick Actions / Status */}
            <div className="bg-surface-container rounded-3xl p-6 border border-white/5 shadow-lg">
              <h3 className="text-title-md font-title-md text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">assessment</span>
                Profile Status
              </h3>

              {/* Account Status */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-highest/60 border border-white/5 mb-6">
                <span className="text-sm text-on-surface-variant font-medium">Account Status</span>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                  (isEmployer ? profile?.status : user?.isVerified) === 'approved' || profile?.isVerified
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {isEmployer ? (profile?.status || 'Pending Review') : (user?.isVerified ? 'Verified' : 'Pending')}
                </span>
              </div>
              
              {/* Progress */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface-variant">Profile Completion</span>
                  <span className="text-base font-bold text-primary">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-tertiary to-primary h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(79,219,200,0.5)]" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Completion Checklist */}
              <div className="pt-5 border-t border-white/5 space-y-2.5">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-3">
                  Completion Checklist
                </span>
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className={`flex items-center gap-2 ${item.completed ? 'text-on-surface' : 'text-on-surface-variant/60'}`}>
                      <span className={`material-symbols-outlined text-[16px] ${item.completed ? 'text-green-400' : 'text-outline'}`}>
                        {item.completed ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      {item.label}
                    </span>
                    <span className={item.completed ? 'text-green-400 font-medium' : 'text-outline'}>
                      {item.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Links */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
                <Link to={editLink} className="flex items-center gap-3 text-body-md text-on-surface hover:text-primary transition-colors p-2.5 rounded-xl hover:bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">update</span>
                  </div>
                  Update Information
                </Link>
                {isEmployer && (
                  <Link to="/employer-dashboard" className="flex items-center gap-3 text-body-md text-on-surface hover:text-secondary transition-colors p-2.5 rounded-xl hover:bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">dashboard</span>
                    </div>
                    Employer Dashboard
                  </Link>
                )}
                {!isEmployer && (
                  <Link to="/profile/preview" className="flex items-center gap-3 text-body-md text-on-surface hover:text-secondary transition-colors p-2.5 rounded-xl hover:bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </div>
                    View Public Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* HR Edit Modal */}
      {isHrModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-xl w-full max-w-md overflow-hidden flex flex-col border border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-display-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Edit HR Profile
              </h2>
              <button onClick={() => setIsHrModalOpen(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleUpdateHr} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Full Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                  value={hrFormData.name} 
                  onChange={e => setHrFormData({...hrFormData, name: e.target.value})} 
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Phone Number</label>
                <input 
                  type="text" 
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                  value={hrFormData.phone} 
                  onChange={e => setHrFormData({...hrFormData, phone: e.target.value})} 
                  placeholder="e.g. +1 234 567 8900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsHrModalOpen(false)} 
                  className="px-6 py-2.5 rounded-lg font-bold text-on-surface-variant hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-lg font-bold text-on-primary bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHub;

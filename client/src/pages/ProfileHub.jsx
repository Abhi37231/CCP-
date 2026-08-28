import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile } from '../redux/slices/profileSlice';
import LoadingScreen from '../components/LoadingScreen';
import { getMediaUrl } from '../utils/formatUrl';

const ProfileHub = () => {
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    }
  }, [dispatch, profile]);

  if (isLoading || !user) {
    return <LoadingScreen isLoading={true} />;
  }

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
    ? (profile?.location ? `${profile.location.city}, ${profile.location.country}` : 'Location not set')
    : (profile?.location ? `${profile.location.city}, ${profile.location.country}` : 'Location not set');

  const displayAbout = isEmployer
    ? (profile?.description || 'No description provided.')
    : (profile?.about?.summary || 'No summary provided.');

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-margin-desktop">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-display-sm font-display-sm text-on-background">Your Profile</h1>
          <Link 
            to={editLink} 
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            <span className="font-label-md text-label-md uppercase tracking-wider">Edit Profile</span>
          </Link>
        </div>
        
        {/* Profile Header Card */}
        <div className="bg-surface-container rounded-3xl p-8 mb-8 border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-32 h-32 rounded-full bg-surface-container-highest border-4 border-surface shadow-2xl flex items-center justify-center text-on-surface font-display-lg text-[48px] overflow-hidden">
              {profile?.personalInfo?.profilePhoto || user?.avatar ? (
                <img src={getMediaUrl(profile?.personalInfo?.profilePhoto || user?.avatar)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                displayName?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-display-sm font-bold text-on-surface mb-2">{displayName}</h2>
              <p className="text-title-md text-primary mb-4">{displayTitle}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-on-surface-variant text-body-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                  {displayLocation}
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                  {user?.email}
                </div>
                {profile?.personalInfo?.phone && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    {profile.personalInfo.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-surface-container rounded-3xl p-8 border border-white/5 shadow-lg">
              <h3 className="text-title-lg font-title-lg text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_book</span>
                {isEmployer ? 'About Company' : 'About Me'}
              </h3>
              <p className="text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {displayAbout}
              </p>
            </div>

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
              <h3 className="text-title-md font-title-md text-on-surface mb-6">Profile Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-body-md text-on-surface-variant">Profile Completion</span>
                  <span className="text-label-lg text-primary">{profile?.profileCompletion || 0}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${profile?.profileCompletion || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <Link to={editLink} className="flex items-center gap-3 text-body-md text-on-surface hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">update</span>
                  </div>
                  Update Information
                </Link>
                {!isEmployer && (
                  <Link to="/profile/preview" className="flex items-center gap-3 text-body-md text-on-surface hover:text-secondary transition-colors">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </div>
                    View Public Profile
                  </Link>
                )}
              </div>
            </div>
            
            {/* Additional info can go here later */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileHub;

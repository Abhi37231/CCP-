import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCompletionModal = ({ isOpen, onClose, user, profile, completionPercentage }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isEmployer = user?.role === 'employer';
  const targetLink = isEmployer ? '/company/edit' : '/profile/edit';
  const displayName = user?.name || (isEmployer ? profile?.name : profile?.personalInfo?.firstName) || 'User';

  // Checklist items for Job Seekers
  const jobSeekerItems = [
    { label: 'Personal Information', completed: !!profile?.personalInfo?.firstName, icon: 'person' },
    { label: 'Education Details', completed: !!(profile?.education?.length > 0), icon: 'school' },
    { label: 'Skills & Proficiencies', completed: !!(profile?.skills && Object.keys(profile.skills).some(k => profile.skills[k]?.length > 0)), icon: 'code' },
    { label: 'Projects & Experience', completed: !!(profile?.projects?.length > 0 || profile?.experience?.length > 0), icon: 'cases' },
    { label: 'Resume Upload', completed: !!profile?.resume, icon: 'description' }
  ];

  // Checklist items for Employers
  const employerItems = [
    { label: 'Company Overview & Description', completed: !!(profile?.description && profile.description !== 'New verified company registration'), icon: 'article' },
    { label: 'Company Logo', completed: !!(profile?.logo && profile.logo !== 'default-company-logo.png'), icon: 'image' },
    { label: 'Industry & Size', completed: !!(profile?.industry && profile.industry !== 'Other' && profile?.size), icon: 'domain' },
    { label: 'Office Location', completed: !!(profile?.location?.city || profile?.location?.address), icon: 'location_on' },
    { label: 'Website & Social Links', completed: !!profile?.website, icon: 'language' }
  ];

  const checklist = isEmployer ? employerItems : jobSeekerItems;
  const percent = completionPercentage || 0;

  const handleAction = () => {
    onClose();
    navigate(targetLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-surface-container rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden transition-all transform scale-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/15 via-tertiary/5 to-transparent pointer-events-none"></div>
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-highest transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-6 sm:p-8 relative z-10 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container/30 to-tertiary/20 border border-primary/30 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(77,142,255,0.25)]">
              <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isEmployer ? 'domain' : 'rocket_launch'}
              </span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-sm text-[11px] uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              {percent === 0 ? 'Fresh Registration' : 'Profile Action Required'}
            </div>

            <h2 className="font-display-lg text-[26px] md:text-[28px] text-on-surface leading-tight">
              Welcome, {displayName}!
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-2 max-w-sm">
              {isEmployer
                ? 'Complete your company profile to verify your brand, build candidate confidence, and attract top-tier tech talent.'
                : 'Complete your profile to unlock tailored AI job recommendations, get noticed by recruiters, and access ATS resume optimization.'}
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-surface-container-high/60 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
                Profile Strength
              </span>
              <span className="font-headline-md text-sm font-bold text-primary">
                {percent}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-tertiary via-primary to-secondary rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(79,219,200,0.5)]"
                style={{ width: `${Math.max(percent, 8)}%` }}
              ></div>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-1">
              Key Sections Checklist
            </span>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {checklist.map((item, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    item.completed 
                      ? 'bg-surface-container-lowest/40 border-white/5 text-on-surface opacity-75' 
                      : 'bg-surface-container-highest/40 border-primary/20 text-on-surface shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.completed ? (
                    <span className="material-symbols-outlined text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAction}
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-label-sm text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(77,142,255,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{isEmployer ? 'Complete Company Profile' : 'Complete Profile Now'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-surface-container-highest text-on-surface-variant hover:text-on-surface hover:bg-surface-bright font-label-sm text-sm transition-all cursor-pointer"
            >
              I'll do it later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;

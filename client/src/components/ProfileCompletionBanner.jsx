import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfileCompletionBanner = ({ user, profile, completionPercentage, onOpenModal }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const isEmployer = user?.role === 'employer';
  const percent = completionPercentage || 0;

  // If already at or above 80%, no banner needed
  if (percent >= 80) return null;

  const targetLink = isEmployer ? '/company/edit' : '/profile/edit';

  // Identify missing highlights
  const missingItems = [];
  if (!isEmployer) {
    if (!profile?.resume) missingItems.push('Resume');
    if (!profile?.skills || !Object.keys(profile.skills).some(k => profile.skills[k]?.length > 0)) missingItems.push('Skills');
    if (!profile?.education?.length) missingItems.push('Education');
    if (!profile?.personalInfo?.firstName) missingItems.push('Personal Details');
  } else {
    if (!profile?.logo || profile.logo === 'default-company-logo.png') missingItems.push('Logo');
    if (!profile?.description || profile.description === 'New verified company registration') missingItems.push('Description');
    if (!profile?.industry || profile.industry === 'Other') missingItems.push('Industry');
    if (!profile?.location?.city) missingItems.push('Location');
  }

  if (isDismissed) {
    return (
      <div className="w-full flex justify-end">
        <button
          onClick={() => setIsDismissed(false)}
          className="text-xs text-primary/80 hover:text-primary bg-surface-container-high/60 border border-primary/20 px-3 py-1 rounded-full flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">info</span>
          Profile Action ({percent}% complete)
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Profile completion reminder" className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high border border-primary/25 shadow-[0_4px_25px_rgba(0,0,0,0.25)] p-4 sm:p-5 transition-all">
      {/* Ambient subtle glow */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left Side: Icon & Copy */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-container/30 to-tertiary/20 border border-primary/30 flex items-center justify-center shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-primary text-[24px]">
              {isEmployer ? 'domain_verification' : 'speed'}
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-headline-md text-[16px] font-bold text-on-surface">
                {isEmployer ? 'Complete Your Company Profile' : 'Complete Your Profile to Unlock Opportunities'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-tertiary/15 text-tertiary border border-tertiary/20">
                {percent}% Completed
              </span>
            </div>

            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
              {isEmployer
                ? 'Finish setting up your organization info to build credibility with applicants and receive verified status.'
                : 'Candidates with completed profiles receive 5x more recruiter views and unlock AI Job Recommendations.'}
            </p>

            {/* Missing tags */}
            {missingItems.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <span className="text-[11px] text-on-surface-variant/75 mr-1">Missing:</span>
                {missingItems.slice(0, 3).map((item, idx) => (
                  <span 
                    key={idx} 
                    className="text-[11px] px-2 py-0.5 rounded-md bg-surface-container-highest text-primary/90 border border-white/5 font-medium"
                  >
                    + {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Progress Bar & Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end shrink-0 pt-2 lg:pt-0 border-t border-white/5 lg:border-t-0">
          {/* Progress bar pill */}
          <div className="hidden sm:flex flex-col gap-1 w-28">
            <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
              <span>Strength</span>
              <span className="text-primary font-bold">{percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-tertiary to-primary rounded-full"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenModal && (
              <button
                onClick={onOpenModal}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface hover:text-primary hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                View Checklist
              </button>
            )}

            <Link
              to={targetLink}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container text-xs font-semibold hover:shadow-[0_0_20px_rgba(77,142,255,0.3)] transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>{isEmployer ? 'Setup Company' : 'Complete Profile'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>

            <button
              onClick={() => setIsDismissed(true)}
              className="text-on-surface-variant/60 hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
              title="Minimize reminder for now"
              aria-label="Minimize reminder for now"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileCompletionBanner;

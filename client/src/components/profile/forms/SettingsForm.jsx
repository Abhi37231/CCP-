import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile } from '../../../redux/slices/profileSlice';
import { toast } from 'react-toastify';

const SettingsForm = ({ profile }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.profile);

  const [jobPreferences, setJobPreferences] = useState({
    role: profile?.jobPreferences?.role || '',
    location: profile?.jobPreferences?.location || '',
    employmentType: profile?.jobPreferences?.employmentType || 'Full-Time',
    availableFrom: profile?.jobPreferences?.availableFrom ? new Date(profile.jobPreferences.availableFrom).toISOString().substring(0, 10) : '',
  });

  const [expectedSalary, setExpectedSalary] = useState({
    currency: profile?.jobPreferences?.expectedSalary?.currency || 'INR',
    min: profile?.jobPreferences?.expectedSalary?.min || '',
    max: profile?.jobPreferences?.expectedSalary?.max || ''
  });

  const [socialLinks, setSocialLinks] = useState({
    linkedin: profile?.socialLinks?.linkedin || '',
    github: profile?.socialLinks?.github || '',
    portfolio: profile?.socialLinks?.portfolio || '',
    twitter: profile?.socialLinks?.twitter || '',
    medium: profile?.socialLinks?.medium || '',
  });

  const [codingProfiles, setCodingProfiles] = useState({
    leetcode: profile?.codingProfiles?.leetcode || '',
    codechef: profile?.codingProfiles?.codechef || '',
    codeforces: profile?.codingProfiles?.codeforces || '',
    hackerrank: profile?.codingProfiles?.hackerrank || '',
  });

  const [privacySettings, setPrivacySettings] = useState({
    phoneVisible: profile?.privacySettings?.phoneVisible ?? true,
    emailVisible: profile?.privacySettings?.emailVisible ?? true,
    resumeVisible: profile?.privacySettings?.resumeVisible ?? true,
    cgpaVisible: profile?.privacySettings?.cgpaVisible ?? true,
  });

  const [interests, setInterests] = useState(
    profile?.interests?.length > 0 ? profile.interests.join(', ') : ''
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('jobPreferences', JSON.stringify({ ...jobPreferences, expectedSalary }));
    data.append('socialLinks', JSON.stringify(socialLinks));
    data.append('codingProfiles', JSON.stringify(codingProfiles));
    data.append('privacySettings', JSON.stringify(privacySettings));
    
    const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i);
    data.append('interests', JSON.stringify(interestsArray));

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Settings & Preferences updated successfully!');
    }
  };

  const handleCheckboxChange = (e) => setPrivacySettings({ ...privacySettings, [e.target.name]: e.target.checked });

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Job Preferences */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
          <span className="material-symbols-outlined text-primary">work_outline</span>
          Job Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-6 rounded-2xl border border-white/5">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Preferred Job Role</label>
            <input type="text" name="role" value={jobPreferences.role} onChange={(e) => setJobPreferences({...jobPreferences, role: e.target.value})} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Preferred Location</label>
            <input type="text" name="location" value={jobPreferences.location} onChange={(e) => setJobPreferences({...jobPreferences, location: e.target.value})} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Employment Type</label>
            <select name="employmentType" value={jobPreferences.employmentType} onChange={(e) => setJobPreferences({...jobPreferences, employmentType: e.target.value})} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5">
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Available From</label>
            <input type="date" name="availableFrom" value={jobPreferences.availableFrom} onChange={(e) => setJobPreferences({...jobPreferences, availableFrom: e.target.value})} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 [&::-webkit-calendar-picker-indicator]:invert-[1] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100" />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
          <span className="material-symbols-outlined text-secondary">link</span>
          Social & Portfolio Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-6 rounded-2xl border border-white/5">
          {Object.keys(socialLinks).map(key => (
             <div key={key} className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider capitalize">{key}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant text-[18px]">public</span>
                  <input type="url" name={key} value={socialLinks[key]} onChange={(e) => setSocialLinks({...socialLinks, [key]: e.target.value})} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* Coding Profiles */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
          <span className="material-symbols-outlined text-tertiary">code</span>
          Coding Profiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-6 rounded-2xl border border-white/5">
          {Object.keys(codingProfiles).map(key => (
             <div key={key} className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider capitalize">{key}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant text-[18px]">terminal</span>
                  <input type="url" name={key} value={codingProfiles[key]} onChange={(e) => setCodingProfiles({...codingProfiles, [key]: e.target.value})} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
          <span className="material-symbols-outlined text-primary">interests</span>
          Interests (Tags)
        </h2>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Areas of Interest (Comma separated)</label>
            <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g. Web Development, AI/ML, Cloud Computing" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
          <span className="material-symbols-outlined text-error">security</span>
          Privacy Settings
        </h2>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 space-y-4">
          {Object.keys(privacySettings).map(key => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" name={key} checked={privacySettings[key]} onChange={handleCheckboxChange} className="w-5 h-5 appearance-none bg-surface-container-highest border border-white/20 rounded focus:ring-2 focus:ring-primary/50 checked:bg-primary checked:border-primary transition-all duration-200" />
                {privacySettings[key] && (
                  <span className="material-symbols-outlined absolute text-[16px] text-on-primary pointer-events-none left-0.5 top-0.5">check</span>
                )}
              </div>
              <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">
                Show {key.replace('Visible', '')} on public profile
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-6 flex justify-end">
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
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;

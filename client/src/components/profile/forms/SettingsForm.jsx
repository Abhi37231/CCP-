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
    currency: profile?.jobPreferences?.expectedSalary?.currency || 'USD',
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
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Job Preferences */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Job Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Job Role</label>
            <input type="text" name="role" value={jobPreferences.role} onChange={(e) => setJobPreferences({...jobPreferences, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
            <input type="text" name="location" value={jobPreferences.location} onChange={(e) => setJobPreferences({...jobPreferences, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
            <select name="employmentType" value={jobPreferences.employmentType} onChange={(e) => setJobPreferences({...jobPreferences, employmentType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
            <input type="date" name="availableFrom" value={jobPreferences.availableFrom} onChange={(e) => setJobPreferences({...jobPreferences, availableFrom: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Social & Portfolio Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(socialLinks).map(key => (
             <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                <input type="url" name={key} value={socialLinks[key]} onChange={(e) => setSocialLinks({...socialLinks, [key]: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
             </div>
          ))}
        </div>
      </div>

      {/* Coding Profiles */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Coding Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(codingProfiles).map(key => (
             <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                <input type="url" name={key} value={codingProfiles[key]} onChange={(e) => setCodingProfiles({...codingProfiles, [key]: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
             </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Interests (Tags)</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Areas of Interest (Comma separated)</label>
          <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g. Web Development, AI/ML, Cloud Computing" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
      </div>

      {/* Privacy Settings */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Privacy Settings</h2>
        <div className="space-y-3">
          {Object.keys(privacySettings).map(key => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" name={key} checked={privacySettings[key]} onChange={handleCheckboxChange} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
              <span className="text-gray-700 text-sm">
                Show {key.replace('Visible', '')} on public profile
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;

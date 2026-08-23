import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile } from '../../../redux/slices/profileSlice';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';

const AdditionalInfoForm = ({ profile }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.profile);

  const [certifications, setCertifications] = useState(
    profile?.certifications?.length > 0 ? profile.certifications : []
  );

  const [achievements, setAchievements] = useState({
    hackathons: profile?.achievements?.hackathons || [],
    codingCompetitions: profile?.achievements?.codingCompetitions || [],
    scholarships: profile?.achievements?.scholarships || [],
    awards: profile?.achievements?.awards || [],
    academic: profile?.achievements?.academic || []
  });

  const [extracurriculars, setExtracurriculars] = useState({
    clubs: profile?.extracurriculars?.clubs || [],
    volunteerWork: profile?.extracurriculars?.volunteerWork || [],
    eventManagement: profile?.extracurriculars?.eventManagement || [],
    sports: profile?.extracurriculars?.sports || [],
    cultural: profile?.extracurriculars?.cultural || []
  });

  const [languages, setLanguages] = useState(
    profile?.languagesKnown?.length > 0 ? profile.languagesKnown : []
  );

  const formatArrayForInput = (arr) => Array.isArray(arr) ? arr.join(', ') : (arr || '');

  const parseInputToArray = (val) => typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(s => s) : val;

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('certifications', JSON.stringify(certifications));
    data.append('achievements', JSON.stringify(achievements));
    data.append('extracurriculars', JSON.stringify(extracurriculars));
    data.append('languagesKnown', JSON.stringify(languages));

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Additional info updated successfully!');
    }
  };

  // Certifications Handlers
  const handleAddCert = () => setCertifications([...certifications, { name: '', issuingOrganization: '', issueDate: '', expiryDate: '', credentialId: '', verificationUrl: '' }]);
  const handleRemoveCert = (index) => {
    const list = [...certifications]; list.splice(index, 1); setCertifications(list);
  };
  const handleChangeCert = (e, index) => {
    const { name, value } = e.target;
    const list = [...certifications]; list[index][name] = value; setCertifications(list);
  };

  // Languages Handlers
  const handleAddLang = () => setLanguages([...languages, { language: '', proficiency: 'Basic' }]);
  const handleRemoveLang = (index) => {
    const list = [...languages]; list.splice(index, 1); setLanguages(list);
  };
  const handleChangeLang = (e, index) => {
    const { name, value } = e.target;
    const list = [...languages]; list[index][name] = value; setLanguages(list);
  };

  // Generic category handlers
  const handleAchievementChange = (e) => {
    setAchievements({ ...achievements, [e.target.name]: parseInputToArray(e.target.value) });
  };
  
  const handleExtraChange = (e) => {
    setExtracurriculars({ ...extracurriculars, [e.target.name]: parseInputToArray(e.target.value) });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Certifications */}
      <div>
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Certifications</h2>
          <button type="button" onClick={handleAddCert} className="flex items-center text-sm text-primary font-medium hover:text-blue-700">
            <Plus className="w-4 h-4 mr-1" /> Add Certification
          </button>
        </div>
        
        {certifications.length === 0 && <p className="text-gray-500 italic text-sm mb-4">No certifications added.</p>}

        {certifications.map((cert, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative mb-4">
            <button type="button" onClick={() => handleRemoveCert(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name</label>
                <input type="text" name="name" required value={cert.name} onChange={(e) => handleChangeCert(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                <input type="text" name="issuingOrganization" value={cert.issuingOrganization} onChange={(e) => handleChangeCert(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                  <input type="date" name="issueDate" value={cert.issueDate ? new Date(cert.issueDate).toISOString().substring(0, 10) : ''} onChange={(e) => handleChangeCert(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="date" name="expiryDate" value={cert.expiryDate ? new Date(cert.expiryDate).toISOString().substring(0, 10) : ''} onChange={(e) => handleChangeCert(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
                <input type="url" name="verificationUrl" value={cert.verificationUrl} onChange={(e) => handleChangeCert(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Languages */}
      <div>
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Languages Known</h2>
          <button type="button" onClick={handleAddLang} className="flex items-center text-sm text-primary font-medium hover:text-blue-700">
            <Plus className="w-4 h-4 mr-1" /> Add Language
          </button>
        </div>
        
        {languages.length === 0 && <p className="text-gray-500 italic text-sm mb-4">No languages added.</p>}

        {languages.map((lang, index) => (
          <div key={index} className="flex items-center gap-4 mb-3">
             <input type="text" name="language" required value={lang.language} onChange={(e) => handleChangeLang(e, index)} placeholder="e.g. English" className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
             <select name="proficiency" value={lang.proficiency} onChange={(e) => handleChangeLang(e, index)} className="w-40 px-3 py-2 border border-gray-300 rounded-md">
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
             </select>
             <button type="button" onClick={() => handleRemoveLang(index)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-5 h-5" />
             </button>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div>
         <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Achievements (Comma separated)</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Hackathons</label>
               <input type="text" name="hackathons" value={formatArrayForInput(achievements.hackathons)} onChange={handleAchievementChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Coding Competitions</label>
               <input type="text" name="codingCompetitions" value={formatArrayForInput(achievements.codingCompetitions)} onChange={handleAchievementChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Scholarships</label>
               <input type="text" name="scholarships" value={formatArrayForInput(achievements.scholarships)} onChange={handleAchievementChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Other Awards</label>
               <input type="text" name="awards" value={formatArrayForInput(achievements.awards)} onChange={handleAchievementChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
         </div>
      </div>

      {/* Extracurriculars */}
      <div>
         <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Extracurricular Activities (Comma separated)</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Clubs & Societies</label>
               <input type="text" name="clubs" value={formatArrayForInput(extracurriculars.clubs)} onChange={handleExtraChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Volunteer Work</label>
               <input type="text" name="volunteerWork" value={formatArrayForInput(extracurriculars.volunteerWork)} onChange={handleExtraChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Sports</label>
               <input type="text" name="sports" value={formatArrayForInput(extracurriculars.sports)} onChange={handleExtraChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Cultural Activities</label>
               <input type="text" name="cultural" value={formatArrayForInput(extracurriculars.cultural)} onChange={handleExtraChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
         </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save Additional Info'}
        </button>
      </div>
    </form>
  );
};

export default AdditionalInfoForm;

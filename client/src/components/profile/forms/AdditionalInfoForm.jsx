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
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Certifications */}
      <div>
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
          <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">workspace_premium</span>
            Certifications
          </h2>
          <button type="button" onClick={handleAddCert} className="flex items-center text-sm text-primary font-label-sm hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
            <Plus className="w-4 h-4 mr-1" /> Add Certification
          </button>
        </div>
        
        {certifications.length === 0 && <p className="text-on-surface-variant italic text-sm mb-4">No certifications added.</p>}

        {certifications.map((cert, index) => (
          <div key={index} className="bg-surface-container-low p-6 rounded-2xl border border-white/5 relative mb-6 shadow-lg group">
            <button type="button" onClick={() => handleRemoveCert(index)} className="absolute top-4 right-4 text-error/70 hover:text-error bg-error/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-error/20">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Certificate Name <span className="text-error">*</span></label>
                <input type="text" name="name" required value={cert.name} onChange={(e) => handleChangeCert(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Issuing Organization</label>
                <input type="text" name="issuingOrganization" value={cert.issuingOrganization} onChange={(e) => handleChangeCert(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Issue Date</label>
                  <input type="date" name="issueDate" value={cert.issueDate ? new Date(cert.issueDate).toISOString().substring(0, 10) : ''} onChange={(e) => handleChangeCert(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 [&::-webkit-calendar-picker-indicator]:invert-[1] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Expiry Date</label>
                  <input type="date" name="expiryDate" value={cert.expiryDate ? new Date(cert.expiryDate).toISOString().substring(0, 10) : ''} onChange={(e) => handleChangeCert(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 [&::-webkit-calendar-picker-indicator]:invert-[1] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Credential URL</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant text-[18px]">link</span>
                  <input type="url" name="verificationUrl" value={cert.verificationUrl} onChange={(e) => handleChangeCert(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-px bg-white/5 my-8"></div>

      {/* Languages */}
      <div>
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
          <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">translate</span>
            Languages Known
          </h2>
          <button type="button" onClick={handleAddLang} className="flex items-center text-sm text-secondary font-label-sm hover:text-secondary/80 transition-colors bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20">
            <Plus className="w-4 h-4 mr-1" /> Add Language
          </button>
        </div>
        
        {languages.length === 0 && <p className="text-on-surface-variant italic text-sm mb-4">No languages added.</p>}

        {languages.length > 0 && (
          <div className="space-y-4">
            {languages.map((lang, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-4 bg-surface-container-highest/30 p-3 rounded-xl border border-white/5">
                 <input 
                   type="text" 
                   name="language" 
                   required 
                   value={lang.language} 
                   onChange={(e) => handleChangeLang(e, index)} 
                   placeholder="e.g. English" 
                   className="flex-1 w-full sm:w-auto bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner border border-white/5" 
                 />
                 <select 
                   name="proficiency" 
                   value={lang.proficiency} 
                   onChange={(e) => handleChangeLang(e, index)} 
                   className="w-full sm:w-48 bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner border border-white/5"
                 >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                 </select>
                 <button type="button" onClick={() => handleRemoveLang(index)} className="text-error/70 hover:text-error bg-error/10 p-2 rounded-lg transition-all border border-error/20 self-end sm:self-auto w-full sm:w-auto flex justify-center">
                    <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-px bg-white/5 my-8"></div>

      {/* Achievements */}
      <div>
         <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
           <span className="material-symbols-outlined text-tertiary">emoji_events</span>
           Achievements (Comma separated)
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-6 rounded-2xl border border-white/5">
            <div className="flex flex-col gap-2">
               <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Hackathons</label>
               <input type="text" name="hackathons" value={formatArrayForInput(achievements.hackathons)} onChange={handleAchievementChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
            </div>
            <div className="flex flex-col gap-2">
               <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Coding Competitions</label>
               <input type="text" name="codingCompetitions" value={formatArrayForInput(achievements.codingCompetitions)} onChange={handleAchievementChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
            </div>
            <div className="flex flex-col gap-2">
               <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Scholarships</label>
               <input type="text" name="scholarships" value={formatArrayForInput(achievements.scholarships)} onChange={handleAchievementChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
            </div>
            <div className="flex flex-col gap-2">
               <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Other Awards</label>
               <input type="text" name="awards" value={formatArrayForInput(achievements.awards)} onChange={handleAchievementChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
            </div>
         </div>
      </div>

      <div className="w-full h-px bg-white/5 my-8"></div>

      {/* Extracurriculars */}
      <div>
         <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
           <span className="material-symbols-outlined text-primary">diversity_3</span>
           Extracurricular Activities (Comma separated)
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-6 rounded-2xl border border-white/5">
            <div className="flex flex-col gap-2">
               <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Clubs & Societies</label>
               <input type="text" name="clubs" value={formatArrayForInput(extracurriculars.clubs)} onChange={handleExtraChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
            </div>
            <div className="flex flex-col gap-2">
               <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Volunteer Work</label>
               <input type="text" name="volunteerWork" value={formatArrayForInput(extracurriculars.volunteerWork)} onChange={handleExtraChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
            </div>
            <div className="flex flex-col gap-2">
               <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Sports</label>
               <input type="text" name="sports" value={formatArrayForInput(extracurriculars.sports)} onChange={handleExtraChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
            </div>
            <div className="flex flex-col gap-2">
               <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Cultural Activities</label>
               <input type="text" name="cultural" value={formatArrayForInput(extracurriculars.cultural)} onChange={handleExtraChange} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
            </div>
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
              Save Additional Info
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AdditionalInfoForm;

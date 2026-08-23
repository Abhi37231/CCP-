import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile } from '../../../redux/slices/profileSlice';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';

const ExperienceForm = ({ profile }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.profile);

  const [internships, setInternships] = useState(
    profile?.internships?.length > 0 ? profile.internships : []
  );

  const [experience, setExperience] = useState(
    profile?.experience?.length > 0 ? profile.experience : []
  );

  const handleAddInternship = () => {
    setInternships([...internships, { company: '', role: '', duration: '', location: '', description: '', technologiesUsed: '' }]);
  };

  const handleRemoveInternship = (index) => {
    const list = [...internships];
    list.splice(index, 1);
    setInternships(list);
  };

  const handleChangeInternship = (e, index) => {
    const { name, value } = e.target;
    const list = [...internships];
    list[index][name] = value;
    setInternships(list);
  };

  const handleAddExperience = () => {
    setExperience([...experience, { company: '', title: '', duration: '', responsibilities: '', skillsUsed: '' }]);
  };

  const handleRemoveExperience = (index) => {
    const list = [...experience];
    list.splice(index, 1);
    setExperience(list);
  };

  const handleChangeExperience = (e, index) => {
    const { name, value } = e.target;
    const list = [...experience];
    list[index][name] = value;
    setExperience(list);
  };

  const formatArrayForInput = (arr) => Array.isArray(arr) ? arr.join(', ') : (arr || '');

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    const formattedInternships = internships.map(item => ({
      ...item,
      technologiesUsed: typeof item.technologiesUsed === 'string' ? item.technologiesUsed.split(',').map(t => t.trim()) : item.technologiesUsed
    }));

    const formattedExperience = experience.map(item => ({
      ...item,
      skillsUsed: typeof item.skillsUsed === 'string' ? item.skillsUsed.split(',').map(t => t.trim()) : item.skillsUsed
    }));

    data.append('internships', JSON.stringify(formattedInternships));
    data.append('experience', JSON.stringify(formattedExperience));

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Experience details updated successfully!');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Internships Section */}
      <div>
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
          <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">work_history</span>
            Internship Experience
          </h2>
          <button type="button" onClick={handleAddInternship} className="flex items-center text-sm text-secondary font-label-sm hover:text-secondary/80 transition-colors bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20">
            <Plus className="w-4 h-4 mr-1" /> Add Internship
          </button>
        </div>

        {internships.length === 0 && <p className="text-on-surface-variant italic text-sm mb-4">No internships added.</p>}

        {internships.map((internship, index) => (
          <div key={index} className="bg-surface-container-low p-6 rounded-2xl border border-white/5 relative mb-6 shadow-lg group">
            <button type="button" onClick={() => handleRemoveInternship(index)} className="absolute top-4 right-4 text-error/70 hover:text-error bg-error/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-error/20">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Company <span className="text-error">*</span></label>
                <input type="text" name="company" required value={internship.company} onChange={(e) => handleChangeInternship(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Role <span className="text-error">*</span></label>
                <input type="text" name="role" required value={internship.role} onChange={(e) => handleChangeInternship(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Duration</label>
                <input type="text" name="duration" value={internship.duration} onChange={(e) => handleChangeInternship(e, index)} placeholder="e.g. 3 Months, May 2023 - Jul 2023" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 placeholder-on-surface-variant/50" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Location</label>
                <input type="text" name="location" value={internship.location} onChange={(e) => handleChangeInternship(e, index)} placeholder="e.g. Remote, Bangalore" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 placeholder-on-surface-variant/50" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Technologies Used (Comma separated)</label>
                <input type="text" name="technologiesUsed" value={formatArrayForInput(internship.technologiesUsed)} onChange={(e) => handleChangeInternship(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Description</label>
                <textarea name="description" value={internship.description} onChange={(e) => handleChangeInternship(e, index)} rows="3" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-px bg-white/5 my-8"></div>

      {/* Work Experience Section */}
      <div>
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
          <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">work</span>
            Work Experience (Optional)
          </h2>
          <button type="button" onClick={handleAddExperience} className="flex items-center text-sm text-tertiary font-label-sm hover:text-tertiary/80 transition-colors bg-tertiary/10 px-3 py-1.5 rounded-lg border border-tertiary/20">
            <Plus className="w-4 h-4 mr-1" /> Add Experience
          </button>
        </div>

        {experience.length === 0 && <p className="text-on-surface-variant italic text-sm mb-4">No work experience added.</p>}

        {experience.map((exp, index) => (
          <div key={index} className="bg-surface-container-low p-6 rounded-2xl border border-white/5 relative mb-6 shadow-lg group">
            <button type="button" onClick={() => handleRemoveExperience(index)} className="absolute top-4 right-4 text-error/70 hover:text-error bg-error/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-error/20">
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Company <span className="text-error">*</span></label>
                <input type="text" name="company" required value={exp.company} onChange={(e) => handleChangeExperience(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Job Title <span className="text-error">*</span></label>
                <input type="text" name="title" required value={exp.title} onChange={(e) => handleChangeExperience(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Duration</label>
                <input type="text" name="duration" value={exp.duration} onChange={(e) => handleChangeExperience(e, index)} placeholder="e.g. Jan 2021 - Present" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 placeholder-on-surface-variant/50" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Skills Used (Comma separated)</label>
                <input type="text" name="skillsUsed" value={formatArrayForInput(exp.skillsUsed)} onChange={(e) => handleChangeExperience(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Responsibilities</label>
                <textarea name="responsibilities" value={exp.responsibilities} onChange={(e) => handleChangeExperience(e, index)} rows="3" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"></textarea>
              </div>
            </div>
          </div>
        ))}
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
              Save Experience
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ExperienceForm;

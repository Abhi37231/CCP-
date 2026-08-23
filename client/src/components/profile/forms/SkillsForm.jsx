import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile } from '../../../redux/slices/profileSlice';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';

const emptySkill = { name: '', proficiency: 'Beginner' };

const SkillsForm = ({ profile }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.profile);

  const [skills, setSkills] = useState({
    programmingLanguages: profile?.skills?.programmingLanguages || [],
    frameworks: profile?.skills?.frameworks || [],
    databases: profile?.skills?.databases || [],
    tools: profile?.skills?.tools || [],
    cloudDevOps: profile?.skills?.cloudDevOps || [],
    softSkills: profile?.skills?.softSkills || [],
  });

  const handleAdd = (category) => {
    setSkills({ ...skills, [category]: [...skills[category], { ...emptySkill }] });
  };

  const handleRemove = (category, index) => {
    const updatedCategory = [...skills[category]];
    updatedCategory.splice(index, 1);
    setSkills({ ...skills, [category]: updatedCategory });
  };

  const handleChange = (e, category, index) => {
    const { name, value } = e.target;
    const updatedCategory = [...skills[category]];
    updatedCategory[index][name] = value;
    setSkills({ ...skills, [category]: updatedCategory });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('skills', JSON.stringify(skills));

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Skills updated successfully!');
    }
  };

  const renderSkillCategory = (title, categoryKey, iconClass, colorTheme) => {
    // Generate color theme classes dynamically or fallback to primary
    const themeClasses = {
      primary: {
        text: 'text-primary',
        bg: 'bg-primary/10',
        border: 'border-primary/20',
        hover: 'hover:text-primary/80',
        ring: 'focus:ring-primary/50'
      },
      secondary: {
        text: 'text-secondary',
        bg: 'bg-secondary/10',
        border: 'border-secondary/20',
        hover: 'hover:text-secondary/80',
        ring: 'focus:ring-secondary/50'
      },
      tertiary: {
        text: 'text-tertiary',
        bg: 'bg-tertiary/10',
        border: 'border-tertiary/20',
        hover: 'hover:text-tertiary/80',
        ring: 'focus:ring-tertiary/50'
      },
      error: {
        text: 'text-error',
        bg: 'bg-error/10',
        border: 'border-error/20',
        hover: 'hover:text-error/80',
        ring: 'focus:ring-error/50'
      }
    };
    
    const theme = themeClasses[colorTheme] || themeClasses.primary;

    return (
      <div className="mb-6 bg-surface-container-low p-6 rounded-2xl border border-white/5 relative shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`font-headline-sm text-label-lg ${theme.text} flex items-center gap-2`}>
            <span className="material-symbols-outlined text-[20px]">{iconClass}</span>
            {title}
          </h3>
          <button type="button" onClick={() => handleAdd(categoryKey)} className={`flex items-center text-sm ${theme.text} font-label-sm ${theme.hover} transition-colors ${theme.bg} px-3 py-1.5 rounded-lg border ${theme.border}`}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </button>
        </div>
        
        {skills[categoryKey].length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">No skills added yet.</p>
        ) : (
          <div className="space-y-4">
            {skills[categoryKey].map((skill, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-4 bg-surface-container-highest/30 p-3 rounded-xl border border-white/5">
                <input 
                  type="text" 
                  name="name" 
                  value={skill.name} 
                  onChange={(e) => handleChange(e, categoryKey, index)} 
                  placeholder="Skill name" 
                  className={`flex-1 w-full sm:w-auto bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-2 outline-none focus:ring-2 ${theme.ring} focus:bg-surface-bright transition-all shadow-inner border border-white/5`} 
                  required 
                />
                <select 
                  name="proficiency" 
                  value={skill.proficiency} 
                  onChange={(e) => handleChange(e, categoryKey, index)} 
                  className={`w-full sm:w-48 bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-2 outline-none focus:ring-2 ${theme.ring} focus:bg-surface-bright transition-all shadow-inner border border-white/5`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button type="button" onClick={() => handleRemove(categoryKey, index)} className="text-error/70 hover:text-error bg-error/10 p-2 rounded-lg transition-all border border-error/20 self-end sm:self-auto w-full sm:w-auto flex justify-center">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="border-b border-white/5 pb-4 mb-6">
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">psychology</span>
          Technical & Soft Skills
        </h2>
      </div>
      
      {renderSkillCategory('Programming Languages', 'programmingLanguages', 'code', 'primary')}
      {renderSkillCategory('Frameworks & Libraries', 'frameworks', 'library_books', 'secondary')}
      {renderSkillCategory('Databases', 'databases', 'database', 'tertiary')}
      {renderSkillCategory('Tools & Technologies', 'tools', 'build', 'primary')}
      {renderSkillCategory('Cloud & DevOps', 'cloudDevOps', 'cloud', 'secondary')}
      {renderSkillCategory('Soft Skills', 'softSkills', 'groups', 'tertiary')}

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
              Save Skills
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SkillsForm;

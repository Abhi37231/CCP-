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

  const renderSkillCategory = (title, categoryKey) => (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <button type="button" onClick={() => handleAdd(categoryKey)} className="flex items-center text-xs text-primary font-medium hover:text-blue-700">
          <Plus className="w-3 h-3 mr-1" /> Add
        </button>
      </div>
      
      {skills[categoryKey].length === 0 ? (
        <p className="text-sm text-gray-400 italic">No skills added yet.</p>
      ) : (
        <div className="space-y-3">
          {skills[categoryKey].map((skill, index) => (
            <div key={index} className="flex items-center gap-3">
              <input type="text" name="name" value={skill.name} onChange={(e) => handleChange(e, categoryKey, index)} placeholder="Skill name" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-primary focus:border-primary" required />
              <select name="proficiency" value={skill.proficiency} onChange={(e) => handleChange(e, categoryKey, index)} className="w-36 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-primary focus:border-primary">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button type="button" onClick={() => handleRemove(categoryKey, index)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Technical & Soft Skills</h2>
      
      {renderSkillCategory('Programming Languages', 'programmingLanguages')}
      {renderSkillCategory('Frameworks & Libraries', 'frameworks')}
      {renderSkillCategory('Databases', 'databases')}
      {renderSkillCategory('Tools & Technologies', 'tools')}
      {renderSkillCategory('Cloud & DevOps', 'cloudDevOps')}
      {renderSkillCategory('Soft Skills', 'softSkills')}

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save Skills'}
        </button>
      </div>
    </form>
  );
};

export default SkillsForm;

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
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Internships Section */}
      <div>
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Internship Experience</h2>
          <button type="button" onClick={handleAddInternship} className="flex items-center text-sm text-primary font-medium hover:text-blue-700">
            <Plus className="w-4 h-4 mr-1" /> Add Internship
          </button>
        </div>

        {internships.length === 0 && <p className="text-gray-500 italic text-sm">No internships added.</p>}

        {internships.map((internship, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative mb-4">
            <button type="button" onClick={() => handleRemoveInternship(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" name="company" required value={internship.company} onChange={(e) => handleChangeInternship(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input type="text" name="role" required value={internship.role} onChange={(e) => handleChangeInternship(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input type="text" name="duration" value={internship.duration} onChange={(e) => handleChangeInternship(e, index)} placeholder="e.g. 3 Months, May 2023 - Jul 2023" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={internship.location} onChange={(e) => handleChangeInternship(e, index)} placeholder="e.g. Remote, Bangalore" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                <input type="text" name="technologiesUsed" value={formatArrayForInput(internship.technologiesUsed)} onChange={(e) => handleChangeInternship(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={internship.description} onChange={(e) => handleChangeInternship(e, index)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Work Experience Section */}
      <div>
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Work Experience (Optional)</h2>
          <button type="button" onClick={handleAddExperience} className="flex items-center text-sm text-primary font-medium hover:text-blue-700">
            <Plus className="w-4 h-4 mr-1" /> Add Experience
          </button>
        </div>

        {experience.length === 0 && <p className="text-gray-500 italic text-sm">No work experience added.</p>}

        {experience.map((exp, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative mb-4">
            <button type="button" onClick={() => handleRemoveExperience(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" name="company" required value={exp.company} onChange={(e) => handleChangeExperience(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input type="text" name="title" required value={exp.title} onChange={(e) => handleChangeExperience(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input type="text" name="duration" value={exp.duration} onChange={(e) => handleChangeExperience(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Used</label>
                <input type="text" name="skillsUsed" value={formatArrayForInput(exp.skillsUsed)} onChange={(e) => handleChangeExperience(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                <textarea name="responsibilities" value={exp.responsibilities} onChange={(e) => handleChangeExperience(e, index)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save Experience'}
        </button>
      </div>
    </form>
  );
};

export default ExperienceForm;

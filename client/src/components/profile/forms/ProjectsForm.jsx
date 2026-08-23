import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile } from '../../../redux/slices/profileSlice';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';

const ProjectsForm = ({ profile }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.profile);

  const [projectsList, setProjectsList] = useState(
    profile?.projects?.length > 0 ? profile.projects : [
      { title: '', description: '', technologiesUsed: '', role: '', duration: '', githubUrl: '', liveUrl: '', keyFeatures: '', challengesFaced: '', learnings: '' }
    ]
  );

  const handleAdd = () => {
    setProjectsList([...projectsList, { title: '', description: '', technologiesUsed: '', role: '', duration: '', githubUrl: '', liveUrl: '', keyFeatures: '', challengesFaced: '', learnings: '' }]);
  };

  const handleRemove = (index) => {
    const list = [...projectsList];
    list.splice(index, 1);
    setProjectsList(list);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...projectsList];
    list[index][name] = value;
    setProjectsList(list);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Arrays in project need to be split by comma before sending, or we can just keep them as comma-separated strings in UI and split here
    const formattedProjects = projectsList.map(proj => ({
      ...proj,
      technologiesUsed: typeof proj.technologiesUsed === 'string' ? proj.technologiesUsed.split(',').map(t => t.trim()) : proj.technologiesUsed,
      keyFeatures: typeof proj.keyFeatures === 'string' ? proj.keyFeatures.split('\n').filter(f => f.trim()) : proj.keyFeatures
    }));

    data.append('projects', JSON.stringify(formattedProjects));

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Projects updated successfully!');
    }
  };

  const formatArrayForInput = (arr) => {
    if (Array.isArray(arr)) {
      return arr.join(', ');
    }
    return arr || '';
  };

  const formatListForTextarea = (arr) => {
    if (Array.isArray(arr)) {
      return arr.join('\n');
    }
    return arr || '';
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
        <button type="button" onClick={handleAdd} className="flex items-center text-sm text-primary font-medium hover:text-blue-700">
          <Plus className="w-4 h-4 mr-1" /> Add Project
        </button>
      </div>

      {projectsList.map((project, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative mb-6">
          {projectsList.length > 1 && (
            <button type="button" onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <input type="text" name="title" required value={project.title} onChange={(e) => handleChange(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role (Optional)</label>
              <input type="text" name="role" value={project.role} onChange={(e) => handleChange(e, index)} placeholder="e.g. Frontend Developer" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used (Comma separated)</label>
              <input type="text" name="technologiesUsed" value={formatArrayForInput(project.technologiesUsed)} onChange={(e) => handleChange(e, index)} placeholder="e.g. React, Node.js, MongoDB" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input type="text" name="duration" value={project.duration} onChange={(e) => handleChange(e, index)} placeholder="e.g. Jan 2023 - Mar 2023" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input type="url" name="githubUrl" value={project.githubUrl} onChange={(e) => handleChange(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL</label>
              <input type="url" name="liveUrl" value={project.liveUrl} onChange={(e) => handleChange(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={project.description} onChange={(e) => handleChange(e, index)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (One per line)</label>
              <textarea name="keyFeatures" value={formatListForTextarea(project.keyFeatures)} onChange={(e) => handleChange(e, index)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Challenges Faced</label>
                  <textarea name="challengesFaced" value={project.challengesFaced} onChange={(e) => handleChange(e, index)} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"></textarea>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Learnings</label>
                  <textarea name="learnings" value={project.learnings} onChange={(e) => handleChange(e, index)} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"></textarea>
               </div>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save Projects'}
        </button>
      </div>
    </form>
  );
};

export default ProjectsForm;

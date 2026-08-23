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
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">rocket_launch</span>
          Projects
        </h2>
        <button type="button" onClick={handleAdd} className="flex items-center text-sm text-primary font-label-sm hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
          <Plus className="w-4 h-4 mr-1" /> Add Project
        </button>
      </div>

      {projectsList.length === 0 && <p className="text-on-surface-variant italic text-sm mb-4">No projects added yet.</p>}

      {projectsList.map((project, index) => (
        <div key={index} className="bg-surface-container-low p-6 rounded-2xl border border-white/5 relative mb-8 shadow-lg group">
          {projectsList.length > 1 && (
            <button type="button" onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-error/70 hover:text-error bg-error/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-error/20">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Project Title <span className="text-error">*</span></label>
              <input type="text" name="title" required value={project.title} onChange={(e) => handleChange(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Role (Optional)</label>
              <input type="text" name="role" value={project.role} onChange={(e) => handleChange(e, index)} placeholder="e.g. Frontend Developer" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 placeholder-on-surface-variant/50" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Technologies Used (Comma separated)</label>
              <input type="text" name="technologiesUsed" value={formatArrayForInput(project.technologiesUsed)} onChange={(e) => handleChange(e, index)} placeholder="e.g. React, Node.js, MongoDB" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 placeholder-on-surface-variant/50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Duration</label>
              <input type="text" name="duration" value={project.duration} onChange={(e) => handleChange(e, index)} placeholder="e.g. Jan 2023 - Mar 2023" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 placeholder-on-surface-variant/50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">GitHub URL</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant text-[18px]">code</span>
                <input type="url" name="githubUrl" value={project.githubUrl} onChange={(e) => handleChange(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Live Demo URL</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant text-[18px]">language</span>
                <input type="url" name="liveUrl" value={project.liveUrl} onChange={(e) => handleChange(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Description</label>
              <textarea name="description" value={project.description} onChange={(e) => handleChange(e, index)} rows="3" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"></textarea>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Key Features (One per line)</label>
              <textarea name="keyFeatures" value={formatListForTextarea(project.keyFeatures)} onChange={(e) => handleChange(e, index)} rows="3" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"></textarea>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Challenges Faced</label>
                  <textarea name="challengesFaced" value={project.challengesFaced} onChange={(e) => handleChange(e, index)} rows="2" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"></textarea>
               </div>
               <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Learnings</label>
                  <textarea name="learnings" value={project.learnings} onChange={(e) => handleChange(e, index)} rows="2" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"></textarea>
               </div>
            </div>
          </div>
        </div>
      ))}

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
              Save Projects
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectsForm;

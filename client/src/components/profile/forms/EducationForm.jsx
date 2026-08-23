import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile } from '../../../redux/slices/profileSlice';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';

const EducationForm = ({ profile }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.profile);

  const [educationList, setEducationList] = useState(
    profile?.education?.length > 0 ? profile.education : [
      { institution: '', degree: '', branch: '', board: '', startYear: '', endYear: '', currentSemester: '', cgpa: '', percentage: '', status: 'Completed' }
    ]
  );

  const handleAdd = () => {
    setEducationList([...educationList, { institution: '', degree: '', branch: '', board: '', startYear: '', endYear: '', currentSemester: '', cgpa: '', percentage: '', status: 'Completed' }]);
  };

  const handleRemove = (index) => {
    const list = [...educationList];
    list.splice(index, 1);
    setEducationList(list);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...educationList];
    list[index][name] = value;
    setEducationList(list);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('education', JSON.stringify(educationList));

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Education info updated successfully!');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-2">
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">school</span>
          Education Details
        </h2>
        <button type="button" onClick={handleAdd} className="flex items-center text-sm text-primary font-label-sm hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
          <Plus className="w-4 h-4 mr-1" /> Add Education
        </button>
      </div>

      {educationList.map((edu, index) => (
        <div key={index} className="bg-surface-container-low p-6 rounded-2xl border border-white/5 relative shadow-lg group">
          {educationList.length > 1 && (
            <button type="button" onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-error/70 hover:text-error bg-error/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-error/20">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Institution/College/School <span className="text-error">*</span></label>
              <input type="text" name="institution" required value={edu.institution} onChange={(e) => handleChange(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Degree/Class <span className="text-error">*</span></label>
              <input type="text" name="degree" required value={edu.degree} onChange={(e) => handleChange(e, index)} placeholder="e.g. B.Tech, 12th, 10th" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 placeholder-on-surface-variant/50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Branch/Specialization</label>
              <input type="text" name="branch" value={edu.branch} onChange={(e) => handleChange(e, index)} placeholder="e.g. Computer Science" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 placeholder-on-surface-variant/50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Board (If applicable)</label>
              <input type="text" name="board" value={edu.board} onChange={(e) => handleChange(e, index)} placeholder="e.g. CBSE, State Board" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 placeholder-on-surface-variant/50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Status</label>
              <select name="status" value={edu.status} onChange={(e) => handleChange(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5">
                <option value="Completed">Completed</option>
                <option value="Pursuing">Pursuing</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Start Year</label>
                <input type="number" name="startYear" value={edu.startYear} onChange={(e) => handleChange(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">End Year</label>
                <input type="number" name="endYear" value={edu.endYear} onChange={(e) => handleChange(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Semester</label>
                <input type="number" name="currentSemester" value={edu.currentSemester} onChange={(e) => handleChange(e, index)} placeholder="e.g. 7" className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 placeholder-on-surface-variant/50" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">CGPA</label>
                <input type="number" step="0.01" name="cgpa" value={edu.cgpa} onChange={(e) => handleChange(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Percentage</label>
                <input type="number" step="0.1" name="percentage" value={edu.percentage} onChange={(e) => handleChange(e, index)} className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5" />
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
              Save Education
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EducationForm;

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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Education Details</h2>
        <button type="button" onClick={handleAdd} className="flex items-center text-sm text-primary font-medium hover:text-blue-700">
          <Plus className="w-4 h-4 mr-1" /> Add Education
        </button>
      </div>

      {educationList.map((edu, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative mb-4">
          {educationList.length > 1 && (
            <button type="button" onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution/College/School</label>
              <input type="text" name="institution" required value={edu.institution} onChange={(e) => handleChange(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree/Class</label>
              <input type="text" name="degree" required value={edu.degree} onChange={(e) => handleChange(e, index)} placeholder="e.g. B.Tech, 12th, 10th" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch/Specialization</label>
              <input type="text" name="branch" value={edu.branch} onChange={(e) => handleChange(e, index)} placeholder="e.g. Computer Science" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Board (If applicable)</label>
              <input type="text" name="board" value={edu.board} onChange={(e) => handleChange(e, index)} placeholder="e.g. CBSE, State Board" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={edu.status} onChange={(e) => handleChange(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                <option value="Completed">Completed</option>
                <option value="Pursuing">Pursuing</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                <input type="number" name="startYear" value={edu.startYear} onChange={(e) => handleChange(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                <input type="number" name="endYear" value={edu.endYear} onChange={(e) => handleChange(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input type="number" name="currentSemester" value={edu.currentSemester} onChange={(e) => handleChange(e, index)} placeholder="e.g. 7" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                <input type="number" step="0.01" name="cgpa" value={edu.cgpa} onChange={(e) => handleChange(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                <input type="number" step="0.1" name="percentage" value={edu.percentage} onChange={(e) => handleChange(e, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save Education'}
        </button>
      </div>
    </form>
  );
};

export default EducationForm;

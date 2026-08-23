import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile } from '../../../redux/slices/profileSlice';
import { toast } from 'react-toastify';

const ProfessionalDetailsForm = ({ profile }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    currentCompany: '',
    currentDesignation: '',
    totalExperienceYears: '',
    noticePeriodDays: '',
    currentSalary: ''
  });

  useEffect(() => {
    if (profile?.professionalDetails) {
      setFormData({
        currentCompany: profile.professionalDetails.currentCompany || '',
        currentDesignation: profile.professionalDetails.currentDesignation || '',
        totalExperienceYears: profile.professionalDetails.totalExperienceYears || '',
        noticePeriodDays: profile.professionalDetails.noticePeriodDays || '',
        currentSalary: profile.professionalDetails.currentSalary || ''
      });
    }
  }, [profile]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Add professional details to FormData
    data.append('professionalDetails.currentCompany', formData.currentCompany);
    data.append('professionalDetails.currentDesignation', formData.currentDesignation);
    data.append('professionalDetails.totalExperienceYears', formData.totalExperienceYears);
    data.append('professionalDetails.noticePeriodDays', formData.noticePeriodDays);
    data.append('professionalDetails.currentSalary', formData.currentSalary);

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Professional Details updated successfully!');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Professional Details</h2>
        <p className="text-gray-500 text-sm mt-1">Please provide your current professional status. These fields are strictly required for experienced candidates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="currentCompany"
            value={formData.currentCompany}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g. Google"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Designation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="currentDesignation"
            value={formData.currentDesignation}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g. Software Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Experience (Years) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            name="totalExperienceYears"
            value={formData.totalExperienceYears}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g. 3.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notice Period (Days) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            name="noticePeriodDays"
            value={formData.noticePeriodDays}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g. 30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Salary (LPA) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            name="currentSalary"
            value={formData.currentSalary}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g. 15.5"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Professional Details'}
        </button>
      </div>
    </form>
  );
};

export default ProfessionalDetailsForm;

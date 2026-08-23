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
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="border-b border-white/5 pb-4 mb-6">
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">work</span>
          Professional Details
        </h2>
        <p className="text-on-surface-variant text-sm mt-2 ml-8">Please provide your current professional status. These fields are strictly required for experienced candidates.</p>
      </div>

      <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Current Company <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="currentCompany"
              value={formData.currentCompany}
              onChange={onChange}
              required
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
              placeholder="e.g. Google"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Current Designation <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="currentDesignation"
              value={formData.currentDesignation}
              onChange={onChange}
              required
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
              placeholder="e.g. Software Engineer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Total Experience (Years) <span className="text-error">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              name="totalExperienceYears"
              value={formData.totalExperienceYears}
              onChange={onChange}
              required
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
              placeholder="e.g. 3.5"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Notice Period (Days) <span className="text-error">*</span>
            </label>
            <input
              type="number"
              min="0"
              name="noticePeriodDays"
              value={formData.noticePeriodDays}
              onChange={onChange}
              required
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
              placeholder="e.g. 30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Current Salary (LPA) <span className="text-error">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              name="currentSalary"
              value={formData.currentSalary}
              onChange={onChange}
              required
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
              placeholder="e.g. 15.5"
            />
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
              Save Professional Details
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfessionalDetailsForm;

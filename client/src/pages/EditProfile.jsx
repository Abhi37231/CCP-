import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile, getProfile, clearProfileError } from '../redux/slices/profileSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, error } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    about: '',
    skills: '',
    city: '',
    state: '',
    country: '',
    currentCompany: '',
    currentDesignation: '',
    totalExperienceYears: '',
    noticePeriodDays: '',
    currentSalary: ''
  });
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    } else {
      setFormData({
        about: profile.about || '',
        skills: profile.skills ? profile.skills.join(', ') : '',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || '',
        currentCompany: profile.professionalDetails?.currentCompany || '',
        currentDesignation: profile.professionalDetails?.currentDesignation || '',
        totalExperienceYears: profile.professionalDetails?.totalExperienceYears || '',
        noticePeriodDays: profile.professionalDetails?.noticePeriodDays || '',
        currentSalary: profile.professionalDetails?.currentSalary || ''
      });
    }
  }, [profile, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProfileError());
    }
  }, [error, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onFileChange = (e) => setResume(e.target.files[0]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (user?.experienceLevel === 'experienced') {
      if (!formData.currentCompany || !formData.currentDesignation || !formData.totalExperienceYears || !formData.noticePeriodDays || !formData.currentSalary) {
        toast.error('Please fill in all required Professional Details.');
        return;
      }
    }

    const data = new FormData();
    data.append('about', formData.about);
    data.append('skills', formData.skills);
    data.append('location.city', formData.city);
    data.append('location.state', formData.state);
    data.append('location.country', formData.country);
    if (user?.experienceLevel === 'experienced') {
      data.append('professionalDetails.currentCompany', formData.currentCompany);
      data.append('professionalDetails.currentDesignation', formData.currentDesignation);
      data.append('professionalDetails.totalExperienceYears', formData.totalExperienceYears);
      data.append('professionalDetails.noticePeriodDays', formData.noticePeriodDays);
      data.append('professionalDetails.currentSalary', formData.currentSalary);
    }
    if (resume) {
      data.append('file', resume);
    }

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={onSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">About Me</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={onChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Tell employers about yourself"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Skills (Comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="e.g. JavaScript, React, Node.js"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Resume (PDF/DOC)</label>
            <input
              type="file"
              name="resume"
              onChange={onFileChange}
              accept=".pdf,.doc,.docx"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
            />
            {profile?.resume && (
              <p className="mt-2 text-sm text-green-600">Current Resume: {profile.resume.split('-').pop()}</p>
            )}
          </div>

          {user?.experienceLevel === 'experienced' && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Company <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Designation <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="currentDesignation"
                    value={formData.currentDesignation}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Experience (Years) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.1"
                    name="totalExperienceYears"
                    value={formData.totalExperienceYears}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notice Period (Days) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="noticePeriodDays"
                    value={formData.noticePeriodDays}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Salary (LPA) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="currentSalary"
                    value={formData.currentSalary}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none"
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

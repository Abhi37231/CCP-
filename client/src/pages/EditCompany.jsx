import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile, getProfile, clearProfileError } from '../redux/slices/profileSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, error } = useSelector((state) => state.profile);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: '1-10',
    city: '',
    state: '',
    country: ''
  });
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    } else {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        website: profile.website || '',
        industry: profile.industry || '',
        size: profile.size || '1-10',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || ''
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
  const onFileChange = (e) => setLogo(e.target.files[0]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('website', formData.website);
    data.append('industry', formData.industry);
    data.append('size', formData.size);
    data.append('location.city', formData.city);
    data.append('location.state', formData.state);
    data.append('location.country', formData.country);
    if (logo) {
      data.append('file', logo);
    }

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Company profile updated successfully!');
      navigate('/employer-dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Setup Company Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={onSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website URL</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={onChange}
                placeholder="https://example.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Description *</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={onChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              placeholder="What does your company do?"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry *</label>
              <input
                type="text"
                name="industry"
                required
                value={formData.industry}
                onChange={onChange}
                placeholder="e.g. Information Technology"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              >
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="501-1000">501-1000 Employees</option>
                <option value="1000+">1000+ Employees</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" name="city" value={formData.city} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input type="text" name="state" value={formData.state} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input type="text" name="country" value={formData.country} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Logo (Image)</label>
            <input
              type="file"
              name="logo"
              onChange={onFileChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {profile?.logo && profile.logo !== 'default-company-logo.png' && (
              <img src={`http://localhost:5000${profile.logo}`} alt="Logo preview" className="mt-2 h-16 w-16 object-cover rounded border" />
            )}
          </div>

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
              onClick={() => navigate('/employer-dashboard')}
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

export default EditCompany;

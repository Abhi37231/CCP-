import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile } from '../../../redux/slices/profileSlice';
import { toast } from 'react-toastify';
import { Upload } from 'lucide-react';

const PersonalInfoForm = ({ profile }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    firstName: profile?.personalInfo?.firstName || '',
    lastName: profile?.personalInfo?.lastName || '',
    headline: profile?.personalInfo?.headline || '',
    phone: profile?.personalInfo?.phone || '',
    dob: profile?.personalInfo?.dob ? new Date(profile.personalInfo.dob).toISOString().substring(0, 10) : '',
    gender: profile?.personalInfo?.gender || '',
    about: profile?.about || '',
    city: profile?.location?.city || '',
    state: profile?.location?.state || '',
    country: profile?.location?.country || '',
  });

  const [resume, setResume] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onFileChange = (e) => {
    if (e.target.name === 'resume') setResume(e.target.files[0]);
    if (e.target.name === 'profilePhoto') setProfilePhoto(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const personalInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      headline: formData.headline,
      phone: formData.phone,
      dob: formData.dob || undefined,
      gender: formData.gender,
      // Preserve existing photo url if not uploading a new one, but photo is handled via files anyway.
      // Wait, we need to preserve the old photo url if we don't upload a new one.
      profilePhoto: profile?.personalInfo?.profilePhoto
    };
    
    data.append('personalInfo', JSON.stringify(personalInfo));
    data.append('location', JSON.stringify({ city: formData.city, state: formData.state, country: formData.country }));
    data.append('about', formData.about);

    if (resume) data.append('resume', resume);
    if (profilePhoto) data.append('profilePhoto', profilePhoto);

    const result = await dispatch(createOrUpdateProfile(data));
    if (createOrUpdateProfile.fulfilled.match(result)) {
      toast.success('Personal info updated successfully!');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Basic Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline</label>
          <input type="text" name="headline" value={formData.headline} onChange={onChange} placeholder="e.g. Aspiring Full Stack Developer | Final Year CS Student" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select name="gender" value={formData.gender} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800 border-b pb-2">Location</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input type="text" name="city" value={formData.city} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input type="text" name="state" value={formData.state} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input type="text" name="country" value={formData.country} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800 border-b pb-2">Professional Summary</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">About Me / Career Objective</label>
        <textarea name="about" value={formData.about} onChange={onChange} rows="4" placeholder="Briefly describe your career objectives and background..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"></textarea>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800 border-b pb-2">Uploads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center hover:bg-gray-50 transition">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <label className="block text-sm font-medium text-primary cursor-pointer">
            <span>Upload Profile Photo</span>
            <input type="file" name="profilePhoto" onChange={onFileChange} accept="image/*" className="hidden" />
          </label>
          <p className="text-xs text-gray-500 mt-1">{profilePhoto ? profilePhoto.name : (profile?.personalInfo?.profilePhoto ? 'Current photo uploaded' : 'PNG, JPG up to 2MB')}</p>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center hover:bg-gray-50 transition">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <label className="block text-sm font-medium text-primary cursor-pointer">
            <span>Upload Resume (PDF)</span>
            <input type="file" name="resume" onChange={onFileChange} accept=".pdf,.doc,.docx" className="hidden" />
          </label>
          <p className="text-xs text-gray-500 mt-1">{resume ? resume.name : (profile?.resume ? 'Current resume uploaded' : 'PDF up to 5MB')}</p>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;

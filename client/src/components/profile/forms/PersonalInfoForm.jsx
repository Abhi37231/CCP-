import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateProfile } from '../../../redux/slices/profileSlice';
import { toast } from 'react-toastify';

const PersonalInfoForm = ({ profile }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.profile);
  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: profile?.personalInfo?.firstName || '',
    middleName: profile?.personalInfo?.middleName || '',
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
    if (e.target.name === 'resume' && e.target.files[0]) setResume(e.target.files[0]);
    if (e.target.name === 'profilePhoto' && e.target.files[0]) setProfilePhoto(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const personalInfo = {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      headline: formData.headline,
      phone: formData.phone,
      dob: formData.dob || undefined,
      gender: formData.gender || undefined,
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
    <form onSubmit={onSubmit} className="space-y-10">

      {/* Basic Details */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Basic Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={onChange}
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Professional Headline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={onChange}
              placeholder="e.g. Aspiring Full Stack Developer | Final Year CS Student"
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={onChange}
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5 [color-scheme:dark]"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={onChange}
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-white/5 my-8"></div>

      {/* Location */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">location_on</span>
          Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChange}
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={onChange}
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={onChange}
              className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner w-full border border-white/5"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-white/5 my-8"></div>

      {/* Professional Summary */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">description</span>
          Professional Summary
        </h2>
        <div className="flex flex-col gap-2">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">About Me / Career Objective</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={onChange}
            rows="4"
            placeholder="Briefly describe your career objectives and background..."
            className="bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner w-full resize-none border border-white/5"
          ></textarea>
        </div>
      </div>

      <div className="w-full h-px bg-white/5 my-8"></div>

      {/* Uploads */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-inverse-primary">cloud_upload</span>
          Uploads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Photo */}
          <div
            className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-surface-container-lowest/50 hover:bg-surface-container-highest/30 hover:border-inverse-primary/50 transition-all cursor-pointer group"
            onClick={() => photoInputRef.current.click()}
          >
            <input
              type="file"
              name="profilePhoto"
              onChange={onFileChange}
              accept="image/*"
              className="hidden"
              ref={photoInputRef}
            />
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-inverse-primary-container/20 group-hover:text-inverse-primary border border-white/5">
              <span className="material-symbols-outlined text-[24px] text-on-surface-variant group-hover:text-inverse-primary">account_circle</span>
            </div>
            <h3 className="font-label-sm text-body-md text-on-surface mb-1">Profile Photo</h3>
            <p className="font-body-md text-label-sm text-on-surface-variant mb-0">
              {profilePhoto ? profilePhoto.name : (profile?.personalInfo?.profilePhoto ? 'Current photo uploaded' : 'PNG, JPG up to 2MB')}
            </p>
          </div>

          {/* Resume */}
          <div
            className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-surface-container-lowest/50 hover:bg-surface-container-highest/30 hover:border-inverse-primary/50 transition-all cursor-pointer group"
            onClick={() => resumeInputRef.current.click()}
          >
            <input
              type="file"
              name="resume"
              onChange={onFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
              ref={resumeInputRef}
            />
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-inverse-primary-container/20 group-hover:text-inverse-primary border border-white/5">
              <span className="material-symbols-outlined text-[24px] text-on-surface-variant group-hover:text-inverse-primary">upload_file</span>
            </div>
            <h3 className="font-label-sm text-body-md text-on-surface mb-1">Resume Document</h3>
            <p className="font-body-md text-label-sm text-on-surface-variant mb-0">
              {resume ? resume.name : (profile?.resume ? 'Current resume uploaded' : 'PDF up to 5MB')}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
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
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;

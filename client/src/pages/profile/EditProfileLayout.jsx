import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, clearProfileError } from '../../redux/slices/profileSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PersonalInfoForm from '../../components/profile/forms/PersonalInfoForm';
import EducationForm from '../../components/profile/forms/EducationForm';
import SkillsForm from '../../components/profile/forms/SkillsForm';
import ProjectsForm from '../../components/profile/forms/ProjectsForm';
import ExperienceForm from '../../components/profile/forms/ExperienceForm';
import AdditionalInfoForm from '../../components/profile/forms/AdditionalInfoForm';
import SettingsForm from '../../components/profile/forms/SettingsForm';
import ProfessionalDetailsForm from '../../components/profile/forms/ProfessionalDetailsForm';

const EditProfileLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading, error } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = user?.experienceLevel === 'experienced' 
    ? [
        { id: 'personal', name: 'Personal Info', icon: 'person' },
        { id: 'professional', name: 'Professional Details', icon: 'star' },
        { id: 'experience', name: 'Work Experience', icon: 'work' },
        { id: 'skills', name: 'Skills', icon: 'code' },
        { id: 'education', name: 'Education', icon: 'school' },
        { id: 'projects', name: 'Projects', icon: 'cases' },
        { id: 'additional', name: 'Additional', icon: 'workspace_premium' },
        { id: 'settings', name: 'Settings', icon: 'settings' },
      ]
    : [
        { id: 'personal', name: 'Personal Info', icon: 'person' },
        { id: 'education', name: 'Education', icon: 'school' },
        { id: 'skills', name: 'Skills', icon: 'code' },
        { id: 'projects', name: 'Projects', icon: 'cases' },
        { id: 'experience', name: 'Experience', icon: 'work' },
        { id: 'additional', name: 'Additional', icon: 'workspace_premium' },
        { id: 'settings', name: 'Settings', icon: 'settings' },
      ];

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProfileError());
    }
  }, [error, dispatch]);

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-background">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
        </svg>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'personal': return <PersonalInfoForm profile={profile} />;
      case 'professional': return <ProfessionalDetailsForm profile={profile} />;
      case 'education': return <EducationForm profile={profile} />;
      case 'skills': return <SkillsForm profile={profile} />;
      case 'projects': return <ProjectsForm profile={profile} />;
      case 'experience': return <ExperienceForm profile={profile} />;
      case 'additional': return <AdditionalInfoForm profile={profile} />;
      case 'settings': return <SettingsForm profile={profile} />;
      default: return <PersonalInfoForm profile={profile} />;
    }
  };

  return (
    <main className="relative pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full relative">
        <div className="max-w-[1200px] w-full mx-auto pb-24 px-4 md:px-margin-desktop">
          {/* Header Section */}
          <div className="mt-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link to="/dashboard" className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm mb-4">
                <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span> Back to Dashboard
              </Link>
              <h1 className="font-display-lg text-display-lg text-on-background">Edit Profile</h1>
            </div>
            
            {/* Completion Widget */}
            <div className="bg-surface-container rounded-2xl p-4 border border-white/5 flex items-center gap-4 shadow-lg min-w-[250px]">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-surface-container-highest" strokeWidth="4"></circle>
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary transition-all duration-1000 ease-out" strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - (profile?.profileCompletion || 0)} strokeLinecap="round"></circle>
                </svg>
                <span className="absolute text-[10px] font-bold text-on-surface">{profile?.profileCompletion || 0}%</span>
              </div>
              <div>
                <h3 className="font-label-sm text-label-sm text-on-surface">Profile Completion</h3>
                <p className="text-[12px] text-on-surface-variant mt-0.5">Complete your profile to stand out.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 shrink-0">
              <nav className="bg-surface-container rounded-3xl p-3 shadow-xl border border-white/5 flex flex-col gap-1 sticky top-28">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary-container/20 text-primary font-medium'
                        : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                    <span className="font-label-sm text-label-sm text-left">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <div className="bg-surface-container rounded-3xl p-8 shadow-xl border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  {renderActiveTab()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditProfileLayout;

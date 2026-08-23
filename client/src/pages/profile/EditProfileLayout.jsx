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
import { User, Book, Code, Briefcase, Award, Settings, BriefcaseBusiness, ArrowLeft, Star } from 'lucide-react';

const EditProfileLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading, error } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = user?.experienceLevel === 'experienced' 
    ? [
        { id: 'personal', name: 'Personal Info', icon: User },
        { id: 'professional', name: 'Professional Details', icon: Star },
        { id: 'experience', name: 'Work Experience', icon: BriefcaseBusiness },
        { id: 'skills', name: 'Skills', icon: Code },
        { id: 'education', name: 'Education', icon: Book },
        { id: 'projects', name: 'Projects', icon: Briefcase },
        { id: 'additional', name: 'Additional', icon: Award },
        { id: 'settings', name: 'Settings', icon: Settings },
      ]
    : [
        { id: 'personal', name: 'Personal Info', icon: User },
        { id: 'education', name: 'Education', icon: Book },
        { id: 'skills', name: 'Skills', icon: Code },
        { id: 'projects', name: 'Projects', icon: Briefcase },
        { id: 'experience', name: 'Experience', icon: BriefcaseBusiness },
        { id: 'additional', name: 'Additional', icon: Award },
        { id: 'settings', name: 'Settings', icon: Settings },
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
    return <div className="flex justify-center mt-20">Loading...</div>;
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
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Link to="/dashboard" className="text-gray-500 hover:text-primary flex items-center mr-4">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <nav className="flex flex-col space-y-1 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
             <h3 className="text-sm font-semibold text-gray-700 mb-2">Profile Completion</h3>
             <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${profile?.profileCompletion || 0}%` }}></div>
             </div>
             <span className="text-xs text-gray-500">{profile?.profileCompletion || 0}% Complete</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default EditProfileLayout;

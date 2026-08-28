import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/slices/authSlice';
import { clearProfile, getProfile } from '../redux/slices/profileSlice';
import { toast } from 'react-toastify';
import { getMediaUrl } from '../utils/formatUrl';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    }
  }, [dispatch, profile]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearProfile());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getProfileEditLink = () => {
    return user?.role === 'employer' ? '/company/edit' : '/profile/edit';
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-margin-desktop">
        <h1 className="text-display-sm font-display-sm text-on-background mb-8">Settings</h1>
        
        {/* User Info Card */}
        <div className="bg-surface-container rounded-2xl p-6 mb-8 border border-white/5 shadow-lg flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-container-highest border-2 border-surface shadow-md flex items-center justify-center font-display-sm text-[24px] text-on-surface overflow-hidden">
            {profile?.personalInfo?.profilePhoto || user?.avatar ? (
              <img src={getMediaUrl(profile?.personalInfo?.profilePhoto || user?.avatar)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <div>
            <h2 className="text-title-lg font-title-lg text-on-surface">{user?.name}</h2>
            <p className="text-body-md text-on-surface-variant capitalize">{user?.role?.replace('_', ' ')}</p>
            <p className="text-label-sm text-on-surface-variant mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Settings Options */}
        <div className="space-y-4">
          
          {/* Edit Profile */}
          <Link to={getProfileEditLink()} className="group block bg-surface-container hover:bg-surface-container-high transition-colors rounded-2xl p-6 border border-white/5 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">person</span>
                </div>
                <div>
                  <h3 className="text-title-md font-title-md text-on-surface">Edit Profile</h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">Update your personal information and resume</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors group-hover:translate-x-1 duration-300">chevron_right</span>
            </div>
          </Link>

          {/* Account Preferences */}
          <Link to="/settings/security" className="group block bg-surface-container hover:bg-surface-container-high transition-colors rounded-2xl p-6 border border-white/5 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
                <div>
                  <h3 className="text-title-md font-title-md text-on-surface">Account Security</h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">Change password</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary transition-colors">chevron_right</span>
            </div>
          </Link>

          {/* Notifications */}
          <Link to="/settings/notifications" className="group block bg-surface-container hover:bg-surface-container-high transition-colors rounded-2xl p-6 border border-white/5 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">notifications</span>
                </div>
                <div>
                  <h3 className="text-title-md font-title-md text-on-surface">Notifications</h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">Manage email and push alerts</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
            </div>
          </Link>

          {/* Logout */}
          <button onClick={handleLogout} className="w-full group block bg-error/5 hover:bg-error/10 transition-colors rounded-2xl p-6 border border-error/10 cursor-pointer text-left mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">logout</span>
                </div>
                <div>
                  <h3 className="text-title-md font-title-md text-error">Logout</h3>
                  <p className="text-body-sm text-error/70 mt-1">Sign out of your account securely</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-error">logout</span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Settings;

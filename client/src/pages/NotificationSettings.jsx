import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { updateNotifications } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    pushNotifications: true,
    jobAlerts: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.notificationPreferences) {
      setPreferences({
        emailAlerts: user.notificationPreferences.emailAlerts ?? true,
        pushNotifications: user.notificationPreferences.pushNotifications ?? true,
        jobAlerts: user.notificationPreferences.jobAlerts ?? true
      });
    }
  }, [user]);

  const handleToggle = (setting) => {
    setPreferences(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const resultAction = await dispatch(updateNotifications(preferences));

    if (updateNotifications.fulfilled.match(resultAction)) {
      toast.success('Notification preferences updated successfully');
      navigate('/settings');
    } else {
      toast.error(resultAction.payload || 'Failed to update preferences');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-2xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/settings" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-display-sm font-display-sm text-on-background">Notifications</h1>
        </div>

        {/* Settings Card */}
        <div className="bg-surface-container rounded-3xl p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
            </div>
            <div>
              <h2 className="text-title-lg font-title-lg text-on-surface">Alert Preferences</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">Choose how and when we contact you.</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Toggle Item */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-label-lg text-on-surface">Email Alerts</h4>
                <p className="text-body-sm text-on-surface-variant mt-1">Receive important updates and newsletters directly to your inbox.</p>
              </div>
              <button 
                onClick={() => handleToggle('emailAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.emailAlerts ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Toggle Item */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-label-lg text-on-surface">Push Notifications</h4>
                <p className="text-body-sm text-on-surface-variant mt-1">Get instant alerts about messages and application status right in your browser.</p>
              </div>
              <button 
                onClick={() => handleToggle('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.pushNotifications ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Toggle Item */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-label-lg text-on-surface">Job & Application Alerts</h4>
                <p className="text-body-sm text-on-surface-variant mt-1">Get notified when new jobs matching your profile are posted or when your application status changes.</p>
              </div>
              <button 
                onClick={() => handleToggle('jobAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.jobAlerts ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.jobAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-primary text-on-primary rounded-xl py-4 font-label-lg uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Save Preferences
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotificationSettings;

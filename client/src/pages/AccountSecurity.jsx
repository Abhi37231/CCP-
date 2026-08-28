import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { updatePassword } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const AccountSecurity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    
    if (formData.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }

    setLoading(true);
    const resultAction = await dispatch(updatePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }));

    if (updatePassword.fulfilled.match(resultAction)) {
      toast.success('Password updated successfully');
      navigate('/settings');
    } else {
      toast.error(resultAction.payload || 'Failed to update password');
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
          <h1 className="text-display-sm font-display-sm text-on-background">Account Security</h1>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container rounded-3xl p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">key</span>
            </div>
            <div>
              <h2 className="text-title-lg font-title-lg text-on-surface">Change Password</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">Ensure your account is using a long, random password to stay secure.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Current Password */}
            <div>
              <label className="block text-label-md text-on-surface-variant mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder-outline focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-colors pr-12"
                  placeholder="Enter current password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[20px]">{showCurrent ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-label-md text-on-surface-variant mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder-outline focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-colors pr-12"
                  placeholder="Enter new password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[20px]">{showNew ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-label-md text-on-surface-variant mb-2">Confirm New Password</label>
              <input
                type={showNew ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder-outline focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-colors"
                placeholder="Confirm new password"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tertiary text-on-tertiary rounded-xl py-4 font-label-lg uppercase tracking-wider hover:bg-tertiary/90 transition-all shadow-lg shadow-tertiary/20 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AccountSecurity;

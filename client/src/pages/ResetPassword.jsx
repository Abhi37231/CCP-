import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please request a new OTP.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/resetpassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: data.otp, password: data.password }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Something went wrong');
      }

      toast.success('Password updated successfully! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-surface relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-md w-full relative z-10 p-4">
        <div className="bg-surface-container p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/5">
          <div className="text-center mb-8">
            <span className="inline-block py-1 px-3 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm mb-4 uppercase tracking-wider">Secure Reset</span>
            <h2 className="text-3xl font-display-lg text-on-surface mb-2">
              Create New Password
            </h2>
            <p className="text-on-surface-variant font-body-md">
              Enter the OTP sent to <span className="font-bold">{email}</span> and your new password.
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">6-Digit OTP</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant">password</span>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner border tracking-[0.5em] text-center ${errors.otp ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="••••••"
                    {...register('otp')}
                  />
                </div>
                {errors.otp && <p className="text-error text-xs mt-1 font-body-md">{errors.otp.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">New Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant">lock</span>
                  <input
                    id="password"
                    type="password"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner border ${errors.password ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="text-error text-xs mt-1 font-body-md">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Confirm New Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant">lock</span>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner border ${errors.confirmPassword ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && <p className="text-error text-xs mt-1 font-body-md">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-on-primary bg-gradient-to-r from-primary to-secondary-container font-label-sm text-label-sm shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:shadow-[0_0_30px_rgba(173,198,255,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-on-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    Reset Password
                    <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center pt-6 mt-6 border-t border-white/5">
            <Link to="/login" className="inline-flex items-center gap-1 font-label-sm text-primary hover:text-primary-fixed-dim transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const RegisterEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requiresVerification, error, isLoading } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (requiresVerification) {
      toast.success('OTP sent to your email!');
      navigate('/verify-otp');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [requiresVerification, error, navigate, dispatch]);

  const onSubmit = (data) => {
    data.role = 'job_seeker';
    data.experienceLevel = 'experienced';
    dispatch(registerUser(data));
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-surface relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-md w-full relative z-10 p-4">
        <div className="bg-surface-container p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/5">
          <div className="text-center mb-8">
            <span className="inline-block py-1 px-3 rounded-full bg-surface-container-high text-tertiary font-label-sm text-label-sm mb-4 uppercase tracking-wider">Experienced Pro</span>
            <h2 className="text-3xl font-display-lg text-on-surface">
              Professional Registration
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant font-body-md">Take your career to the next level</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant">person</span>
                  <input
                    type="text"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner border ${errors.name ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="John Doe"
                    {...register('name')}
                  />
                </div>
                {errors.name && <p className="text-error text-xs mt-1 font-body-md">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Email address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant">mail</span>
                  <input
                    type="email"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner border ${errors.email ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="name@example.com"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-error text-xs mt-1 font-body-md">{errors.email.message}</p>}
              </div>
              
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant">lock</span>
                  <input
                    type="password"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-bright transition-all shadow-inner border ${errors.password ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="text-error text-xs mt-1 font-body-md">{errors.password.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-on-tertiary bg-gradient-to-r from-tertiary to-tertiary-container font-label-sm text-label-sm shadow-[0_0_20px_rgba(79,219,200,0.3)] hover:shadow-[0_0_30px_rgba(79,219,200,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-on-tertiary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Register & Get OTP
                    <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center pt-4 border-t border-white/5 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">arrow_back</span>
              <Link to="/register" className="font-label-sm text-on-surface-variant hover:text-on-surface transition-colors">
                Back to Selection
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployee;

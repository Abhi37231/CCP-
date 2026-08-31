import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error, isLoading, user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'employer') {
        navigate('/employer-dashboard');
      } else if (user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch, user]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Logged in successfully!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-surface relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-md w-full relative z-10 p-4">
        <div className="bg-surface-container p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/5">
          <div className="text-center mb-8">
            <span className="inline-block py-1 px-3 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm mb-4 uppercase tracking-wider">Welcome Back</span>
            <h2 className="text-3xl font-display-lg text-on-surface">
              Sign in to your account
            </h2>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Email address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant">mail</span>
                  <input
                    id="email-address"
                    type="email"
                    autoComplete="email"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner border ${errors.email ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="name@example.com"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-error text-xs mt-1 font-body-md">{errors.email.message}</p>}
              </div>
              
              <div>
                <label htmlFor="password" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant">lock</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl pl-12 pr-12 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner border ${errors.password ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none flex items-center justify-center"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && <p className="text-error text-xs mt-1 font-body-md">{errors.password.message}</p>}
              </div>
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="font-label-sm text-primary hover:text-primary-fixed-dim transition-colors text-xs uppercase tracking-wider">
                  Forgot Password?
                </Link>
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span className="material-symbols-outlined text-[18px]">login</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center pt-4 border-t border-white/5">
              <span className="text-on-surface-variant font-body-md">Don't have an account? </span>
              <Link to="/register" className="font-label-sm text-primary hover:text-primary-fixed-dim transition-colors">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

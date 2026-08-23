import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { verifyOtp, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requiresVerification, verificationEmail, error, isLoading } = useSelector((state) => state.auth);
  
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }
    
    const result = await dispatch(verifyOtp({ email: verificationEmail, otp }));
    if (verifyOtp.fulfilled.match(result)) {
       toast.success('Verification successful! Please log in.');
       navigate('/login');
    }
  };

  // If there's no email in state to verify, redirect back to register
  if (!requiresVerification || !verificationEmail) {
    return <Navigate to="/register" />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-surface relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-md w-full relative z-10 p-4">
        <div className="bg-surface-container p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/5">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-white/10 shadow-inner">
              <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
            </div>
            <h2 className="text-3xl font-display-lg text-on-surface mb-2">
              Verify Your Email
            </h2>
            <p className="text-sm text-on-surface-variant font-body-md">
              We sent a 6-digit code to<br/>
              <span className="font-semibold text-on-surface">{verificationEmail}</span>
            </p>
          </div>
          
          <form className="space-y-8" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block text-center">Enter Verification Code</label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                  className="w-full bg-surface-container-highest text-on-surface font-headline-lg text-headline-lg rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-bright transition-all shadow-inner border border-white/5 text-center tracking-[0.5em]"
                  placeholder="000000"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-on-primary bg-gradient-to-r from-primary to-primary-container font-label-sm text-label-sm shadow-[0_0_20px_rgba(77,142,255,0.3)] hover:shadow-[0_0_30px_rgba(77,142,255,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-on-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <span className="material-symbols-outlined text-[18px]">verified</span>
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

export default VerifyOtp;

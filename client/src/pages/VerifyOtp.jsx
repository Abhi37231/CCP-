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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-xl shadow-lg border-t-4 border-yellow-500">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a 6-digit code to <span className="font-semibold text-gray-900">{verificationEmail}</span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                maxLength="6"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                className="mt-1 block w-full px-3 py-3 text-center text-2xl tracking-[0.5em] border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="000000"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;

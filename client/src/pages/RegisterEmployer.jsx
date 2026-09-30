import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearError, verifyCompanyCin, sendEmployerOtp, registerVerifiedEmployer } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const step1Schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Work email is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
});

const step2Schema = yup.object().shape({
  companyName: yup.string().required('Company Legal Name is required'),
  website: yup.string().url('Invalid URL').required('Company website is required'),
  cin: yup.string().required('CIN is required'),
  gstin: yup.string(),
  companyEmail: yup.string().email('Invalid email').required('Company email is required'),
  companyType: yup.string().required('Company type is required'),
});

const RegisterEmployer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [recruiterInfo, setRecruiterInfo] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form1 = useForm({ resolver: yupResolver(step1Schema) });
  const form2 = useForm({ resolver: yupResolver(step2Schema) });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Registration completed successfully!');
      navigate('/employer-dashboard');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const onStep1Submit = (data) => {
    setRecruiterInfo(data);
    setStep(2);
  };

  const onStep2Submit = async (data) => {
    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(verifyCompanyCin({ cin: data.cin })).unwrap();
      
      if (resultAction.verified) {
        const govData = resultAction.company;
        const govName = govData?.companyName?.toLowerCase() || '';
        const enteredName = data.companyName.toLowerCase();
        
        if (!govName.includes(enteredName) && !enteredName.includes(govName) && govName !== enteredName && govName !== 'unverified company (api offline)') {
           toast.error('Company name does not match the registered name for this CIN.');
           setIsSubmitting(false);
           return;
        } else {
            data.verification = {
                status: 'VERIFIED',
                source: 'Data.gov.in',
                verified: true,
                governmentData: govData
            };
        }
        
        setCompanyInfo(data);
        setStep(3);
      } else {
        toast.error(resultAction.message || 'Verification failed. Please check your CIN.');
      }
    } catch (err) {
      toast.error(err || 'Failed to verify company. Please check your CIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    // Extract domains
    try {
      const emailDomain = recruiterInfo.email.split('@')[1];
      const websiteUrl = new URL(companyInfo.website);
      let websiteDomain = websiteUrl.hostname;
      if (websiteDomain.startsWith('www.')) {
        websiteDomain = websiteDomain.substring(4);
      }

      if (emailDomain !== websiteDomain) {
        toast.error('Error: Email domain does not match the company website. Please use your official corporate email.');
        return;
      }

      setIsSubmitting(true);
      await dispatch(sendEmployerOtp({ email: recruiterInfo.email })).unwrap();
      setOtpSent(true);
      toast.success('OTP sent to your official email!');
    } catch (err) {
      toast.error(err || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(registerVerifiedEmployer({
        recruiterInfo,
        companyInfo,
        otp
      })).unwrap();
    } catch (err) {
      toast.error(err || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-surface relative overflow-hidden py-12">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-2xl w-full relative z-10 p-4">
        <div className="bg-surface-container p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/5">
          <div className="text-center mb-8">
            <span className="inline-block py-1 px-3 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm mb-4 uppercase tracking-wider">Employer Registration</span>
            <h2 className="text-3xl font-display-lg text-on-surface">
              {step === 1 && 'Your Information'}
              {step === 2 && 'Company Information'}
              {step === 3 && 'Verify Official Email'}
            </h2>
            
            {/* Progress indicators */}
            <div className="flex justify-center items-center gap-2 mt-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-secondary' : step > i ? 'w-4 bg-secondary/50' : 'w-4 bg-white/10'}`}></div>
                ))}
            </div>
          </div>
          
          {step === 1 && (
            <form className="space-y-6" onSubmit={form1.handleSubmit(onStep1Submit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Full Name</label>
                  <input
                    type="text"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner border ${form1.formState.errors.name ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="John Doe"
                    {...form1.register('name')}
                  />
                  {form1.formState.errors.name && <p className="text-error text-xs mt-1">{form1.formState.errors.name.message}</p>}
                </div>
                
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Work Email</label>
                  <input
                    type="email"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner border ${form1.formState.errors.email ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="name@company.com"
                    {...form1.register('email')}
                  />
                  {form1.formState.errors.email && <p className="text-error text-xs mt-1">{form1.formState.errors.email.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Phone Number</label>
                  <input
                    type="text"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner border ${form1.formState.errors.phone ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="+1 234 567 890"
                    {...form1.register('phone')}
                  />
                  {form1.formState.errors.phone && <p className="text-error text-xs mt-1">{form1.formState.errors.phone.message}</p>}
                </div>
                
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Password</label>
                  <input
                    type="password"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner border ${form1.formState.errors.password ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="••••••••"
                    {...form1.register('password')}
                  />
                  {form1.formState.errors.password && <p className="text-error text-xs mt-1">{form1.formState.errors.password.message}</p>}
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Confirm Password</label>
                  <input
                    type="password"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-surface-bright transition-all shadow-inner border ${form1.formState.errors.confirmPassword ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="••••••••"
                    {...form1.register('confirmPassword')}
                  />
                  {form1.formState.errors.confirmPassword && <p className="text-error text-xs mt-1">{form1.formState.errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Link to="/register" className="py-3 px-6 rounded-xl text-on-surface-variant bg-surface-container-highest hover:bg-surface-container-high transition-colors">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl text-on-secondary bg-secondary hover:bg-secondary/90 transition-colors"
                >
                  Next Step
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={form2.handleSubmit(onStep2Submit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Company Legal Name</label>
                  <input
                    type="text"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 transition-all border ${form2.formState.errors.companyName ? 'border-error/50' : 'border-white/5'}`}
                    {...form2.register('companyName')}
                  />
                  {form2.formState.errors.companyName && <p className="text-error text-xs mt-1">{form2.formState.errors.companyName.message}</p>}
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Company Website</label>
                  <input
                    type="text"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 transition-all border ${form2.formState.errors.website ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="https://example.com"
                    {...form2.register('website')}
                  />
                  {form2.formState.errors.website && <p className="text-error text-xs mt-1">{form2.formState.errors.website.message}</p>}
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Company Email</label>
                  <input
                    type="email"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 transition-all border ${form2.formState.errors.companyEmail ? 'border-error/50' : 'border-white/5'}`}
                    placeholder="info@company.com"
                    {...form2.register('companyEmail')}
                  />
                  {form2.formState.errors.companyEmail && <p className="text-error text-xs mt-1">{form2.formState.errors.companyEmail.message}</p>}
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Company Type</label>
                  <select
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 transition-all border ${form2.formState.errors.companyType ? 'border-error/50' : 'border-white/5'}`}
                    {...form2.register('companyType')}
                  >
                    <option value="">Select Type</option>
                    <option value="Private Limited">Private Limited</option>
                    <option value="Public Limited">Public Limited</option>
                    <option value="LLP">LLP</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Proprietorship">Proprietorship</option>
                    <option value="Other">Other</option>
                  </select>
                  {form2.formState.errors.companyType && <p className="text-error text-xs mt-1">{form2.formState.errors.companyType.message}</p>}
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">GSTIN (Optional)</label>
                  <input
                    type="text"
                    className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 transition-all border ${form2.formState.errors.gstin ? 'border-error/50' : 'border-white/5'}`}
                    {...form2.register('gstin')}
                  />
                  {form2.formState.errors.gstin && <p className="text-error text-xs mt-1">{form2.formState.errors.gstin.message}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Corporate Identification Number (CIN)</label>
                <input
                  type="text"
                  className={`w-full bg-surface-container-highest text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 transition-all border ${form2.formState.errors.cin ? 'border-error/50' : 'border-white/5'}`}
                  placeholder="Enter CIN"
                  {...form2.register('cin')}
                />
                {form2.formState.errors.cin && <p className="text-error text-xs mt-1">{form2.formState.errors.cin.message}</p>}
                <p className="text-on-surface-variant text-xs mt-2">
                  This will be verified automatically when you click Next Step.
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-6 rounded-xl text-on-surface-variant bg-surface-container-highest hover:bg-surface-container-high transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3 px-6 rounded-xl text-on-secondary bg-secondary hover:bg-secondary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Next Step'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-surface-container-low border border-white/5 text-center space-y-4">
                <p className="text-on-surface-variant text-sm">
                  We need to verify that you have access to the official company email.
                </p>
                <p className="text-on-surface font-medium">
                  {recruiterInfo.email}
                </p>
                
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSubmitting}
                    className="py-3 px-6 rounded-xl text-on-secondary bg-secondary hover:bg-secondary/90 transition-colors w-full disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send OTP'}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400 justify-center">
                        <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
                        <span className="text-sm">OTP sent successfully</span>
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full text-center bg-surface-container-highest text-on-surface font-body-lg text-body-lg rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 border border-white/5 tracking-[0.5em]"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleCompleteRegistration}
                      disabled={isSubmitting || otp.length < 6}
                      className="py-3 px-6 rounded-xl text-on-secondary bg-secondary hover:bg-secondary/90 transition-colors w-full disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Verifying...' : 'Verify OTP & Complete Registration'}
                      {!isSubmitting && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                    </button>
                    <button 
                        type="button"
                        onClick={handleSendOtp}
                        className="text-sm text-secondary hover:underline"
                    >
                        Resend OTP
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-start">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-6 rounded-xl text-on-surface-variant bg-surface-container-highest hover:bg-surface-container-high transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployer;

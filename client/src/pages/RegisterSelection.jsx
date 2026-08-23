import { Link, useNavigate } from 'react-router-dom';

const RegisterSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="flex flex-col w-full h-full justify-center relative overflow-hidden bg-surface py-12">
        {/* Ambient Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Main Content Container */}
        <div className="max-w-container-max mx-auto px-margin-desktop w-full relative z-10 flex flex-col items-center">
          
          {/* Header Section */}
          <div className="text-center mb-16 max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm mb-6 uppercase tracking-wider">Join the Network</span>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-6 bg-clip-text text-transparent bg-gradient-to-r from-on-surface to-on-surface/60">Choose your path.</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Select the profile that best describes you to personalize your recruitment experience and unlock tailored opportunities.</p>
          </div>
          
          {/* Role Selection Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            
            {/* Card 1: Fresher */}
            <button onClick={() => navigate('/register/fresher')} className="group relative flex flex-col p-8 rounded-2xl bg-surface-container hover:bg-surface-container-highest transition-all duration-300 text-left overflow-hidden h-full shadow-lg shadow-black/10 cursor-pointer">
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="flex items-start justify-between mb-8 w-full">
                <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-black/20">
                  <span className="material-symbols-outlined text-3xl">school</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors duration-300 transform group-hover:translate-x-1">arrow_forward</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">I am a Fresher</h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Just starting out? Build your profile, discover internships, and land your first tech role with guided support.</p>
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Internships</span>
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Entry-Level</span>
              </div>
            </button>
            
            {/* Card 2: Experienced */}
            <button onClick={() => navigate('/register/employee')} className="group relative flex flex-col p-8 rounded-2xl bg-surface-container hover:bg-surface-container-highest transition-all duration-300 text-left overflow-hidden h-full shadow-lg shadow-black/10 cursor-pointer">
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-tertiary/10 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-tertiary/0 via-tertiary/50 to-tertiary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="flex items-start justify-between mb-8 w-full">
                <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-black/20">
                  <span className="material-symbols-outlined text-3xl">work</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary transition-colors duration-300 transform group-hover:translate-x-1">arrow_forward</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Experienced Pro</h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Ready for the next step? Connect with elite tech firms, benchmark your skills, and negotiate better offers.</p>
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Senior Roles</span>
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Leadership</span>
              </div>
            </button>
            
            {/* Card 3: Employer */}
            <button onClick={() => navigate('/register/employer')} className="group relative flex flex-col p-8 rounded-2xl bg-surface-container hover:bg-surface-container-highest transition-all duration-300 text-left overflow-hidden h-full shadow-lg shadow-black/10 cursor-pointer">
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-secondary/10 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/0 via-secondary/50 to-secondary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="flex items-start justify-between mb-8 w-full">
                <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-black/20">
                  <span className="material-symbols-outlined text-3xl">domain</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors duration-300 transform group-hover:translate-x-1">arrow_forward</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">I am an Employer</h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Scaling your team? Access a curated pool of vetted technical talent and streamline your hiring process.</p>
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Hiring</span>
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Enterprise</span>
              </div>
            </button>
            
          </div>
          
          {/* Footer Link */}
          <div className="mt-16 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account? <Link to="/login" className="text-primary hover:text-primary-fixed-dim transition-colors font-medium">Log in here</Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RegisterSelection;

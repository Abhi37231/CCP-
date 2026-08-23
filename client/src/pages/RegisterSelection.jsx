import { Link } from 'react-router-dom';
import { Briefcase, Building, Award } from 'lucide-react';

const RegisterSelection = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Join Career Connect
          </h2>
          <p className="mt-2 text-center text-gray-600">Choose how you want to use our platform</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
          {/* Fresher / Job Seeker Card */}
          <Link to="/register/fresher" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary transition-all flex flex-col items-center text-center cursor-pointer">
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">I am a Fresher</h3>
            <p className="text-gray-500 text-sm">I want to discover jobs, build my profile, and start my career.</p>
            <span className="mt-4 text-primary font-semibold group-hover:underline text-sm">Register as Fresher &rarr;</span>
          </Link>

          {/* Employee / Experienced Professional Card */}
          <Link to="/register/employee" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-500 transition-all flex flex-col items-center text-center cursor-pointer">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Experienced Professional</h3>
            <p className="text-gray-500 text-sm">I want to find better opportunities and advance my career.</p>
            <span className="mt-4 text-purple-600 font-semibold group-hover:underline text-sm">Register as Professional &rarr;</span>
          </Link>

          {/* Employer Card */}
          <Link to="/register/employer" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-500 transition-all flex flex-col items-center text-center cursor-pointer">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Building size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">I am an Employer</h3>
            <p className="text-gray-500 text-sm">I want to post jobs and hire the best talent.</p>
            <span className="mt-4 text-green-600 font-semibold group-hover:underline text-sm">Register as Employer &rarr;</span>
          </Link>
        </div>

        <div className="text-center mt-8">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-primary hover:text-blue-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelection;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../redux/slices/profileSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ResumeManager = () => {
  const dispatch = useDispatch();
  const { profile, isLoading } = useSelector((state) => state.profile);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only PDF and Word documents are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      await api.post('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Resume uploaded successfully and set as default.');
      setSelectedFile(null);
      dispatch(getProfile()); // Refresh profile to get new resume
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove your default resume?')) return;
    
    setUploading(true);
    try {
      // Set resume to null
      await api.post('/profile', { resume: null });
      toast.success('Resume removed successfully.');
      dispatch(getProfile());
    } catch (error) {
      toast.error('Failed to remove resume.');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasResume = !!profile?.resume;

  return (
    <main className="pt-20 min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen transform translate-x-1/3 -translate-y-1/4"></div>
      </div>

      <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-12 relative z-10">
        
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-on-surface-variant hover:text-primary mb-4 transition-colors font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] mr-1">arrow_back</span> Back to Dashboard
          </Link>
          <h1 className="font-display-md text-3xl text-on-surface mb-2 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-4xl">description</span>
            Resume Management
          </h1>
          <p className="text-on-surface-variant font-body-md">Manage your default profile resume for quick and easy job applications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column - Current Resume & Upload */}
          <div className="md:col-span-8 flex flex-col gap-6">
            
            {/* Current Default Resume Card */}
            <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full blur-2xl"></div>
              
              <h2 className="font-headline-sm text-on-surface mb-4 flex items-center justify-between">
                Current Default Resume
                {hasResume && (
                  <span className="px-3 py-1 bg-primary/20 text-primary font-label-sm rounded-full text-xs border border-primary/20">Active</span>
                )}
              </h2>
              
              {hasResume ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-highest p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-error-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-error text-2xl">picture_as_pdf</span>
                    </div>
                    <div>
                      <h3 className="font-body-md font-semibold text-on-surface truncate max-w-[200px] sm:max-w-[300px]">
                        {profile.resume.split('/').pop()}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">Used automatically for 1-click applications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`http://localhost:5000${profile.resume}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-low flex items-center justify-center text-primary transition-colors tooltip"
                      title="View Resume"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </a>
                    <button 
                      onClick={handleDeleteResume}
                      className="w-10 h-10 rounded-full bg-surface-container hover:bg-error-container/20 flex items-center justify-center text-error transition-colors tooltip"
                      title="Remove Resume"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-xl bg-surface-container-highest/30">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-2">find_in_page</span>
                  <p className="text-on-surface-variant font-body-sm text-center">No default resume found. Upload one below or build a new one to speed up your applications.</p>
                </div>
              )}
            </div>

            {/* Upload New Resume */}
            <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl">
              <h2 className="font-headline-sm text-on-surface mb-2">Upload a File</h2>
              <p className="text-sm text-on-surface-variant mb-6">Uploading a new file will replace your current default resume.</p>
              
              <div className="flex flex-col gap-4">
                <div className={`border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center ${selectedFile ? 'border-primary bg-primary/5' : 'border-white/20 hover:border-primary/50 bg-surface-container-highest/50'}`}>
                  <input 
                    type="file" 
                    id="resumeUpload" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="resumeUpload" className="cursor-pointer flex flex-col items-center w-full">
                    {selectedFile ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                          <span className="material-symbols-outlined text-3xl">task</span>
                        </div>
                        <h4 className="font-body-md text-on-surface font-semibold mb-1 truncate max-w-full px-4">{selectedFile.name}</h4>
                        <p className="text-xs text-on-surface-variant mb-4">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button 
                          onClick={(e) => { e.preventDefault(); setSelectedFile(null); }}
                          className="text-sm text-error hover:underline"
                        >
                          Remove file
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-primary">
                          <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                        </div>
                        <h4 className="font-body-md text-on-surface font-semibold mb-1">Click to upload or drag and drop</h4>
                        <p className="text-xs text-on-surface-variant">PDF, DOC, DOCX up to 5MB</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex justify-end mt-2">
                  <button 
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className={`px-6 py-2.5 rounded-xl font-label-sm text-sm flex items-center gap-2 transition-all ${
                      !selectedFile || uploading 
                        ? 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed' 
                        : 'bg-primary text-on-primary-fixed hover:bg-primary-fixed shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {uploading ? (
                      <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Uploading...</>
                    ) : (
                      <><span className="material-symbols-outlined text-[18px]">upload</span> Set as Default Resume</>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Resume Builder Ad */}
          <div className="md:col-span-4 flex flex-col">
            <div className="bg-gradient-to-b from-primary-container/20 to-surface-container rounded-2xl p-1 border border-primary/20 shadow-[0_0_30px_rgba(77,142,255,0.1)] h-full">
              <div className="bg-surface-container rounded-xl p-6 h-full flex flex-col items-center text-center relative overflow-hidden">
                
                {/* Decor */}
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 mt-4 border border-primary/20">
                  <span className="material-symbols-outlined text-4xl text-primary">auto_awesome</span>
                </div>
                
                <h3 className="font-headline-sm text-on-surface mb-3">No Resume? No Problem!</h3>
                <p className="text-body-sm text-on-surface-variant mb-8 flex-grow">
                  Build a professional, ATS-friendly resume in minutes using our free Resume Builder. Choose from multiple modern templates.
                </p>

                <Link 
                  to="/resume-builder"
                  className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary-fixed font-label-sm hover:bg-primary-fixed transition-colors shadow-sm flex items-center justify-center gap-2 group"
                >
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">build</span>
                  Go to Resume Builder
                </Link>
                <p className="text-[10px] text-on-surface-variant/70 mt-4 italic">
                  *After building, you can download the PDF and upload it here as your default!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ResumeManager;

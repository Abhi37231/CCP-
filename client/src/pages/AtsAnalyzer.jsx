import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const CircularProgress = ({ value, label, size = 'lg' }) => {
  const radius = size === 'lg' ? 60 : 30;
  const stroke = size === 'lg' ? 10 : 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let colorClass = 'text-tertiary'; // Green/teal
  if (value < 40) colorClass = 'text-error';
  else if (value < 70) colorClass = 'text-yellow-500';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            className="text-surface-container-lowest"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-in-out drop-shadow-[0_0_8px_rgba(79,219,200,0.6)]`}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-display-lg text-display-lg text-on-surface`}>
            {value}
          </span>
          {size === 'lg' && <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">Score</span>}
        </div>
      </div>
      {label && <span className="mt-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</span>}
    </div>
  );
};

const ProgressBar = ({ value, label }) => {
  let colorClass = 'bg-tertiary';
  if (value < 40) colorClass = 'bg-error';
  else if (value < 70) colorClass = 'bg-yellow-500';

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-body-md text-body-md text-on-surface">{label}</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">{value}%</span>
      </div>
      <div className="w-full bg-surface-container-lowest rounded-full h-2 shadow-inner overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-1000`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function AtsAnalyzer() {
  const location = useLocation();
  const { profile } = useSelector((state) => state.profile);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState(location.state?.jobDescription || '');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleUseDefaultResume = async () => {
    if (!profile?.resume) {
        toast.error("No default resume found in your profile.");
        return;
    }
    
    try {
        setLoading(true);
        setStatusMessage('Loading default resume...');
        const response = await fetch(`http://localhost:5000${profile.resume}`);
        if (!response.ok) throw new Error("Failed to fetch resume");
        const blob = await response.blob();
        
        const filename = profile.resume.split('/').pop() || 'resume.pdf';
        const newFile = new File([blob], filename, { type: blob.type });
        setFile(newFile);
        toast.success("Default resume loaded successfully.");
    } catch (err) {
        console.error(err);
        toast.error("Could not load default resume.");
    } finally {
        setLoading(false);
        setStatusMessage('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getStatusText = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Moderate Match';
    if (score >= 40) return 'Weak Match';
    return 'Poor Match';
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload your resume.');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please paste the job description.');
      return;
    }

    setLoading(true);
    setResult(null);
    setStatusMessage('Uploading resume...');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      setTimeout(() => setStatusMessage('Extracting resume text...'), 1500);
      setTimeout(() => setStatusMessage('Analyzing with AI...'), 3000);
      setTimeout(() => setStatusMessage('Preparing your ATS report...'), 6000);

      const response = await axios.post('http://localhost:5000/api/ats/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (response.data.success) {
        setResult(response.data.data);
        toast.success('Analysis complete!');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to analyze resume. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <main className="pt-20 bg-background min-h-screen relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[100px] mix-blend-screen transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-margin-desktop relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-display-lg text-display-lg text-on-background flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-primary text-[48px]">troubleshoot</span>
            AI ATS Analyzer
          </h1>
          <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Check how well your resume matches a specific job description. 
            Upload your resume and the job details to receive a comprehensive AI-powered analysis.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="input-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-gutter"
            >
              {/* Left Column: Upload */}
              <div className="bg-surface-container p-8 rounded-2xl shadow-xl border border-white/5 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl pointer-events-none"></div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3 relative z-10">
                  <span className="material-symbols-outlined text-primary">upload_file</span>
                  1. Upload Resume
                </h2>
                <div 
                  className={`flex-grow border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors relative z-10 cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface-container-highest/50 hover:bg-surface-container-highest hover:border-outline'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !file && fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect}
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center cursor-default" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-surface-container p-4 rounded-full shadow-inner border border-white/5 mb-4">
                        <span className="material-symbols-outlined text-primary text-[40px]">description</span>
                      </div>
                      <p className="font-body-md text-body-md font-semibold text-on-surface text-center mb-1">{file.name}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button 
                        onClick={removeFile}
                        className="px-6 py-2 text-sm text-error bg-error/10 hover:bg-error/20 rounded-full transition-colors flex items-center gap-2 border border-error/20"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span> Remove File
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">cloud_upload</span>
                      <p className="font-body-md text-body-md font-medium text-on-surface mb-1">Drag & drop your resume here</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">or click to browse</p>
                      <p className="font-label-sm text-label-sm text-outline mt-6">Supported formats: PDF, DOCX (Max 5MB)</p>
                      
                      {profile?.resume && (
                        <div className="mt-6 flex flex-col items-center border-t border-white/10 pt-6 w-full">
                          <p className="font-label-sm text-label-sm text-on-surface-variant mb-3">Or use your saved profile resume</p>
                          <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleUseDefaultResume();
                              }}
                              disabled={loading}
                              className="px-6 py-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors flex items-center gap-2 border border-primary/20 disabled:opacity-50"
                          >
                              <span className="material-symbols-outlined text-[16px]">person</span> Use Default Resume
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Job Description */}
              <div className="bg-surface-container p-8 rounded-2xl shadow-xl border border-white/5 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full blur-2xl pointer-events-none"></div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3 relative z-10">
                  <span className="material-symbols-outlined text-secondary">work</span>
                  2. Job Description
                </h2>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here..."
                  className="flex-grow w-full p-6 bg-surface-container-highest border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary resize-none outline-none transition-all font-body-md text-on-surface placeholder:text-on-surface-variant/50 relative z-10 shadow-inner"
                  disabled={loading}
                ></textarea>
              </div>

              {/* Bottom: Analyze Button */}
              <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center mt-6">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !file || !jobDescription.trim()}
                  className={`group relative flex items-center justify-center gap-3 px-12 py-5 rounded-xl font-headline-md text-headline-md transition-all overflow-hidden ${
                    loading || !file || !jobDescription.trim()
                      ? 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed border border-white/5'
                      : 'bg-gradient-to-r from-primary to-secondary text-on-primary-fixed shadow-[0_0_30px_rgba(173,198,255,0.2)] hover:shadow-[0_0_40px_rgba(173,198,255,0.4)] hover:-translate-y-1 cursor-pointer'
                  }`}
                >
                  {!(loading || !file || !jobDescription.trim()) && (
                    <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                  {loading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                      </svg>
                      <span className="relative z-10">{statusMessage}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined relative z-10">magic_button</span>
                      <span className="relative z-10">Analyze Match</span>
                    </>
                  )}
                </button>
                
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-6 text-center max-w-lg bg-surface-container-low p-3 rounded-lg border border-white/5">
                  <span className="material-symbols-outlined text-[14px] inline-block align-middle mr-1">info</span>
                  ATS scores are AI-generated estimates based on the provided resume and job description. 
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-gutter"
            >
              {/* Dashboard Header */}
              <div className="flex flex-col md:flex-row gap-gutter items-stretch">
                {/* Overall Score */}
                <div className="bg-surface-container-high p-8 rounded-2xl shadow-xl border border-white/5 flex flex-col items-center justify-center flex-1 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none"></div>
                  <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-6 relative z-10">AI Estimated Match</h2>
                  
                  <div className="relative z-10 mb-2">
                    <CircularProgress value={result.overallScore} size="lg" />
                  </div>
                  
                  <p className={`mt-4 font-headline-md text-headline-md ${result.overallScore >= 80 ? 'text-tertiary' : result.overallScore >= 60 ? 'text-yellow-500' : 'text-error'} relative z-10`}>
                    {getStatusText(result.overallScore)}
                  </p>
                  
                  <button
                    onClick={() => setResult(null)}
                    className="mt-8 px-6 py-2 font-label-sm text-label-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors border border-primary/20 relative z-10 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">refresh</span> Analyze Another
                  </button>
                </div>

                {/* Summary & Categories */}
                <div className="bg-surface-container p-8 rounded-2xl shadow-xl border border-white/5 flex-[2] flex flex-col justify-center">
                  <div className="mb-8">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">lightbulb</span> 
                      Executive Summary
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed bg-surface-container-highest/50 p-6 rounded-xl border border-white/5">
                      {result.summary}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-6 rounded-xl border border-white/5 bg-surface-container-lowest/30">
                    <ProgressBar value={result.categoryScores.keywordMatch} label="Keyword Match" />
                    <ProgressBar value={result.categoryScores.skillsMatch} label="Skills Match" />
                    <ProgressBar value={result.categoryScores.experienceMatch} label="Experience Match" />
                    <ProgressBar value={result.categoryScores.projectRelevance} label="Project Relevance" />
                    <ProgressBar value={result.categoryScores.educationMatch} label="Education Match" />
                    <ProgressBar value={result.categoryScores.resumeStructure} label="ATS Structure" />
                  </div>
                </div>
              </div>

              {/* Keyword Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="bg-surface-container p-6 rounded-2xl shadow-xl border border-white/5">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">check_circle</span> 
                    Matched Keywords
                  </h3>
                  {result.matchedKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.map((kw, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-tertiary/10 text-tertiary font-label-sm text-label-sm rounded-lg border border-tertiary/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body-md text-body-md text-on-surface-variant/70 italic">No significant keywords matched.</p>
                  )}
                </div>
                
                <div className="bg-surface-container p-6 rounded-2xl shadow-xl border border-white/5">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-error">cancel</span> 
                    Missing Keywords
                  </h3>
                  {result.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((kw, idx) => (
                        <div key={idx} className="group relative">
                          <span className="px-3 py-1.5 bg-error/10 text-error font-label-sm text-label-sm rounded-lg border border-error/20 cursor-help flex items-center gap-1">
                            {kw}
                          </span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-3 bg-surface-container-highest text-on-surface font-label-sm text-label-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center shadow-lg border border-white/10">
                            Missing from resume. Add this if you have relevant experience.
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body-md text-body-md text-on-surface-variant/70 italic">No significant keywords missing.</p>
                  )}
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {/* Strengths */}
                <div className="bg-surface-container p-6 rounded-2xl shadow-xl border border-white/5 h-full">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">trending_up</span> 
                    Strengths
                  </h3>
                  <ul className="space-y-4">
                    {result.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 font-body-md text-body-md text-on-surface-variant">
                        <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0">check</span>
                        <span>{item}</span>
                      </li>
                    ))}
                    {result.strengths.length === 0 && <p className="font-body-md text-body-md text-on-surface-variant/70 italic">No specific strengths identified.</p>}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-surface-container p-6 rounded-2xl shadow-xl border border-white/5 h-full">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-error">trending_down</span> 
                    Weaknesses
                  </h3>
                  <ul className="space-y-4">
                    {result.weaknesses.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 font-body-md text-body-md text-on-surface-variant">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">close</span>
                        <span>{item}</span>
                      </li>
                    ))}
                    {result.weaknesses.length === 0 && <p className="font-body-md text-body-md text-on-surface-variant/70 italic">No significant weaknesses identified.</p>}
                  </ul>
                </div>

                {/* ATS Issues & Suggestions */}
                <div className="bg-surface-container p-6 rounded-2xl shadow-xl border border-white/5 h-full">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-yellow-500">warning</span> 
                    Actions & Issues
                  </h3>
                  
                  {result.atsIssues.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-3">Formatting Issues</h4>
                      <ul className="space-y-3">
                        {result.atsIssues.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 font-body-md text-body-md text-on-surface-variant">
                            <span className="material-symbols-outlined text-yellow-500 text-[20px] shrink-0">priority_high</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-3">Suggestions</h4>
                    <ol className="space-y-3 list-decimal list-outside ml-4 font-body-md text-body-md text-on-surface-variant">
                      {result.suggestions.map((item, idx) => (
                        <li key={idx} className="pl-2 leading-relaxed">{item}</li>
                      ))}
                    </ol>
                    {result.suggestions.length === 0 && <p className="font-body-md text-body-md text-on-surface-variant/70 italic">No additional suggestions.</p>}
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

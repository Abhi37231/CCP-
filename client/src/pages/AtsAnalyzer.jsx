import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, AlertTriangle, File, X, Loader, Search, Lightbulb, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const CircularProgress = ({ value, label, size = 'lg' }) => {
  const radius = size === 'lg' ? 60 : 30;
  const stroke = size === 'lg' ? 10 : 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = 'text-green-500';
  if (value < 40) color = 'text-red-500';
  else if (value < 70) color = 'text-yellow-500';

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
            className="text-gray-200"
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
            className={`${color} transition-all duration-1000 ease-in-out`}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-bold ${size === 'lg' ? 'text-4xl' : 'text-xl'} text-gray-800`}>
            {value}
          </span>
          {size === 'lg' && <span className="text-sm text-gray-500 font-medium">/ 100</span>}
        </div>
      </div>
      {label && <span className="mt-2 text-sm font-semibold text-gray-600">{label}</span>}
    </div>
  );
};

const ProgressBar = ({ value, label }) => {
  let color = 'bg-green-500';
  if (value < 40) color = 'bg-red-500';
  else if (value < 70) color = 'bg-yellow-500';

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function AtsAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

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
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
          <Target className="text-primary w-10 h-10" />
          AI Resume ATS Analyzer
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column: Upload */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                1. Upload Resume
              </h2>
              <div 
                className={`flex-grow border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${isDragging ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
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
                    <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                      <File className="w-10 h-10 text-primary" />
                    </div>
                    <p className="font-semibold text-gray-700 text-center">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button 
                      onClick={removeFile}
                      className="mt-4 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="font-medium text-gray-700">Drag & drop your resume here</p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-4">Supported formats: Any File (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Job Description */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                2. Job Description
              </h2>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                className="flex-grow w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none outline-none transition-all"
                disabled={loading}
              ></textarea>
            </div>

            {/* Bottom: Analyze Button */}
            <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center mt-4">
              <button
                onClick={handleAnalyze}
                disabled={loading || !file || !jobDescription.trim()}
                className={`flex items-center gap-2 px-10 py-4 rounded-full text-lg font-bold text-white transition-all shadow-lg ${
                  loading || !file || !jobDescription.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    {statusMessage}
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Analyze Resume
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 mt-6 text-center max-w-md">
                ATS scores are AI-generated estimates based on the provided resume and job description. 
                Actual ATS results may vary between employers and systems.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch">
              {/* Overall Score */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center flex-1">
                <h2 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-6">AI Estimated ATS Match</h2>
                <CircularProgress value={result.overallScore} size="lg" />
                <p className="mt-4 text-2xl font-bold text-gray-800">{getStatusText(result.overallScore)}</p>
                <button
                  onClick={() => setResult(null)}
                  className="mt-6 px-6 py-2 text-sm font-medium text-primary bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  Analyze Another Resume
                </button>
              </div>

              {/* Summary & Categories */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-[2] flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" /> Executive Summary
                  </h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {result.summary}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" /> Matched Keywords
                </h3>
                {result.matchedKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map((kw, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No significant keywords matched.</p>
                )}
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" /> Missing Keywords
                </h3>
                {result.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, idx) => (
                      <div key={idx} className="group relative">
                        <span className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full border border-red-200 cursor-help flex items-center gap-1">
                          {kw}
                        </span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                          Missing from resume. Add this only if you genuinely have relevant experience.
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No significant keywords missing.</p>
                )}
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" /> Strengths
                </h3>
                <ul className="space-y-3">
                  {result.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {result.strengths.length === 0 && <p className="text-gray-500 text-sm">No specific strengths identified.</p>}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" /> Weaknesses
                </h3>
                <ul className="space-y-3">
                  {result.weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {result.weaknesses.length === 0 && <p className="text-gray-500 text-sm">No significant weaknesses identified.</p>}
                </ul>
              </div>

              {/* ATS Issues & Suggestions */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" /> Actions & Issues
                </h3>
                {result.atsIssues.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">ATS Formatting Issues</h4>
                    <ul className="space-y-2">
                      {result.atsIssues.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-yellow-500 font-bold mt-0.5">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Suggestions</h4>
                  <ol className="space-y-2 list-decimal list-inside text-sm text-gray-700">
                    {result.suggestions.map((item, idx) => (
                      <li key={idx} className="leading-snug">{item}</li>
                    ))}
                  </ol>
                  {result.suggestions.length === 0 && <p className="text-gray-500 text-sm">No additional suggestions.</p>}
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

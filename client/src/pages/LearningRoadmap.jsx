import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { getProfile } from '../redux/slices/profileSlice';

const LearningRoadmap = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [targetRole, setTargetRole] = useState('');
  const [preferredDuration, setPreferredDuration] = useState('3 months');
  const [dailyTime, setDailyTime] = useState('2 hours');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [learningPreference, setLearningPreference] = useState('Mixed');

  useEffect(() => {
    dispatch(getProfile());
    fetchRoadmap();
  }, [dispatch]);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/roadmap');
      setRoadmap(res.data.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error('Failed to load learning roadmap');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetRole) {
      return toast.error('Target Role is required');
    }

    setIsGenerating(true);
    try {
      const payload = {
        targetRole,
        preferredDuration,
        dailyTime,
        preferredLanguage,
        learningPreference
      };
      const res = await api.post('/roadmap/generate', payload);
      setRoadmap(res.data.data);
      toast.success('Learning Roadmap generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTaskToggle = async (weekIndex, taskIndex, currentStatus) => {
    // Optimistic update
    const updatedRoadmap = { ...roadmap };
    updatedRoadmap.weeklyRoadmap[weekIndex].dailyTasks[taskIndex].completed = !currentStatus;
    
    // Calculate new overall progress
    let totalTasks = 0;
    let completedTasks = 0;
    updatedRoadmap.weeklyRoadmap.forEach(week => {
      week.dailyTasks.forEach(task => {
        totalTasks++;
        if (task.completed) completedTasks++;
      });
    });
    
    const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    updatedRoadmap.overallProgress = newProgress;
    setRoadmap(updatedRoadmap);

    // API Call
    try {
      const updates = {
        [`weeklyRoadmap.${weekIndex}.dailyTasks.${taskIndex}.completed`]: !currentStatus,
        overallProgress: newProgress
      };
      await api.put('/roadmap/progress', { updates });
    } catch (err) {
      toast.error('Failed to save progress');
      fetchRoadmap(); // Revert on failure
    }
  };

  if (isLoading) {
    <LoadingScreen isLoading={true} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-4xl">route</span>
          AI Learning Roadmap
        </h1>
        <p className="text-on-surface-variant mt-2">
          Personalized path to become job-ready, tailored to your profile and target role.
        </p>
      </div>

      {!roadmap ? (
        <div className="bg-surface-container rounded-2xl p-8 border border-white/5 max-w-2xl mx-auto shadow-lg">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-6xl text-secondary mb-4 animate-bounce">rocket_launch</span>
            <h2 className="text-2xl font-bold text-on-surface">Generate Your Roadmap</h2>
            <p className="text-on-surface-variant mt-2">Our AI will analyze your profile and create a step-by-step plan.</p>
          </div>
          
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Target Job Role <span className="text-error">*</span></label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, Data Scientist"
                className="w-full bg-background border border-outline/30 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Preferred Duration</label>
                <select 
                  value={preferredDuration} 
                  onChange={(e) => setPreferredDuration(e.target.value)}
                  className="w-full bg-background border border-outline/30 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Daily Learning Time</label>
                <select 
                  value={dailyTime} 
                  onChange={(e) => setDailyTime(e.target.value)}
                  className="w-full bg-background border border-outline/30 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="8 hours (Full-time)">8 hours (Full-time)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <><span className="material-symbols-outlined animate-spin">sync</span> Analyzing Profile & Generating...</>
              ) : (
                <><span className="material-symbols-outlined">magic_button</span> Generate Roadmap</>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
              <h3 className="text-on-surface-variant text-sm font-medium mb-1 relative z-10">Target Role</h3>
              <p className="text-2xl font-bold text-on-surface relative z-10">{roadmap.targetRole}</p>
            </div>
            
            <div className="bg-surface-container rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-secondary/5 group-hover:bg-secondary/10 transition-colors"></div>
              <h3 className="text-on-surface-variant text-sm font-medium mb-1 relative z-10">Overall Progress</h3>
              <div className="flex items-end gap-2 relative z-10">
                <p className="text-3xl font-bold text-secondary">{roadmap.overallProgress}%</p>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2 mt-4 relative z-10">
                <div className="bg-secondary h-2 rounded-full transition-all duration-1000" style={{ width: `${roadmap.overallProgress}%` }}></div>
              </div>
            </div>
            
            <div className="bg-surface-container rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-tertiary/5 group-hover:bg-tertiary/10 transition-colors"></div>
              <h3 className="text-on-surface-variant text-sm font-medium mb-1 relative z-10">Job Readiness</h3>
              <p className="text-3xl font-bold text-tertiary relative z-10">{roadmap.jobReadiness?.overallReadiness || 0}%</p>
            </div>
            
            <div className="bg-surface-container rounded-2xl p-6 border border-white/5 flex flex-col justify-center gap-3">
              <button onClick={() => setRoadmap(null)} className="w-full py-2 border border-outline/30 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">refresh</span> Regenerate
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface-container rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calendar_month</span> Weekly Plan
                </h2>
                
                <div className="space-y-8">
                  {roadmap.weeklyRoadmap?.map((week, wIndex) => (
                    <div key={wIndex} className="relative pl-8 border-l-2 border-outline/20 pb-4 last:border-0 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-surface-container border-2 border-primary"></div>
                      <div className="bg-surface-container-low rounded-xl p-5 border border-white/5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-primary">Week {week.weekNumber}: {week.theme}</h3>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-on-surface-variant mb-2">Topics:</h4>
                          <div className="flex flex-wrap gap-2">
                            {week.topics?.map((topic, i) => (
                              <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">{topic}</span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-3 mt-6">
                          <h4 className="text-sm font-medium text-on-surface-variant">Daily Tasks</h4>
                          {week.dailyTasks?.map((task, tIndex) => (
                            <div key={tIndex} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer border border-transparent hover:border-outline/10" onClick={() => handleTaskToggle(wIndex, tIndex, task.completed)}>
                              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-secondary border-secondary text-on-secondary' : 'border-outline/50 text-transparent'}`}>
                                <span className="material-symbols-outlined text-[14px]">check</span>
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm ${task.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>Day {task.day}: {task.goal}</p>
                                <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span> {task.estimatedTime}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column: Skills, Projects, Resources */}
            <div className="space-y-6">
              
              {/* Skill Gap */}
              <div className="bg-surface-container rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">target</span> Skill Gap
                </h2>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-on-surface-variant mb-2">Missing Skills to Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.skillGap?.missingSkills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-error-container/20 text-error text-xs rounded-full border border-error/20">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-on-surface-variant mb-2">Current Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.skillGap?.currentSkills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Recommended Projects */}
              <div className="bg-surface-container rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">code</span> Recommended Projects
                </h2>
                <div className="space-y-4">
                  {Object.entries(roadmap.projects || {}).map(([level, projects]) => {
                    if (!projects || projects.length === 0) return null;
                    return (
                      <div key={level}>
                        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">{level.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        <div className="space-y-2">
                          {projects.map((proj, i) => (
                            <div key={i} className="p-3 bg-surface-container-low rounded-lg border border-white/5">
                              <p className="text-sm font-medium text-on-surface">{proj.title}</p>
                              <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Interview Prep */}
              <div className="bg-surface-container rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">forum</span> Interview Prep
                </h2>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {roadmap.mockInterview?.technicalQuestions?.map((q, i) => (
                    <div key={i} className="p-3 bg-surface-container-low rounded-lg border border-l-4 border-l-secondary border-white/5">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] uppercase font-bold text-secondary">Technical</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${q.difficulty === 'Hard' ? 'bg-error/20 text-error' : q.difficulty === 'Medium' ? 'bg-tertiary/20 text-tertiary' : 'bg-primary/20 text-primary'}`}>{q.difficulty}</span>
                      </div>
                      <p className="text-sm text-on-surface">{q.question}</p>
                    </div>
                  ))}
                  {roadmap.mockInterview?.hrQuestions?.map((q, i) => (
                    <div key={'hr'+i} className="p-3 bg-surface-container-low rounded-lg border border-l-4 border-l-tertiary border-white/5">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] uppercase font-bold text-tertiary">HR</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${q.difficulty === 'Hard' ? 'bg-error/20 text-error' : q.difficulty === 'Medium' ? 'bg-tertiary/20 text-tertiary' : 'bg-primary/20 text-primary'}`}>{q.difficulty}</span>
                      </div>
                      <p className="text-sm text-on-surface">{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningRoadmap;

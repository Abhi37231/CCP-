import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../redux/slices/profileSlice';
import { Mail, Phone, MapPin, Download, ExternalLink, Globe, Link as LinkIcon, UserCircle } from 'lucide-react';

const PublicProfile = ({ isRecruiterView = false }) => {
  const dispatch = useDispatch();
  const { profile, isLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    }
  }, [dispatch, profile]);

  if (isLoading || !profile) {
    return <div className="flex justify-center mt-20">Loading Profile...</div>;
  }

  const { 
    personalInfo, location, about, education, skills, projects, experience, 
    socialLinks, codingProfiles, privacySettings,
    internships, certifications, achievements, languagesKnown
  } = profile;

  // Helpers to handle privacy settings
  const showPhone = privacySettings?.phoneVisible ?? true;
  const showEmail = privacySettings?.emailVisible ?? true;
  const showResume = privacySettings?.resumeVisible ?? true;
  const showCGPA = privacySettings?.cgpaVisible ?? true;

  const getPhotoUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const photoSrc = getPhotoUrl(personalInfo?.profilePhoto || profile.user?.avatar);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 bg-gray-50 min-h-screen font-sans">
      
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <img 
              src={photoSrc} 
              alt="Profile" 
              className="w-28 h-28 rounded-full border-4 border-white shadow-md bg-white object-cover"
            />
            {showResume && profile.resume && (
              <a href={profile.resume} download target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">
                <Download className="w-4 h-4" /> Download Resume
              </a>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{personalInfo?.firstName} {personalInfo?.lastName}</h1>
            <p className="text-lg text-gray-600 mt-1">{personalInfo?.headline}</p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              {(location?.city || location?.country) && (
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {location.city}{location.city && location.country ? ', ' : ''}{location.country}</div>
              )}
              {showEmail && profile.user?.email && (
                <div className="flex items-center gap-1"><Mail className="w-4 h-4" /> {profile.user.email}</div>
              )}
              {showPhone && personalInfo?.phone && (
                <div className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personalInfo.phone}</div>
              )}
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600" title="LinkedIn"><LinkIcon className="w-5 h-5" /></a>}
              {socialLinks?.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900" title="GitHub"><UserCircle className="w-5 h-5" /></a>}
              {socialLinks?.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400" title="Twitter/X"><Globe className="w-5 h-5" /></a>}
              {socialLinks?.portfolio && <a href={socialLinks.portfolio} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-600" title="Portfolio"><ExternalLink className="w-5 h-5" /></a>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About */}
          {about && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">About Me</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{about}</p>
            </div>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Work Experience</h2>
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-blue-200 last:border-0 pb-2">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                    <h3 className="font-semibold text-lg text-gray-900">{exp.title}</h3>
                    <div className="text-primary font-medium">{exp.company}</div>
                    <div className="text-sm text-gray-500 mb-2">{exp.duration}</div>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap mb-2">{exp.responsibilities}</p>
                    {exp.skillsUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {exp.skillsUsed.map((skill, sIdx) => (
                          <span key={sIdx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internships */}
          {internships?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Internships</h2>
              <div className="space-y-6">
                {internships.map((intern, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-indigo-200 last:border-0 pb-2">
                    <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                    <h3 className="font-semibold text-lg text-gray-900">{intern.role}</h3>
                    <div className="text-indigo-600 font-medium">{intern.company} {intern.location && `- ${intern.location}`}</div>
                    <div className="text-sm text-gray-500 mb-2">{intern.duration}</div>
                    {intern.description && <p className="text-gray-600 text-sm whitespace-pre-wrap mb-2">{intern.description}</p>}
                    {intern.technologiesUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {intern.technologiesUsed.map((tech, tIdx) => (
                          <span key={tIdx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Projects</h2>
              <div className="grid grid-cols-1 gap-6">
                {projects.map((proj, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{proj.title}</h3>
                      <div className="flex gap-2 text-gray-400">
                        {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:text-gray-900"><UserCircle className="w-4 h-4" /></a>}
                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:text-blue-600"><ExternalLink className="w-4 h-4" /></a>}
                      </div>
                    </div>
                    {proj.role && <div className="text-sm text-gray-500 mb-2">{proj.role} | {proj.duration}</div>}
                    <p className="text-gray-600 text-sm mb-3">{proj.description}</p>
                    {proj.technologiesUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {proj.technologiesUsed.map((tech, tIdx) => (
                          <span key={tIdx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements && (achievements.hackathons?.length > 0 || achievements.codingCompetitions?.length > 0 || achievements.awards?.length > 0 || achievements.scholarships?.length > 0 || achievements.academic?.length > 0) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Achievements</h2>
              <div className="space-y-3 text-gray-700">
                {achievements.hackathons?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Hackathons</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {achievements.hackathons.map((item, idx) => <li key={`hack-${idx}`}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {achievements.codingCompetitions?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Coding Competitions</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {achievements.codingCompetitions.map((item, idx) => <li key={`comp-${idx}`}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {achievements.awards?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Awards</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {achievements.awards.map((item, idx) => <li key={`award-${idx}`}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {achievements.scholarships?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Scholarships</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {achievements.scholarships.map((item, idx) => <li key={`schol-${idx}`}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {achievements.academic?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Academic</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {achievements.academic.map((item, idx) => <li key={`acad-${idx}`}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Skills */}
          {skills && Object.keys(skills).some(k => skills[k]?.length > 0) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Skills</h2>
              <div className="space-y-4">
                {skills.programmingLanguages?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.programmingLanguages.map((s, i) => <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">{s.name}</span>)}
                    </div>
                  </div>
                )}
                {skills.frameworks?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Frameworks</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.frameworks.map((s, i) => <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">{s.name}</span>)}
                    </div>
                  </div>
                )}
                {skills.databases?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Databases</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.databases.map((s, i) => <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">{s.name}</span>)}
                    </div>
                  </div>
                )}
                {skills.tools?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Tools & Tech</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.tools.map((s, i) => <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">{s.name}</span>)}
                    </div>
                  </div>
                )}
                {skills.cloudDevOps?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Cloud & DevOps</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.cloudDevOps.map((s, i) => <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">{s.name}</span>)}
                    </div>
                  </div>
                )}
                {skills.softSkills?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Soft Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.softSkills.map((s, i) => <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">{s.name}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Education</h2>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="relative">
                    <h3 className="font-medium text-gray-900">{edu.institution}</h3>
                    <div className="text-sm text-gray-600">{edu.degree} {edu.branch && `- ${edu.branch}`}</div>
                    <div className="text-xs text-gray-500 mt-1">{edu.startYear} - {edu.endYear}</div>
                    {showCGPA && edu.cgpa && <div className="text-sm font-medium text-blue-600 mt-1">CGPA: {edu.cgpa}</div>}
                    {edu.percentage && <div className="text-sm font-medium text-blue-600 mt-1">Percentage: {edu.percentage}%</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Certifications</h2>
              <div className="space-y-4">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="relative">
                    <h3 className="font-medium text-gray-900">{cert.name}</h3>
                    <div className="text-sm text-gray-600">{cert.issuingOrganization}</div>
                    {cert.issueDate && <div className="text-xs text-gray-500 mt-1">{new Date(cert.issueDate).getFullYear()}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coding Profiles */}
          {codingProfiles && Object.values(codingProfiles).some(v => v) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Coding Profiles</h2>
              <div className="space-y-2">
                {Object.keys(codingProfiles).map(key => {
                  if(codingProfiles[key]) {
                    return (
                      <a key={key} href={codingProfiles[key]} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition">
                        <span className="capitalize text-gray-700 font-medium">{key}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    )
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          {/* Languages Known */}
          {languagesKnown?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Languages</h2>
              <div className="space-y-2">
                {languagesKnown.map((lang, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-800">{lang.language}</span>
                    <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;

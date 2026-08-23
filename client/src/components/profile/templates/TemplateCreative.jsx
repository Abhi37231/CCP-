import React from 'react';

const TemplateCreative = ({ profile }) => {
  if (!profile) return null;

  const { 
    personalInfo, location, about, education, skills, projects, experience, 
    socialLinks, internships, certifications, achievements, codingProfiles, languagesKnown 
  } = profile;

  const getPhotoUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const photoSrc = getPhotoUrl(personalInfo?.profilePhoto || profile?.user?.avatar);

  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:w-full print:max-w-full font-sans text-sm text-gray-800 flex overflow-hidden min-h-[297mm]">
      
      {/* Left Sidebar (Accent Color) */}
      <div className="w-[35%] bg-blue-900 text-white p-8">
        
        {/* Profile Image placeholder / Name if no image */}
        <div className="mb-8 text-center border-b border-blue-700 pb-6">
          {photoSrc ? (
            <img src={photoSrc} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-700" />
          ) : (
            <div className="w-24 h-24 bg-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
               {personalInfo?.firstName?.charAt(0)}{personalInfo?.lastName?.charAt(0)}
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-wider mb-1">{personalInfo?.firstName}</h1>
          <h1 className="text-2xl font-light tracking-wider">{personalInfo?.lastName}</h1>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <h2 className="text-blue-300 font-semibold uppercase tracking-wider mb-3 text-xs">Contact</h2>
          <div className="space-y-3 text-sm text-blue-100">
            {personalInfo?.phone && <div className="flex items-center gap-2"><span>📱</span> {personalInfo.phone}</div>}
            {profile?.user?.email && <div className="flex items-center gap-2 break-all"><span>📧</span> {profile.user.email}</div>}
            {(location?.city || location?.country) && (
              <div className="flex items-start gap-2">
                <span>📍</span> {location.city}{location.city && location.country ? ', ' : ''}{location.country}
              </div>
            )}
            {socialLinks?.linkedin && <div className="flex items-center gap-2"><span>💼</span> <a href={socialLinks.linkedin} className="hover:text-white truncate">LinkedIn</a></div>}
            {socialLinks?.github && <div className="flex items-center gap-2"><span>💻</span> <a href={socialLinks.github} className="hover:text-white truncate">GitHub</a></div>}
          </div>
        </div>

        {/* Skills */}
        {skills && Object.keys(skills).some(k => skills[k]?.length > 0) && (
          <div className="mb-8">
            <h2 className="text-blue-300 font-semibold uppercase tracking-wider mb-3 text-xs">Skills</h2>
            <div className="space-y-4 text-sm text-blue-100">
              {skills.programmingLanguages?.length > 0 && (
                <div>
                  <strong className="block text-white mb-1">Languages</strong>
                  <div className="flex flex-wrap gap-1">
                    {skills.programmingLanguages.map(s => <span key={s.name} className="bg-blue-800 px-2 py-0.5 rounded text-xs">{s.name}</span>)}
                  </div>
                </div>
              )}
              {skills.frameworks?.length > 0 && (
                <div>
                  <strong className="block text-white mb-1">Frameworks</strong>
                  <div className="flex flex-wrap gap-1">
                    {skills.frameworks.map(s => <span key={s.name} className="bg-blue-800 px-2 py-0.5 rounded text-xs">{s.name}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Languages */}
        {languagesKnown?.length > 0 && (
          <div>
            <h2 className="text-blue-300 font-semibold uppercase tracking-wider mb-3 text-xs">Languages</h2>
            <div className="space-y-1 text-sm text-blue-100">
              {languagesKnown.map(lang => (
                <div key={lang.language} className="flex justify-between">
                  <span>{lang.language}</span>
                  <span className="text-blue-400 text-xs">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right Main Content */}
      <div className="w-[65%] p-8 bg-white">
        
        {/* Summary */}
        {about && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-900 inline-block"></span> Profile
            </h2>
            <p className="text-gray-600 leading-relaxed text-justify">{about}</p>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-900 inline-block"></span> Experience
            </h2>
            <div className="space-y-5">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                  <div className="flex justify-between text-blue-900 font-medium text-sm mb-2">
                    <span>{exp.company}</span>
                    <span className="text-gray-500">{exp.duration}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{exp.responsibilities}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-900 inline-block"></span> Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-gray-900">{edu.degree} {edu.branch && `- ${edu.branch}`}</h3>
                  <div className="flex justify-between text-blue-900 font-medium text-sm mb-1">
                    <span>{edu.institution}</span>
                    <span className="text-gray-500">{edu.startYear} - {edu.endYear || 'Present'}</span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {edu.cgpa ? `CGPA: ${edu.cgpa}` : edu.percentage ? `Percentage: ${edu.percentage}%` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-900 inline-block"></span> Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {proj.title}
                    {proj.githubUrl && <a href={proj.githubUrl} className="text-blue-600 text-xs hover:underline font-normal">Repo</a>}
                  </h3>
                  <p className="text-gray-500 text-xs mb-1">{proj.duration}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-1">{proj.description}</p>
                  {proj.technologiesUsed?.length > 0 && (
                    <p className="text-gray-400 text-xs font-mono">{proj.technologiesUsed.join(' · ')}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default TemplateCreative;

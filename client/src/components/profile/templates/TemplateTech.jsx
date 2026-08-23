import React from 'react';

const TemplateTech = ({ profile }) => {
  if (!profile) return null;

  const { 
    personalInfo, location, about, education, skills, projects, experience, 
    socialLinks, internships, certifications, achievements, codingProfiles, languagesKnown 
  } = profile;

  return (
    <div className="max-w-[210mm] mx-auto bg-gray-50 print:bg-white p-[20mm] shadow-lg print:shadow-none print:w-full print:max-w-full font-sans text-sm text-gray-800">
      
      {/* Header */}
      <header className="bg-gray-900 text-gray-100 p-6 rounded-lg mb-6 shadow-sm">
        <h1 className="text-3xl font-bold font-mono text-green-400 mb-1">
          &gt; {personalInfo?.firstName}_{personalInfo?.lastName}
        </h1>
        <p className="text-gray-400 font-mono text-xs mb-3">Software Engineer // Developer</p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono">
          {personalInfo?.phone && <span>📞 {personalInfo.phone}</span>}
          {profile?.user?.email && <span>📧 {profile.user.email}</span>}
          {(location?.city || location?.country) && <span>📍 {location.city}, {location.country}</span>}
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono mt-3">
          {socialLinks?.linkedin && <a href={socialLinks.linkedin} className="text-blue-300 hover:text-blue-200">in/linkedin</a>}
          {socialLinks?.github && <a href={socialLinks.github} className="text-gray-300 hover:text-white">git/github</a>}
          {socialLinks?.portfolio && <a href={socialLinks.portfolio} className="text-purple-300 hover:text-purple-200">www/portfolio</a>}
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-[1fr_300px] gap-6">
        
        {/* Left Column - Main Experience & Projects */}
        <div>
          {/* Summary */}
          {about && (
            <section className="mb-6">
              <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-3 pb-1 font-mono text-gray-900">./Summary</h2>
              <p className="text-gray-700 leading-relaxed">{about}</p>
            </section>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-3 pb-1 font-mono text-gray-900">./Experience</h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900">{exp.title}</h3>
                      <span className="font-mono text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{exp.duration}</span>
                    </div>
                    <div className="text-green-700 font-semibold text-sm mb-2">@ {exp.company}</div>
                    <p className="text-gray-700 text-sm">{exp.responsibilities}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-3 pb-1 font-mono text-gray-900">./Projects</h2>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        {proj.title}
                        {proj.githubUrl && <a href={proj.githubUrl} className="text-blue-600 font-mono text-xs hover:underline">[src]</a>}
                        {proj.liveUrl && <a href={proj.liveUrl} className="text-green-600 font-mono text-xs hover:underline">[demo]</a>}
                      </h3>
                      <span className="font-mono text-xs text-gray-500">{proj.duration}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{proj.description}</p>
                    {proj.technologiesUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {proj.technologiesUsed.map(t => (
                          <span key={t} className="font-mono text-[10px] bg-gray-800 text-green-400 px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Skills, Ed, etc */}
        <div>
          {/* Skills */}
          {skills && Object.keys(skills).some(k => skills[k]?.length > 0) && (
            <section className="mb-6 bg-white p-4 rounded border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold border-b-2 border-gray-300 mb-3 pb-1 font-mono text-gray-900">./Skills</h2>
              <div className="space-y-3 font-mono text-xs">
                {skills.programmingLanguages?.length > 0 && (
                  <div>
                    <strong className="text-gray-900 block mb-1">LANGUAGES:</strong>
                    <div className="text-gray-600">{skills.programmingLanguages.map(s => s.name).join(', ')}</div>
                  </div>
                )}
                {skills.frameworks?.length > 0 && (
                  <div>
                    <strong className="text-gray-900 block mb-1">FRAMEWORKS:</strong>
                    <div className="text-gray-600">{skills.frameworks.map(s => s.name).join(', ')}</div>
                  </div>
                )}
                {skills.databases?.length > 0 && (
                  <div>
                    <strong className="text-gray-900 block mb-1">DATABASES:</strong>
                    <div className="text-gray-600">{skills.databases.map(s => s.name).join(', ')}</div>
                  </div>
                )}
                {skills.tools?.length > 0 && (
                  <div>
                    <strong className="text-gray-900 block mb-1">TOOLS:</strong>
                    <div className="text-gray-600">{skills.tools.map(s => s.name).join(', ')}</div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <section className="mb-6 bg-white p-4 rounded border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold border-b-2 border-gray-300 mb-3 pb-1 font-mono text-gray-900">./Education</h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-sm text-gray-900">{edu.institution}</h3>
                    <div className="text-gray-700 text-xs">{edu.degree}</div>
                    <div className="flex justify-between font-mono text-[10px] text-gray-500 mt-1">
                      <span>{edu.startYear} - {edu.endYear || 'Present'}</span>
                      <span className="font-bold text-green-600">{edu.cgpa ? edu.cgpa : edu.percentage ? `${edu.percentage}%` : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Coding Profiles */}
          {codingProfiles && Object.values(codingProfiles).some(v => v) && (
            <section className="mb-6 bg-white p-4 rounded border border-gray-200 shadow-sm">
               <h2 className="text-lg font-bold border-b-2 border-gray-300 mb-3 pb-1 font-mono text-gray-900">./Profiles</h2>
               <div className="flex flex-col gap-2 font-mono text-xs">
                 {codingProfiles.leetcode && <a href={codingProfiles.leetcode} className="text-blue-600 hover:underline">LeetCode</a>}
                 {codingProfiles.codechef && <a href={codingProfiles.codechef} className="text-blue-600 hover:underline">CodeChef</a>}
                 {codingProfiles.codeforces && <a href={codingProfiles.codeforces} className="text-blue-600 hover:underline">CodeForces</a>}
                 {codingProfiles.hackerrank && <a href={codingProfiles.hackerrank} className="text-blue-600 hover:underline">HackerRank</a>}
                 {codingProfiles.geeksforgeeks && <a href={codingProfiles.geeksforgeeks} className="text-blue-600 hover:underline">GeeksForGeeks</a>}
               </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default TemplateTech;

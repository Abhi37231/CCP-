import React from 'react';

const TemplateModern = ({ profile }) => {
  if (!profile) return null;

  const { 
    personalInfo, location, about, education, skills, projects, experience, 
    socialLinks, internships, certifications, achievements, codingProfiles, languagesKnown 
  } = profile;

  const renderCodingProfiles = () => {
    if (!codingProfiles) return null;
    const profiles = [];
    if (codingProfiles.leetcode) profiles.push({ name: 'LeetCode', url: codingProfiles.leetcode });
    if (codingProfiles.codechef) profiles.push({ name: 'CodeChef', url: codingProfiles.codechef });
    if (codingProfiles.codeforces) profiles.push({ name: 'CodeForces', url: codingProfiles.codeforces });
    if (codingProfiles.hackerrank) profiles.push({ name: 'HackerRank', url: codingProfiles.hackerrank });
    if (codingProfiles.geeksforgeeks) profiles.push({ name: 'GeeksForGeeks', url: codingProfiles.geeksforgeeks });
    
    if (profiles.length === 0) return null;

    return (
      <div className="text-gray-500 flex flex-wrap gap-3 mt-2 text-sm">
        {profiles.map((p, idx) => (
          <span key={p.name}>
            <a href={p.url} className="text-teal-600 hover:text-teal-800 transition">{p.name}</a>
          </span>
        ))}
      </div>
    );
  };

  const SectionTitle = ({ title }) => (
    <h2 className="text-xl font-semibold text-teal-800 mb-3 border-b-2 border-teal-100 pb-1">{title}</h2>
  );

  return (
    <div className="max-w-[210mm] mx-auto bg-white p-[20mm] shadow-lg print:shadow-none print:w-full print:max-w-full font-sans text-sm text-gray-800 leading-relaxed">
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
          {personalInfo?.firstName} <span className="text-teal-700">{personalInfo?.lastName}</span>
        </h1>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 text-sm mt-3">
          {personalInfo?.phone && <span className="flex items-center">📞 {personalInfo.phone}</span>}
          {profile?.user?.email && <span className="flex items-center">✉️ {profile.user.email}</span>}
          {(location?.city || location?.country) && (
            <span className="flex items-center">
              📍 {location.city}{location.city && location.country ? ', ' : ''}{location.country}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 text-sm mt-2">
          {socialLinks?.linkedin && <a href={socialLinks.linkedin} className="text-teal-600 hover:underline">LinkedIn</a>}
          {socialLinks?.github && <a href={socialLinks.github} className="text-teal-600 hover:underline">GitHub</a>}
          {socialLinks?.portfolio && <a href={socialLinks.portfolio} className="text-teal-600 hover:underline">Portfolio</a>}
        </div>
        {renderCodingProfiles()}
      </header>

      {/* Summary */}
      {about && (
        <section className="mb-6">
          <SectionTitle title="Summary" />
          <p className="text-gray-700">{about}</p>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Experience" />
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative pl-4 border-l-2 border-teal-200">
                <div className="absolute w-2 h-2 bg-teal-500 rounded-full -left-[5px] top-1.5"></div>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">{exp.title}</h3>
                    <p className="text-teal-700">{exp.company}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">{exp.duration}</span>
                </div>
                <p className="text-gray-700 mt-2">{exp.responsibilities}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Projects" />
          <div className="grid grid-cols-1 gap-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2">
                    {proj.title}
                    <div className="flex gap-2 text-xs font-normal">
                      {proj.githubUrl && <a href={proj.githubUrl} className="text-teal-600 hover:underline border border-teal-200 px-2 py-0.5 rounded-full bg-white">Repo</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} className="text-teal-600 hover:underline border border-teal-200 px-2 py-0.5 rounded-full bg-white">Live</a>}
                    </div>
                  </h3>
                  <span className="text-sm text-gray-500">{proj.duration}</span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{proj.description}</p>
                {proj.technologiesUsed?.length > 0 && (
                   <div className="flex flex-wrap gap-1">
                     {proj.technologiesUsed.map((tech, i) => (
                       <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md">{tech}</span>
                     ))}
                   </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two Column Layout for the rest */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div>
          {/* Education */}
          {education?.length > 0 && (
            <section className="mb-6">
              <SectionTitle title="Education" />
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                    <p className="text-gray-700">{edu.degree} {edu.branch && `in ${edu.branch}`}</p>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">{edu.startYear} - {edu.endYear || 'Present'}</span>
                      <span className="text-teal-700 font-medium">
                        {edu.cgpa ? `CGPA: ${edu.cgpa}` : edu.percentage ? `${edu.percentage}%` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Internships */}
          {internships?.length > 0 && (
            <section className="mb-6">
              <SectionTitle title="Internships" />
              <div className="space-y-4">
                {internships.map((intern, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-gray-900">{intern.role}</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-teal-700">{intern.company}</span>
                      <span className="text-gray-500">{intern.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Skills */}
          {skills && Object.keys(skills).some(k => skills[k]?.length > 0) && (
            <section className="mb-6">
              <SectionTitle title="Skills" />
              <div className="space-y-2 text-sm">
                {skills.programmingLanguages?.length > 0 && (
                  <div>
                    <strong className="text-gray-900 block mb-1">Languages</strong>
                    <div className="text-gray-600">{skills.programmingLanguages.map(s => s.name).join(' • ')}</div>
                  </div>
                )}
                {skills.frameworks?.length > 0 && (
                  <div className="mt-2">
                    <strong className="text-gray-900 block mb-1">Frameworks</strong>
                    <div className="text-gray-600">{skills.frameworks.map(s => s.name).join(' • ')}</div>
                  </div>
                )}
                {skills.databases?.length > 0 && (
                  <div className="mt-2">
                    <strong className="text-gray-900 block mb-1">Databases & Tools</strong>
                    <div className="text-gray-600">
                      {[...(skills.databases || []), ...(skills.tools || [])].map(s => s.name).join(' • ')}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Certifications & Achievements */}
          {(certifications?.length > 0 || achievements?.hackathons?.length > 0) && (
            <section className="mb-6">
              <SectionTitle title="Highlights" />
              {certifications?.length > 0 && (
                <div className="mb-3">
                  <strong className="text-gray-900 block mb-1 text-sm">Certifications</strong>
                  <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
                    {certifications.slice(0,3).map((cert, idx) => (
                      <li key={idx}>{cert.name} <span className="text-gray-400">({cert.issuingOrganization})</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {achievements?.hackathons?.length > 0 && (
                <div>
                  <strong className="text-gray-900 block mb-1 text-sm">Hackathons</strong>
                  <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
                    {achievements.hackathons.slice(0,2).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

      </div>
    </div>
  );
};

export default TemplateModern;

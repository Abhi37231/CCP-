import React from 'react';

const TemplateClassic = ({ profile }) => {
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
      <div className="text-gray-600 flex flex-wrap justify-center items-center gap-2 mt-1">
        {profiles.map((p, idx) => (
          <span key={p.name}>
            <a href={p.url} className="text-blue-600 hover:underline">{p.name}</a>
            {idx < profiles.length - 1 && <span className="mx-2 text-gray-400">•</span>}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-[210mm] mx-auto bg-white p-[20mm] shadow-lg print:shadow-none print:w-full print:max-w-full font-serif text-sm">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase text-gray-900 tracking-wider">
          {personalInfo?.firstName} {personalInfo?.lastName}
        </h1>
        <div className="text-gray-600 mt-2 flex flex-wrap justify-center items-center gap-2">
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.phone && <span>•</span>}
          {profile?.user?.email && <span>{profile.user.email}</span>}
          {(location?.city || location?.country) && <span>•</span>}
          {(location?.city || location?.country) && <span>{location.city}{location.city && location.country ? ', ' : ''}{location.country}</span>}
        </div>
        <div className="text-gray-600 flex flex-wrap justify-center items-center gap-2 mt-1">
          {socialLinks?.linkedin && <a href={socialLinks.linkedin} className="text-blue-600 hover:underline">LinkedIn</a>}
          {socialLinks?.github && <span className="text-gray-400">•</span>}
          {socialLinks?.github && <a href={socialLinks.github} className="text-blue-600 hover:underline">GitHub</a>}
          {socialLinks?.portfolio && <span className="text-gray-400">•</span>}
          {socialLinks?.portfolio && <a href={socialLinks.portfolio} className="text-blue-600 hover:underline">Portfolio</a>}
        </div>
        {renderCodingProfiles()}
      </div>

      {/* Summary */}
      {about && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 text-gray-800 tracking-wider">Summary</h2>
          <p className="text-gray-700 text-justify leading-relaxed">{about}</p>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 text-gray-800 tracking-wider">Education</h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                  <p className="text-gray-700 italic">{edu.degree} {edu.branch && `- ${edu.branch}`}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{edu.startYear} - {edu.endYear || 'Present'}</p>
                  {edu.cgpa && <p className="text-gray-600">CGPA: {edu.cgpa}</p>}
                  {edu.percentage && <p className="text-gray-600">Percentage: {edu.percentage}%</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && Object.keys(skills).some(k => skills[k]?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 text-gray-800 tracking-wider">Technical Skills</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {skills.programmingLanguages?.length > 0 && (
              <li><strong>Languages:</strong> {skills.programmingLanguages.map(s => s.name).join(', ')}</li>
            )}
            {skills.frameworks?.length > 0 && (
              <li><strong>Frameworks:</strong> {skills.frameworks.map(s => s.name).join(', ')}</li>
            )}
            {skills.databases?.length > 0 && (
              <li><strong>Databases:</strong> {skills.databases.map(s => s.name).join(', ')}</li>
            )}
            {skills.tools?.length > 0 && (
              <li><strong>Tools/Tech:</strong> {skills.tools.map(s => s.name).join(', ')}</li>
            )}
            {skills.cloudDevOps?.length > 0 && (
              <li><strong>Cloud & DevOps:</strong> {skills.cloudDevOps.map(s => s.name).join(', ')}</li>
            )}
            {skills.softSkills?.length > 0 && (
              <li><strong>Soft Skills:</strong> {skills.softSkills.map(s => s.name).join(', ')}</li>
            )}
          </ul>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 text-gray-800 tracking-wider">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{exp.duration}</p>
                </div>
                <p className="text-gray-700 text-justify leading-relaxed">{exp.responsibilities}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Internships */}
      {internships?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 text-gray-800 tracking-wider">Internships</h2>
          <div className="space-y-4">
            {internships.map((intern, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{intern.role}</h3>
                    <p className="text-gray-700 font-medium">{intern.company} {intern.location && `- ${intern.location}`}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{intern.duration}</p>
                </div>
                {intern.description && <p className="text-gray-700 text-justify leading-relaxed">{intern.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 text-gray-800 tracking-wider">Projects</h2>
          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">
                    {proj.title}
                    {proj.githubUrl && <a href={proj.githubUrl} className="text-blue-600 hover:underline font-normal ml-2 text-xs">| Repo</a>}
                    {proj.liveUrl && <a href={proj.liveUrl} className="text-blue-600 hover:underline font-normal ml-2 text-xs">| Live</a>}
                  </h3>
                  <p className="font-semibold text-gray-900">{proj.duration}</p>
                </div>
                <p className="text-gray-700 text-justify leading-relaxed mb-1">{proj.description}</p>
                {proj.technologiesUsed?.length > 0 && (
                   <p className="text-gray-600 italic text-xs">Technologies: {proj.technologiesUsed.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 text-gray-800 tracking-wider">Certifications</h2>
          <div className="space-y-3">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.issuingOrganization}</p>
                </div>
                {cert.issueDate && (
                  <div className="text-right">
                    <p className="text-gray-600">{new Date(cert.issueDate).getFullYear()}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements && (achievements.hackathons?.length > 0 || achievements.codingCompetitions?.length > 0 || achievements.awards?.length > 0 || achievements.scholarships?.length > 0 || achievements.academic?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 text-gray-800 tracking-wider">Achievements</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {achievements.hackathons?.map((item, idx) => <li key={`hack-${idx}`}>{item}</li>)}
            {achievements.codingCompetitions?.map((item, idx) => <li key={`comp-${idx}`}>{item}</li>)}
            {achievements.awards?.map((item, idx) => <li key={`award-${idx}`}>{item}</li>)}
            {achievements.scholarships?.map((item, idx) => <li key={`schol-${idx}`}>{item}</li>)}
            {achievements.academic?.map((item, idx) => <li key={`acad-${idx}`}>{item}</li>)}
          </ul>
        </div>
      )}

      {/* Languages */}
      {languagesKnown?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 text-gray-800 tracking-wider">Languages Known</h2>
          <p className="text-gray-700">
            {languagesKnown.map(lang => `${lang.language} (${lang.proficiency})`).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateClassic;

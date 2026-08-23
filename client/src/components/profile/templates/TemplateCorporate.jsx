import React from 'react';

const TemplateCorporate = ({ profile }) => {
  if (!profile) return null;

  const { 
    personalInfo, location, about, education, skills, projects, experience, 
    socialLinks, internships, certifications, achievements, codingProfiles, languagesKnown 
  } = profile;

  const SectionHeading = ({ title }) => (
    <div className="mb-4 mt-6">
      <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest">{title}</h2>
      <div className="h-0.5 w-full bg-gray-900 mt-1"></div>
    </div>
  );

  return (
    <div className="max-w-[210mm] mx-auto bg-white p-[20mm] shadow-lg print:shadow-none print:w-full print:max-w-full font-serif text-sm text-gray-900">
      
      {/* Header */}
      <div className="text-center mb-6 border-b-4 border-gray-900 pb-6">
        <h1 className="text-4xl font-extrabold uppercase tracking-[0.2em] mb-3">{personalInfo?.firstName} {personalInfo?.lastName}</h1>
        
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm font-medium">
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {profile?.user?.email && (
            <>
              <span className="text-gray-400">|</span>
              <span>{profile.user.email}</span>
            </>
          )}
          {(location?.city || location?.country) && (
            <>
              <span className="text-gray-400">|</span>
              <span>{location.city}{location.city && location.country ? ', ' : ''}{location.country}</span>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm font-medium mt-2">
          {socialLinks?.linkedin && <a href={socialLinks.linkedin} className="text-blue-800 hover:underline">LinkedIn</a>}
          {socialLinks?.github && (
            <>
              <span className="text-gray-400">|</span>
              <a href={socialLinks.github} className="text-blue-800 hover:underline">GitHub</a>
            </>
          )}
          {socialLinks?.portfolio && (
            <>
              <span className="text-gray-400">|</span>
              <a href={socialLinks.portfolio} className="text-blue-800 hover:underline">Portfolio</a>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {about && (
        <div>
          <SectionHeading title="Professional Summary" />
          <p className="text-justify leading-relaxed">{about}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div>
          <SectionHeading title="Professional Experience" />
          <div className="space-y-5">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{exp.title}</h3>
                  <span className="font-semibold">{exp.duration}</span>
                </div>
                <div className="italic text-gray-700 mb-2">{exp.company}</div>
                <p className="text-justify leading-relaxed pl-4 border-l-2 border-gray-300">
                  {exp.responsibilities}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div>
          <SectionHeading title="Key Projects" />
          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold">
                    {proj.title}
                    {proj.githubUrl && <a href={proj.githubUrl} className="text-blue-800 hover:underline font-normal text-xs ml-2">[Repo]</a>}
                    {proj.liveUrl && <a href={proj.liveUrl} className="text-blue-800 hover:underline font-normal text-xs ml-2">[Live]</a>}
                  </h3>
                  <span className="font-semibold text-xs">{proj.duration}</span>
                </div>
                <p className="text-justify leading-relaxed mb-1">{proj.description}</p>
                {proj.technologiesUsed?.length > 0 && (
                   <p className="text-xs text-gray-600"><strong>Technologies:</strong> {proj.technologiesUsed.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div>
          <SectionHeading title="Education" />
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.institution}</h3>
                  <div className="italic">{edu.degree} {edu.branch && `- ${edu.branch}`}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{edu.startYear} - {edu.endYear || 'Present'}</div>
                  <div className="text-sm">
                    {edu.cgpa ? `CGPA: ${edu.cgpa}` : edu.percentage ? `Percentage: ${edu.percentage}%` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Other */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Col */}
        <div>
          {skills && Object.keys(skills).some(k => skills[k]?.length > 0) && (
            <div>
              <SectionHeading title="Core Competencies" />
              <ul className="list-inside list-square space-y-1">
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
                  <li><strong>Tools:</strong> {skills.tools.map(s => s.name).join(', ')}</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Right Col */}
        <div>
          {certifications?.length > 0 && (
            <div>
              <SectionHeading title="Certifications" />
              <ul className="list-inside list-square space-y-1">
                {certifications.map((cert, idx) => (
                  <li key={idx}><strong>{cert.name}</strong> - {cert.issuingOrganization}</li>
                ))}
              </ul>
            </div>
          )}
          
          {languagesKnown?.length > 0 && (
            <div>
              <SectionHeading title="Languages" />
              <div className="flex flex-wrap gap-x-4">
                {languagesKnown.map(lang => (
                  <span key={lang.language}><strong>{lang.language}</strong> ({lang.proficiency})</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default TemplateCorporate;

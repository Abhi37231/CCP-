const JobSeekerProfile = require('../models/JobSeekerProfile');
const User = require('../models/User');

const seedDemoProfile = async (userId) => {
  try {
    const demoData = {
      user: userId,
      personalInfo: {
        firstName: 'Abhi',
        lastName: 'Patil',
        headline: 'MERN Stack Developer | Computer Engineering Student',
        phone: '+91 9876543210',
        profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop', // Professional placeholder
      },
      location: {
        city: 'Nashik',
        state: 'Maharashtra',
        country: 'India'
      },
      about: 'Passionate Computer Engineering student with a strong interest in Full Stack Web Development, AI tools, and scalable software solutions. Experienced in building modern MERN applications and continuously learning new technologies to solve real-world problems.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/abhipatil',
        github: 'https://github.com/abhipatil',
        portfolio: 'https://abhipatil.dev',
        twitter: 'https://twitter.com/abhipatil'
      },
      education: [
        {
          degree: 'Bachelor of Engineering',
          branch: 'Computer Engineering',
          institution: 'Sandip Institute of Technology and Research Centre',
          board: 'Savitribai Phule Pune University',
          startYear: 2023,
          endYear: 2027,
          currentSemester: 6,
          cgpa: 8.72,
          status: 'Pursuing'
        }
      ],
      skills: {
        programmingLanguages: [
          { name: 'JavaScript', proficiency: 'Advanced' },
          { name: 'TypeScript', proficiency: 'Intermediate' },
          { name: 'Java', proficiency: 'Intermediate' },
          { name: 'Python', proficiency: 'Intermediate' },
          { name: 'C++', proficiency: 'Intermediate' }
        ],
        frameworks: [
          { name: 'React', proficiency: 'Advanced' },
          { name: 'Node.js', proficiency: 'Advanced' },
          { name: 'Express.js', proficiency: 'Advanced' },
          { name: 'Next.js', proficiency: 'Intermediate' },
          { name: 'Tailwind CSS', proficiency: 'Advanced' }
        ],
        databases: [
          { name: 'MongoDB', proficiency: 'Advanced' },
          { name: 'MySQL', proficiency: 'Intermediate' }
        ],
        tools: [
          { name: 'Git', proficiency: 'Advanced' },
          { name: 'GitHub', proficiency: 'Advanced' },
          { name: 'VS Code', proficiency: 'Advanced' },
          { name: 'Postman', proficiency: 'Advanced' },
          { name: 'Docker', proficiency: 'Intermediate' }
        ],
        cloudDevOps: [
          { name: 'Vercel', proficiency: 'Advanced' },
          { name: 'Render', proficiency: 'Intermediate' },
          { name: 'Netlify', proficiency: 'Advanced' }
        ],
        softSkills: [
          { name: 'Leadership', proficiency: 'Advanced' },
          { name: 'Communication', proficiency: 'Advanced' },
          { name: 'Teamwork', proficiency: 'Advanced' },
          { name: 'Problem Solving', proficiency: 'Advanced' }
        ]
      },
      projects: [
        {
          title: 'MERN E-Commerce Platform',
          description: 'Full-featured e-commerce application with JWT Authentication, Admin Dashboard, and Payment Integration.',
          technologiesUsed: ['React', 'Node.js', 'Express', 'MongoDB'],
          role: 'Full Stack Developer',
          duration: '3 Months',
          githubUrl: 'https://github.com/demo/ecommerce',
          liveUrl: 'https://demo-ecommerce.vercel.app',
        },
        {
          title: 'College Placement Portal',
          description: 'Student and Recruiter Portal for Resume Management and Job Applications.',
          technologiesUsed: ['React', 'Express', 'MongoDB'],
          role: 'Full Stack Developer',
          duration: '2 Months',
          githubUrl: 'https://github.com/demo/placement',
          liveUrl: 'https://placement-demo.vercel.app',
        },
        {
          title: 'AI Resume Builder',
          description: 'ATS Resume Generator utilizing OpenAI API for content optimization.',
          technologiesUsed: ['React', 'Node.js', 'OpenAI API', 'MongoDB'],
          role: 'Backend Developer',
          duration: '1 Month',
        }
      ],
      internships: [
        {
          company: 'ABC Technologies',
          role: 'MERN Stack Developer Intern',
          duration: 'June 2026 – August 2026',
          location: 'Remote',
          description: 'Worked on REST APIs, authentication, and frontend development.',
        }
      ],
      certifications: [
        { name: 'MongoDB Associate', issuingOrganization: 'MongoDB', issueDate: new Date('2024-01-15') },
        { name: 'React Developer Certificate', issuingOrganization: 'Meta', issueDate: new Date('2024-03-20') },
        { name: 'JavaScript Algorithms', issuingOrganization: 'freeCodeCamp', issueDate: new Date('2023-11-10') },
        { name: 'Git & GitHub Certification', issuingOrganization: 'Coursera', issueDate: new Date('2023-09-05') }
      ],
      achievements: {
        hackathons: ['Finalist in National Hackathon'],
        codingCompetitions: ['Solved 300+ DSA Problems'],
        academic: ['Built 10+ Full Stack Projects'],
        awards: ['Technical Club Member']
      },
      codingProfiles: {
        leetcode: 'https://leetcode.com/abhipatil',
        codechef: 'https://codechef.com/users/abhipatil',
        geeksforgeeks: 'https://auth.geeksforgeeks.org/user/abhipatil',
        hackerrank: 'https://hackerrank.com/abhipatil'
      },
      languagesKnown: [
        { language: 'English', proficiency: 'Fluent' },
        { language: 'Hindi', proficiency: 'Native' },
        { language: 'Marathi', proficiency: 'Native' }
      ],
      interests: ['Full Stack Development', 'Artificial Intelligence', 'Cloud Computing', 'Open Source', 'DevOps', 'UI/UX'],
      jobPreferences: {
        role: 'Full Stack Developer',
        location: 'Pune, Bangalore, Hyderabad',
        employmentType: 'Full-Time',
        expectedSalary: { currency: 'INR', min: 800000, max: 1200000 }
      },
      privacySettings: {
        phoneVisible: true,
        emailVisible: true,
        resumeVisible: true,
        cgpaVisible: true,
        socialLinksVisible: true,
        codingProfilesVisible: true,
      },
      profileCompletion: 100,
      resume: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' // ATS Resume placeholder
    };

    let profile = await JobSeekerProfile.findOne({ user: userId });
    
    if (profile) {
      // Update existing profile with demo data
      await JobSeekerProfile.findOneAndUpdate(
        { user: userId },
        { $set: demoData },
        { new: true, runValidators: true }
      );
    } else {
      // Create new demo profile
      await JobSeekerProfile.create(demoData);
    }

    console.log('Demo profile seeded successfully for user:', userId);
  } catch (error) {
    console.error('Error seeding demo profile:', error);
  }
};

module.exports = seedDemoProfile;

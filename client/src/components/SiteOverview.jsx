import React from 'react';
import {
  Cpu,
  ShieldCheck,
  FileText,
  Compass,
  CheckCircle2,
  CalendarCheck,
  Zap,
  Workflow,
  Target,
  FileCheck
} from 'lucide-react';

const SiteOverview = () => {
  return (
    <div className="w-full bg-surface-container-lowest text-on-surface relative overflow-hidden py-16 md:py-24 border-t border-white/5">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-2/3 -left-32 w-[600px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 -right-32 w-[600px] h-[500px] bg-tertiary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop relative z-10 space-y-24">


        {/* =========================================================================
            SECTION 1: OUR SITE FEATURES (FEATURE-WISE BREAKDOWN)
           ========================================================================= */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-tertiary font-label-sm text-label-sm uppercase tracking-wider mb-2 font-semibold">
                <Zap className="w-4 h-4" /> Core Capabilities
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface">
                Our Site Features
              </h2>
            </div>
            <p className="text-sm md:text-base text-on-surface-variant max-w-xl">
              Engineered with modern AI and recruitment standards to give candidates and companies an unprecedented hiring advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: AI ATS Resume Analyzer */}
            <div className="rounded-2xl bg-surface-container/40 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                    Gemini AI Powered
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">AI ATS Resume Analyzer</h3>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Evaluates resumes in PDF or DOCX format against specific job descriptions to diagnose rejection causes before application.
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-on-surface/90 pt-2 border-t border-white/5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>0-100% Match Scoring:</strong> Measures holistic alignment with requirements.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>Keyword Extraction:</strong> Pinpoints matched vs. critical missing technical skills.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>ATS Formatting Audit:</strong> Identifies unreadable tables, columns, or fonts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>Actionable Tips:</strong> Specific revision recommendations generated instantly.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-on-surface-variant">
                <span>Model: Google Gemini Flash</span>
                <span className="text-tertiary font-mono font-semibold">Strict JSON Schema</span>
              </div>
            </div>

            {/* Feature 2: AI Dynamic Career Roadmap */}
            <div className="rounded-2xl bg-surface-container/40 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between hover:border-secondary/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary/20 text-secondary border border-secondary/30">
                    Adaptive Mentor
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Dynamic Career Roadmap</h3>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Custom learning mentor that bridges candidate skill deficits based on current credentials and desired dream roles.
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-on-surface/90 pt-2 border-t border-white/5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span><strong>12-Week Structured Plan:</strong> Weekly progressive themes & sub-topics.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span><strong>Daily Action Goals:</strong> Concrete tasks with targeted time allocations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span><strong>4-Tier Project Blueprints:</strong> Easy, Medium, Advanced & Industry-grade.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span><strong>Mock Interview Question Bank:</strong> Technical, Behavioral & System Design.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-on-surface-variant">
                <span>Personalized Curriculum</span>
                <span className="text-secondary font-mono font-semibold">Goal Tracking</span>
              </div>
            </div>

            {/* Feature 3: Automated Corporate CIN Verification */}
            <div className="rounded-2xl bg-surface-container/40 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between hover:border-tertiary/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-tertiary/20 text-tertiary border border-tertiary/30">
                    MCA Verified
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Corporate CIN & KYC Verification</h3>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Safeguards candidates from fraudulent listings by requiring all employers to validate their 21-digit Indian CIN.
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-on-surface/90 pt-2 border-t border-white/5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>MCA Cross-Referencing:</strong> Validates registration against ministry databases.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>Multi-Model Fallback:</strong> Automated routing across Gemini 3.5, 3.1 & 3.6.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>Verified Company Badges:</strong> Visible trust badges on all approved job cards.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>Scam Elimination:</strong> Zero tolerance for unregistered shell entities.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-on-surface-variant">
                <span>Govt Registry Link</span>
                <span className="text-tertiary font-mono font-semibold">Active Badge</span>
              </div>
            </div>

            {/* Feature 4: Interactive Multi-Template Resume Builder */}
            <div className="rounded-2xl bg-surface-container/40 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                    5 Themes
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Multi-Template Resume Builder</h3>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Live browser-based resume generator that hydrates automatically from candidate profile data into 5 modern styles.
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-on-surface/90 pt-2 border-t border-white/5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Real-Time Profile Hydration:</strong> No need to repeatedly re-enter work experience.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>5 Curated Layouts:</strong> Classic, Modern, Tech, Corporate, and Creative.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Instant Live Preview:</strong> Visual document preview before downloading.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>ATS-Friendly PDF Output:</strong> Clean formatting parsed easily by recruitment systems.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-on-surface-variant">
                <span>In-Browser Generator</span>
                <span className="text-primary font-mono font-semibold">Instant Export</span>
              </div>
            </div>

            {/* Feature 5: Algorithmic Skill-Matching Engine */}
            <div className="rounded-2xl bg-surface-container/40 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between hover:border-secondary/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary/20 text-secondary border border-secondary/30">
                    Smart Match
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Algorithmic Skill Matching</h3>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Evaluates candidate proficiencies against employer job criteria, highlighting high-probability matches.
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-on-surface/90 pt-2 border-t border-white/5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span><strong>50%+ Profile Threshold:</strong> Unlocks algorithmic recommendations automatically.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span><strong>Precision Filters:</strong> Remote, Hybrid, Onsite, Full-Time, and Internship tags.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span><strong>Target Audience Categorization:</strong> Tailored for Students, Working Staff, or Both.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span><strong>Zero Spam:</strong> Matches only against authentic verified corporate positions.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-on-surface-variant">
                <span>Profile-Driven Matching</span>
                <span className="text-secondary font-mono font-semibold">High Precision</span>
              </div>
            </div>

            {/* Feature 6: End-to-End Interview Scheduling */}
            <div className="rounded-2xl bg-surface-container/40 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between hover:border-tertiary/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-tertiary/20 text-tertiary border border-tertiary/30">
                    Live Dispatch
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Integrated Interview Scheduler</h3>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Streamlines recruiter-candidate meeting coordination without disjointed external calendar tools.
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-on-surface/90 pt-2 border-t border-white/5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>Dual Interview Modes:</strong> Online video links (Google Meet/Teams) or physical venues.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>Automated Email Invites:</strong> Instant calendar details and meeting links dispatched.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>Recruiter Private Notes:</strong> Confidential notes and 1-5 star candidate ratings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span><strong>Timeline Status Tracker:</strong> Applied → Shortlisted → Scheduled → Decision.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-on-surface-variant">
                <span>Nodemailer Automation</span>
                <span className="text-tertiary font-mono font-semibold">Zero Friction</span>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 2: HOW IT WORKS / END-TO-END WORKFLOW (INFORMATIONAL)
           ========================================================================= */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              <Workflow className="w-4 h-4" /> Operational Flow
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface">
              How Career Connect Works
            </h2>
            <p className="text-sm text-on-surface-variant">
              A transparent, two-sided workflow connecting validated candidates with verified companies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Candidate Journey */}
            <div className="p-6 md:p-8 rounded-2xl bg-surface-container-low/80 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                  JS
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">The Job Seeker Journey</h3>
                  <span className="text-xs text-primary font-medium">Students, Freshers & Experienced</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Role-Specific Profile Onboarding</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Register as a Fresher (CGPA, college credentials, projects) or Experienced (CTC, notice period, designation).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">AI Resume Audit & Roadmap Generation</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Run resumes through the Gemini ATS Analyzer for scoring, and generate a 12-week roadmap for targeted upskilling.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Match & Apply with Verified Employers</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Browse authentic openings with MCA verified badges and apply directly with your ATS-optimized resume.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Live Interviewing & Offer Acceptance</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Receive automated interview invitations with Google Meet links or venue details, tracking progress from review to offer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter Journey */}
            <div className="p-6 md:p-8 rounded-2xl bg-surface-container-low/80 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                  ER
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">The Recruiter Journey</h3>
                  <span className="text-xs text-secondary font-medium">Companies & HR Talent Teams</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Corporate Registration & CIN KYC</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Submit 21-digit CIN and corporate details. Automated MCA registry validation unlocks verified employer status.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Job Posting & Audience Targeting</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Publish requisitions with salary ranges, required competencies, and target flags (Freshers, Employees, or Both).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">AI ATS Candidate Screening</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Review applicants automatically ranked by AI match scores. Add star ratings and private recruiter notes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Integrated Interview Scheduling</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Coordinate online or in-person interviews directly in-app with automated email calendar invites sent to candidates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SiteOverview;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Download, ArrowLeft, LayoutTemplate } from 'lucide-react';
import { Link } from 'react-router-dom';

import TemplateClassic from './templates/TemplateClassic';
import TemplateModern from './templates/TemplateModern';
import TemplateCreative from './templates/TemplateCreative';
import TemplateCorporate from './templates/TemplateCorporate';
import TemplateTech from './templates/TemplateTech';

const ResumeBuilder = () => {
  const { profile } = useSelector((state) => state.profile);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  if (!profile) return <div className="p-8 text-center text-on-surface-variant font-body-lg min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface-container-lowest">No profile data found. Please complete your profile first.</div>;

  const handlePrint = () => {
    window.print();
  };

  const templates = [
    { id: 'classic', name: 'Classic', desc: 'Traditional serif design.' },
    { id: 'modern', name: 'Modern', desc: 'Clean, sans-serif.' },
    { id: 'creative', name: 'Creative', desc: '2-column with accent.' },
    { id: 'corporate', name: 'Corporate', desc: 'Strict, structured.' },
    { id: 'tech', name: 'Tech', desc: 'Monospace, sleek.' },
  ];

  const renderSelectedTemplate = () => {
    switch (selectedTemplate) {
      case 'modern': return <TemplateModern profile={profile} />;
      case 'creative': return <TemplateCreative profile={profile} />;
      case 'corporate': return <TemplateCorporate profile={profile} />;
      case 'tech': return <TemplateTech profile={profile} />;
      case 'classic':
      default:
        return <TemplateClassic profile={profile} />;
    }
  };

  return (
    <div className="bg-surface-container-lowest min-h-[calc(100vh-80px)] py-8 print:bg-white print:py-0 print:min-h-0 relative overflow-hidden">
      {/* Ambient Background Elements (Hidden in print) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden print:hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      {/* Controls & Template Selector (Hidden during print) */}
      <div className="max-w-5xl mx-auto mb-8 print:hidden px-margin-mobile md:px-margin-desktop relative z-10">
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Link to="/dashboard" className="group text-on-surface-variant hover:text-primary transition-colors flex items-center px-4 py-2 rounded-xl bg-surface-container-high border border-white/5 shadow-sm hover:shadow-md">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> <span className="font-label-sm text-label-sm uppercase tracking-wider">Back to Dashboard</span>
          </Link>
          <button onClick={handlePrint} className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-xl font-label-sm text-label-sm uppercase tracking-wider flex items-center hover:shadow-[0_0_20px_rgba(77,142,255,0.4)] transition-all shadow-sm transform hover:-translate-y-0.5 border border-primary-fixed/20">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </button>
        </div>

        {/* Template Selector */}
        <div className="bg-surface-container p-6 rounded-2xl shadow-xl mb-6 border border-white/5 backdrop-blur-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-white/5">
              <LayoutTemplate className="w-5 h-5 text-primary" />
            </div>
            Choose a Template
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                  selectedTemplate === tpl.id 
                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(77,142,255,0.15)] transform scale-[1.02]' 
                    : 'border-white/10 bg-surface-container-high hover:border-primary/50 hover:bg-surface-container-highest'
                }`}
              >
                <div className={`font-label-sm text-label-sm tracking-wider uppercase mb-2 ${selectedTemplate === tpl.id ? 'text-primary' : 'text-on-surface'}`}>
                  {tpl.name}
                </div>
                <div className="text-[11px] text-on-surface-variant leading-relaxed">{tpl.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resume Document */}
      <div className="w-full flex justify-center print:block print:w-auto">
         {renderSelectedTemplate()}
      </div>
      
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; background: white; }
          @page { margin: 0; size: A4; }
          html, body {
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;

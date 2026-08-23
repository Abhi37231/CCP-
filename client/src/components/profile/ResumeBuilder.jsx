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

  if (!profile) return <div className="p-8 text-center text-gray-600">No profile data found. Please complete your profile first.</div>;

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
    <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:py-0 print:min-h-0">
      
      {/* Controls & Template Selector (Hidden during print) */}
      <div className="max-w-5xl mx-auto mb-8 print:hidden px-4">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/dashboard" className="text-gray-600 hover:text-primary flex items-center bg-white px-4 py-2 rounded-md shadow-sm">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
          </Link>
          <button onClick={handlePrint} className="bg-primary text-white px-6 py-2 rounded-md font-medium flex items-center hover:bg-blue-700 transition shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </button>
        </div>

        {/* Template Selector */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <LayoutTemplate className="w-5 h-5 mr-2 text-primary" /> Choose a Template
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-4 rounded-lg border-2 text-left transition ${
                  selectedTemplate === tpl.id 
                    ? 'border-primary bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className={`font-bold ${selectedTemplate === tpl.id ? 'text-primary' : 'text-gray-800'}`}>
                  {tpl.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{tpl.desc}</div>
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

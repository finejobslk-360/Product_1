'use client';

import { useState } from 'react';
import { CVData, CVTemplate } from '@/types/cv';
import TemplateSelector from './TemplateSelector';
import PersonalDetailsForm from './forms/PersonalDetailsForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import CVPreview from './CVPreview';
import { Button } from '@/components/ui/button';

const initialData: CVData = {
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
};

// Define steps for easier mapping in the progress bar
const STEPS = [
  { id: 1, label: 'Template' },
  { id: 2, label: 'Personal' },
  { id: 3, label: 'Experience' },
  { id: 4, label: 'Education' },
  { id: 5, label: 'Skills' },
  { id: 6, label: 'Preview' },
];

export default function CVBuilder() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<CVTemplate>('modern');
  const [data, setData] = useState<CVData>(initialData);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const updateData = <K extends keyof CVData>(section: K, value: CVData[K]) => {
    setData((prev) => ({ ...prev, [section]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <TemplateSelector selected={template} onSelect={setTemplate} />;
      case 2:
        return (
          <PersonalDetailsForm
            data={data.personalDetails}
            onChange={(val) => updateData('personalDetails', val)}
          />
        );
      case 3:
        return (
          <ExperienceForm
            data={data.experience}
            onChange={(val) => updateData('experience', val)}
          />
        );
      case 4:
        return (
          <EducationForm data={data.education} onChange={(val) => updateData('education', val)} />
        );
      case 5:
        return (
          <SkillsForm skills={data.skills} onSkillsChange={(val) => updateData('skills', val)} />
        );
      case 6:
        return <CVPreview data={data} template={template} />;
      default:
        return null;
    }
  };

  return (
    // Added w-full to ensure full width on mobile
    <div className="w-full max-w-6xl mx-auto bg-white min-h-screen flex flex-col">
      {/* Header: Adjusted layout for mobile */}
      <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-20 shadow-sm">
        <div></div>
        {/* shrink-0 prevents buttons from squishing on small screens */}
        <div className="flex gap-2 shrink-0">
          {step > 1 && (
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm" // Smaller buttons on mobile if needed, or handle via className
              className="px-3"
            >
              Back
            </Button>
          )}
          {step < 6 && (
            <Button onClick={handleNext} size="sm" className="px-4">
              Next
            </Button>
          )}
        </div>
      </div>

      {/* Main Content: Responsive padding (p-4 on mobile, p-6 on desktop) */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="mb-6 md:mb-8">
          {/* MOBILE Progress Bar Labels (Hidden on Desktop) */}
          <div className="flex md:hidden justify-between items-end mb-2">
            <span className="text-sm font-semibold text-gray-900">{STEPS[step - 1].label}</span>
            <span className="text-xs text-gray-500">Step {step} of 6</span>
          </div>

          {/* DESKTOP Progress Bar Labels (Hidden on Mobile) */}
          <div className="hidden md:flex justify-between mb-2 text-sm text-gray-500">
            {STEPS.map((s) => (
              <span key={s.id} className={`${step >= s.id ? 'text-blue-600 font-medium' : ''}`}>
                {s.label}
              </span>
            ))}
          </div>

          {/* Progress Bar Line */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Render Step Wrapper */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

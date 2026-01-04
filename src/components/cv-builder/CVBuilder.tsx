'use client';

import { useState } from 'react';
import { CVData, CVTemplate } from '@/types/cv';
import TemplateSelector from './TemplateSelector';
import PersonalDetailsForm from './forms/PersonalDetailsForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import ReferencesForm from './forms/ReferencesForm';
import AdditionalInfoForm from './forms/AdditionalInfoForm';
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
  references: [],
  achievements: [],
  languages: [],
  awards: [],
  softSkills: [],
};

export default function CVBuilder() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<CVTemplate>('modern');
  const [data, setData] = useState<CVData>(initialData);

  // Dynamic steps based on template
  const getSteps = () => {
    const baseSteps = [
      { id: 1, label: 'Template', component: 'Template' },
      { id: 2, label: 'Personal', component: 'Personal' },
      { id: 3, label: 'Experience', component: 'Experience' },
      { id: 4, label: 'Education', component: 'Education' },
      { id: 5, label: 'Skills', component: 'Skills' },
    ];

    if (template === 'creative') {
      baseSteps.push({ id: 6, label: 'References', component: 'References' });
    } else if (template !== 'minimalist') {
      baseSteps.push({ id: 6, label: 'Additional', component: 'Additional' });
    }

    baseSteps.push({ id: baseSteps.length + 1, label: 'Preview', component: 'Preview' });
    
    // Re-index IDs to be sequential
    return baseSteps.map((s, i) => ({ ...s, id: i + 1 }));
  };

  const currentSteps = getSteps();
  const totalSteps = currentSteps.length;

  // Ensure step doesn't exceed totalSteps if template changes
  if (step > totalSteps) setStep(totalSteps);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateData = <K extends keyof CVData>(section: K, value: CVData[K]) => {
    setData((prev) => ({ ...prev, [section]: value }));
  };

  const renderStep = () => {
    const currentStepLabel = currentSteps[step - 1]?.component;
    
    switch (currentStepLabel) {
      case 'Template':
        return <TemplateSelector selected={template} onSelect={setTemplate} />;
      case 'Personal':
        return (
          <PersonalDetailsForm
            data={data.personalDetails}
            onChange={(val) => updateData('personalDetails', val)}
          />
        );
      case 'Experience':
        return (
          <ExperienceForm
            data={data.experience}
            onChange={(val) => updateData('experience', val)}
          />
        );
      case 'Education':
        return (
          <EducationForm data={data.education} onChange={(val) => updateData('education', val)} />
        );
      case 'Skills':
        return (
          <SkillsForm skills={data.skills} onSkillsChange={(val) => updateData('skills', val)} />
        );
      case 'References':
        return (
          <ReferencesForm
            data={data.references || []}
            onChange={(val) => updateData('references', val)}
          />
        );
      case 'Additional':
        return (
          <AdditionalInfoForm
            data={{
              achievements: data.achievements,
              languages: data.languages,
              awards: data.awards,
              softSkills: data.softSkills,
            }}
            onChange={(field, val) => updateData(field as keyof CVData, val)}
          />
        );
      case 'Preview':
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
          {step < totalSteps && (
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
            <span className="text-sm font-semibold text-gray-900">{currentSteps[step - 1]?.label}</span>
            <span className="text-xs text-gray-500">Step {step} of {totalSteps}</span>
          </div>

          {/* DESKTOP Progress Bar Labels (Hidden on Mobile) */}
          <div className="hidden md:flex justify-between mb-2 text-sm text-gray-500">
            {currentSteps.map((s) => (
              <span key={s.id} className={`${step >= s.id ? 'text-blue-600 font-medium' : ''}`}>
                {s.label}
              </span>
            ))}
          </div>

          {/* Progress Bar Line */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
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

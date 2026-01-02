'use client';
/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Code,
  TrendingUp,
  Megaphone,
  Building,
  Clock,
  X,
  Wrench,
  BriefcaseBusiness,
  HeartPulse,
  UtensilsCrossed,
  DollarSign,
  MoreHorizontal,
  CheckCircle2,
} from 'lucide-react';

type WorkPreference = 'fulltime' | 'parttime';
type ExperienceLevel = 'entry' | 'mid' | 'senior' | '';
type LocationPreference = 'onsite' | 'hybrid' | 'remote' | '';

type OnboardingPayload = {
  jobCategory: string | null;
  workPreference: WorkPreference | null;
  experienceLevel?: ExperienceLevel;
  locationPreference?: LocationPreference;
  skills?: string;
  goal?: string;
  skipped?: boolean;
};

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingPayload) => void;
}

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPreference, setSelectedPreference] = useState<WorkPreference>('fulltime');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('');
  const [locationPreference, setLocationPreference] = useState<LocationPreference>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const jobCategories = [
    {
      id: 'it',
      icon: Code,
      title: 'IT & Technology',
      subtitle: 'Software, Data, DevOps',
    },
    {
      id: 'marketing',
      icon: Megaphone,
      title: 'Marketing',
      subtitle: 'Digital, Content, Brand',
    },
    {
      id: 'sales',
      icon: TrendingUp,
      title: 'Sales',
      subtitle: 'B2B, Retail, Account Mgmt',
    },
    {
      id: 'engineering',
      icon: Wrench,
      title: 'Engineering',
      subtitle: 'Mechanical, Civil, Electrical',
    },
    {
      id: 'business',
      icon: BriefcaseBusiness,
      title: 'Business Administration',
      subtitle: 'Management, Operations, Strategy',
    },
    {
      id: 'biomedical',
      icon: HeartPulse,
      title: 'Biomedical',
      subtitle: 'Healthcare, Medical, Research',
    },
    {
      id: 'hospitality',
      icon: UtensilsCrossed,
      title: 'Hospitality',
      subtitle: 'Hotel, Restaurant, Tourism',
    },
    {
      id: 'finance',
      icon: DollarSign,
      title: 'Finance',
      subtitle: 'Accounting, Banking, Investment',
    },
    {
      id: 'others',
      icon: MoreHorizontal,
      title: 'Others',
      subtitle: 'Other fields and industries',
    },
  ];

  // Skills mapping for each job category
  const categorySkills: Record<string, string[]> = {
    it: [
      'JavaScript',
      'Python',
      'Java',
      'React',
      'Node.js',
      'TypeScript',
      'SQL',
      'MongoDB',
      'AWS',
      'Docker',
      'Git',
      'Agile',
      'DevOps',
      'Machine Learning',
      'Data Analysis',
      'Cloud Computing',
    ],
    marketing: [
      'SEO',
      'SEM',
      'Social Media Marketing',
      'Content Writing',
      'Email Marketing',
      'Google Analytics',
      'Facebook Ads',
      'Brand Management',
      'Market Research',
      'Copywriting',
      'Influencer Marketing',
      'PPC',
      'Marketing Strategy',
      'Content Strategy',
      'Digital Marketing',
      'Analytics',
    ],
    sales: [
      'CRM',
      'Salesforce',
      'Lead Generation',
      'Negotiation',
      'Client Relations',
      'B2B Sales',
      'Account Management',
      'Cold Calling',
      'Sales Strategy',
      'Customer Service',
      'Presentation Skills',
      'Closing Deals',
      'Relationship Building',
      'Product Knowledge',
      'Territory Management',
      'Sales Forecasting',
    ],
    engineering: [
      'AutoCAD',
      'SolidWorks',
      'MATLAB',
      'Project Management',
      'CAD',
      'Mechanical Design',
      'Electrical Systems',
      'Civil Engineering',
      'Structural Analysis',
      'Quality Control',
      'Manufacturing',
      'Prototyping',
      'Technical Drawing',
      'Engineering Design',
      'Systems Engineering',
    ],
    business: [
      'Project Management',
      'Strategic Planning',
      'Business Analysis',
      'Operations Management',
      'Financial Analysis',
      'Leadership',
      'Process Improvement',
      'Budget Management',
      'Stakeholder Management',
      'Risk Management',
      'Change Management',
      'Data Analysis',
      'Excel',
      'PowerPoint',
      'Business Strategy',
      'Team Management',
    ],
    biomedical: [
      'Medical Research',
      'Clinical Trials',
      'Biostatistics',
      'Laboratory Skills',
      'Data Analysis',
      'Research Methodology',
      'Medical Writing',
      'Regulatory Affairs',
      'Biomedical Engineering',
      'Patient Care',
      'Medical Devices',
      'Healthcare Systems',
      'Quality Assurance',
      'Documentation',
      'Compliance',
    ],
    hospitality: [
      'Customer Service',
      'Hotel Management',
      'Event Planning',
      'Food & Beverage',
      'Front Desk Operations',
      'Reservation Systems',
      'Guest Relations',
      'Restaurant Management',
      'Tourism',
      'Hospitality Management',
      'Concierge Services',
      'Housekeeping',
      'Banquet Management',
      'Revenue Management',
      'Hospitality Software',
      'Multilingual',
    ],
    finance: [
      'Accounting',
      'Financial Analysis',
      'Excel',
      'QuickBooks',
      'SAP',
      'Financial Modeling',
      'Tax Preparation',
      'Auditing',
      'Bookkeeping',
      'Investment Analysis',
      'Risk Management',
      'Budgeting',
      'Forecasting',
      'Financial Reporting',
      'Banking',
      'CFA',
      'CPA',
    ],
    others: [
      'Communication',
      'Problem Solving',
      'Teamwork',
      'Leadership',
      'Time Management',
      'Organization',
      'Adaptability',
      'Creativity',
      'Critical Thinking',
      'Microsoft Office',
      'Project Management',
      'Customer Service',
      'Data Entry',
      'Administrative Skills',
    ],
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleNext = () => {
    // Simple per-step validation
    if (currentStep === 1 && !selectedCategory) return;
    if (currentStep === 2 && !experienceLevel) return;
    if (currentStep === 3 && !locationPreference) return;

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Show success message on final step
    if (currentStep === 5) {
      setShowSuccessMessage(true);
    }
  };

  // Handle fade out and complete onboarding
  useEffect(() => {
    if (showSuccessMessage) {
      // Start fade out after 2 seconds
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2000);

      // Complete onboarding after fade out animation (2.5 seconds total)
      const completeTimer = setTimeout(() => {
        setShowSuccessMessage(false);
        setFadeOut(false);
        onComplete({
          jobCategory: selectedCategory,
          workPreference: selectedPreference,
          experienceLevel,
          locationPreference,
          skills: selectedSkills.join(', '),
          goal,
        });
      }, 2500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [
    showSuccessMessage,
    selectedCategory,
    selectedPreference,
    experienceLevel,
    locationPreference,
    selectedSkills,
    goal,
    onComplete,
  ]);

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete({
      jobCategory: null,
      workPreference: null,
      skipped: true,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Success Message Popup */}
      {showSuccessMessage && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        >
          <div
            className={`bg-white rounded-2xl p-8 md:p-10 max-w-md w-full shadow-2xl text-center transition-all duration-500 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-slideUp'}`}
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">360 Technologies</h2>
            <p className="text-lg text-gray-700 mb-2">Always with you to boost your career!</p>
            <p className="text-sm text-gray-500">Your profile is ready. Let&apos;s get started.</p>
          </div>
        </div>
      )}

      {/* Main Onboarding Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-opacity duration-500 ${showSuccessMessage ? 'opacity-0' : 'opacity-100 animate-fadeIn'}`}
      >
        <div className="bg-white rounded-xl p-4 md:p-5 w-full max-w-lg shadow-2xl relative animate-slideUp my-4 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              Welcome to 360 Technologies
            </h2>
            <p className="text-xs text-gray-600">
              Let's personalize your experience in just a few steps.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center items-center gap-1.5 mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step === currentStep
                      ? 'bg-blue-600 text-white scale-110'
                      : step < currentStep
                        ? 'bg-blue-400 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`h-1 w-8 md:w-10 transition-all duration-300 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1 Content - Job Category + Work Preference */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  What type of work interests you?
                </h3>
                <p className="text-sm text-gray-600">
                  Select your primary field and work preference
                </p>
              </div>

              {/* Job Category Section */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Job Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {jobCategories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 mb-1.5 ${
                            isSelected ? 'text-blue-600' : 'text-gray-400'
                          }`}
                        />
                        <h4
                          className={`font-semibold text-sm mb-0.5 ${
                            isSelected ? 'text-blue-600' : 'text-gray-900'
                          }`}
                        >
                          {category.title}
                        </h4>
                        <p className="text-xs text-gray-500">{category.subtitle}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Work Preference Section */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Work Preference
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setSelectedPreference('fulltime')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2.5 ${
                      selectedPreference === 'fulltime'
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-900'
                    }`}
                  >
                    <Building
                      className={`w-5 h-5 ${
                        selectedPreference === 'fulltime' ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                    <span className="font-semibold text-sm">Full-time Job</span>
                  </button>
                  <button
                    onClick={() => setSelectedPreference('parttime')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2.5 ${
                      selectedPreference === 'parttime'
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-900'
                    }`}
                  >
                    <Clock
                      className={`w-5 h-5 ${
                        selectedPreference === 'parttime' ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                    <span className="font-semibold text-sm">Part time</span>
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-end items-center gap-3 mt-6">
                <button
                  onClick={handleSkip}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip this step
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedCategory}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 - Experience Level */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  What is your experience level?
                </h3>
                <p className="text-sm text-gray-600">
                  This helps us match you with the right opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
                {[
                  { id: 'entry', label: 'Entry Level', desc: '0-2 years' },
                  { id: 'mid', label: 'Mid Level', desc: '2-5 years' },
                  { id: 'senior', label: 'Senior', desc: '5+ years' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setExperienceLevel(item.id as 'entry' | 'mid' | 'senior')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                      experienceLevel === item.id
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <h4
                      className={`font-semibold text-sm mb-1 ${
                        experienceLevel === item.id ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {item.label}
                    </h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center gap-3 mt-6">
                <button
                  onClick={handlePrevious}
                  className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={!experienceLevel}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - Location Preference */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  Where do you prefer to work from?
                </h3>
                <p className="text-sm text-gray-600">Choose your preferred work style.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
                {[
                  { id: 'onsite', label: 'On-site', desc: 'Work from office' },
                  { id: 'hybrid', label: 'Hybrid', desc: 'Mix of office & remote' },
                  { id: 'remote', label: 'Remote', desc: 'Work from anywhere' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLocationPreference(item.id as 'onsite' | 'hybrid' | 'remote')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                      locationPreference === item.id
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <h4
                      className={`font-semibold text-sm mb-1 ${
                        locationPreference === item.id ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {item.label}
                    </h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center gap-3 mt-6">
                <button
                  onClick={handlePrevious}
                  className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={!locationPreference}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 4 - Skills */}
          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  What are your key skills?
                </h3>
                <p className="text-sm text-gray-600">
                  Select skills related to{' '}
                  {jobCategories.find((c) => c.id === selectedCategory)?.title || 'your field'} or
                  add your own.
                </p>
              </div>

              {/* Predefined Skills */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Select Skills
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {(categorySkills[selectedCategory] || categorySkills.others).map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-2 border-blue-600'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Skills Display */}
              {selectedSkills.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Selected Skills ({selectedSkills.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <div
                        key={skill}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1.5 border border-blue-200"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Skill Input */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Add Custom Skill
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handleAddCustomSkill}
                    disabled={!customSkill.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center gap-3 mt-6">
                <button
                  onClick={handlePrevious}
                  className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 5 - Career Goal / Summary */}
          {currentStep === 5 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  Finally, what&apos;s your main goal?
                </h3>
                <p className="text-sm text-gray-600">
                  Tell us what you are mainly looking for right now.
                </p>
              </div>

              <div className="mb-4 max-w-xl mx-auto">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Your goal (optional)
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={3}
                  placeholder="e.g. I want to move into a mid-level frontend developer role with a focus on React and modern UI."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="flex justify-between items-center gap-3 mt-6">
                <button
                  onClick={handlePrevious}
                  className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  Complete →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import React from 'react';
import { CVTemplate } from '@/types/cv';
import Image from 'next/image';

interface TemplateSelectorProps {
  selected: CVTemplate;
  onSelect: (template: CVTemplate) => void;
}

// Define the template structure explicitly
interface TemplateOption {
  id: CVTemplate;
  name: string;
  image: string;
  description: string;
}

const templates: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern Template',
    image: '/templates/modern.png', 
    description: 'ATS Friendly, clean and modern design.',
  },
  {
    id: 'classic',
    name: 'Classic Template',
    image: '/templates/classic.png', 
    description: 'Traditional layout, perfect for corporate jobs.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist Template',
    image: '/templates/minimalist.png', 
    description: 'Simple and effective.',
  },
  {
    id: 'professional',
    name: 'Professional Template',
    image: '/templates/professional.png', 
    description: 'Professional design for experienced candidates.',
  },
  {
    id: 'executive',
    name: 'Executive Template',
    image: '/templates/executive.png',
    description: 'Sophisticated layout for high-level professionals.',
  },
  {
    id: 'creative',
    name: 'Creative Template',
    image: '/templates/creative.png',
    description: 'Bold and unique design for creative roles.',
  },
];

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
      <p className="text-gray-600 mb-6">
        Select a template that best represents your professional experience and career goals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            type="button"
            className={`
              group relative flex flex-col items-start text-left
              border-2 rounded-xl p-4 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                selected === template.id
                  ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md bg-white'
              }
            `}
          >
            {/* Template Preview Image Area */}
            <div className="w-full aspect-[210/297] bg-gray-100 mb-4 rounded-lg overflow-hidden relative border border-gray-100">
              <Image 
                src={template.image} 
                alt={template.name} 
                fill 
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Fallback overlay if image is missing or loading */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {template.name}
              </div>
            </div>

            {/* Text Content */}
            <h3 className={`font-semibold text-lg ${selected === template.id ? 'text-blue-900' : 'text-gray-900'}`}>
              {template.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {template.description}
            </p>

            {/* Checkmark Indicator for Selected State */}
            {selected === template.id && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
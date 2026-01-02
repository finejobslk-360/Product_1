import { CVTemplate } from '@/types/cv';

interface TemplateSelectorProps {
  selected: CVTemplate;
  onSelect: (template: CVTemplate) => void;
}

const templates: { id: CVTemplate; name: string; image: string; description: string }[] = [
  {
    id: 'modern',
    name: 'Modern Template',
    image: '/templates/modern.png', // Placeholder
    description: 'ATS Friendly, clean and modern design.',
  },
  {
    id: 'classic',
    name: 'Classic Template',
    image: '/templates/classic.png', // Placeholder
    description: 'Traditional layout, perfect for corporate jobs.',
  },
  {
    id: 'creative',
    name: 'Creative Template',
    image: '/templates/creative.png', // Placeholder
    description: 'Stand out with a unique design.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist Template',
    image: '/templates/minimalist.png', // Placeholder
    description: 'Simple and effective.',
  },
  {
    id: 'professional',
    name: 'Professional Template',
    image: '/templates/professional.png', // Placeholder
    description: 'Professional design for experienced candidates.',
  },
];

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
      <p className="text-gray-600 mb-6">
        Select a template that best represents your professional experience and career goals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all hover:shadow-lg ${
              selected === template.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="aspect-[210/297] bg-gray-100 mb-4 rounded overflow-hidden relative">
              {/* Placeholder for template preview */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                {template.name} Preview
              </div>
            </div>
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

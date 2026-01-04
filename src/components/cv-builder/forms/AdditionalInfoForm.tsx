import { CVData } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface AdditionalInfoFormProps {
  data: {
    achievements?: string[];
    languages?: string[];
    awards?: string[];
    softSkills?: string[];
  };
  onChange: (field: string, value: string[]) => void;
}

export default function AdditionalInfoForm({ data, onChange }: AdditionalInfoFormProps) {
  const handleAddItem = (field: keyof typeof data) => {
    const currentItems = data[field] || [];
    onChange(field, [...currentItems, '']);
  };

  const handleRemoveItem = (field: keyof typeof data, index: number) => {
    const currentItems = data[field] || [];
    onChange(field, currentItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (field: keyof typeof data, index: number, value: string) => {
    const currentItems = data[field] || [];
    const newItems = [...currentItems];
    newItems[index] = value;
    onChange(field, newItems);
  };

  const sections = [
    { key: 'languages', label: 'Languages', placeholder: 'e.g. English (Fluent)' },
    { key: 'achievements', label: 'Achievements', placeholder: 'e.g. Reduced production cost by 20%' },
    { key: 'awards', label: 'Awards & Activities', placeholder: 'e.g. Top Sales Agent Award 2016' },
    { key: 'softSkills', label: 'Soft Skills', placeholder: 'e.g. Communication, Leadership' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-6">Additional Information</h2>

      {sections.map((section) => (
        <div key={section.key} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">{section.label}</h3>
            <Button
              onClick={() => handleAddItem(section.key as keyof typeof data)}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>

          <div className="space-y-2">
            {(data[section.key as keyof typeof data] || []).map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(section.key as keyof typeof data, index, e.target.value)}
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={section.placeholder}
                />
                <button
                  onClick={() => handleRemoveItem(section.key as keyof typeof data, index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {(data[section.key as keyof typeof data] || []).length === 0 && (
              <p className="text-sm text-gray-400 italic">No items added yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

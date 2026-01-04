import { CVData, Reference } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ReferencesFormProps {
  data: Reference[];
  onChange: (data: Reference[]) => void;
}

export default function ReferencesForm({ data, onChange }: ReferencesFormProps) {
  const addReference = () => {
    onChange([
      ...data,
      {
        id: uuidv4(),
        name: '',
        position: '',
        company: '',
        phone: '',
        email: '',
      },
    ]);
  };

  const removeReference = (id: string) => {
    onChange(data.filter((ref) => ref.id !== id));
  };

  const handleChange = (id: string, field: keyof Reference, value: string) => {
    onChange(data.map((ref) => (ref.id === id ? { ...ref, [field]: value } : ref)));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">References</h2>
      
      <div className="space-y-6">
        {data.map((ref, index) => (
          <div key={ref.id} className="p-4 border rounded-lg relative bg-gray-50">
            <button
              onClick={() => removeReference(ref.id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
            
            <h3 className="font-semibold mb-4">Reference #{index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => handleChange(ref.id, 'name', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Juliana Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={ref.position}
                  onChange={(e) => handleChange(ref.id, 'position', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. CEO"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={ref.company}
                  onChange={(e) => handleChange(ref.id, 'company', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Wardiere Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={ref.phone}
                  onChange={(e) => handleChange(ref.id, 'phone', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 123-456-7890"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={ref.email}
                  onChange={(e) => handleChange(ref.id, 'email', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. juliana@example.com"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={addReference}
        variant="outline"
        className="w-full mt-6 border-dashed border-2"
      >
        <Plus size={20} className="mr-2" /> Add Reference
      </Button>
    </div>
  );
}

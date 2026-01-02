import { Education } from '@/types/cv';
import { Button } from '@/components/ui/button';

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
  const addEducation = () => {
    const newEdu: Education = {
      id: Math.random().toString(36).substr(2, 9),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    onChange([...data, newEdu]);
  };

  const updateEducation = <K extends keyof Education>(
    id: string,
    field: K,
    value: Education[K]
  ) => {
    onChange(data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Education</h2>
        <Button onClick={addEducation} size="sm">
          Add New Education
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded border border-dashed">
          <p className="text-gray-500">No education added yet.</p>
          <Button variant="link" onClick={addEducation} className="mt-2">
            Add your education history
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((edu, index) => (
            <div key={edu.id} className="border rounded-lg p-6 bg-white shadow-sm relative">
              <button
                onClick={() => removeEducation(edu.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>

              <h3 className="font-semibold mb-4 text-gray-800">Education #{index + 1}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. University of California, Berkeley"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Aug 2018"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      disabled={edu.current}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                      placeholder={edu.current ? 'Present' : 'e.g. May 2022'}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edu.current}
                      onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">I am currently studying here</span>
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA or Relevant Coursework/Honors (Optional)
                  </label>
                  <textarea
                    value={edu.description || ''}
                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 3.8 GPA, Dean's List..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

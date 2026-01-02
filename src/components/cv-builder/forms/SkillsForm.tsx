import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SkillsFormProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export default function SkillsForm({ skills, onSkillsChange }: SkillsFormProps) {
  const [input, setInput] = useState('');

  const addSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !skills.includes(input.trim())) {
      onSkillsChange([...skills, input.trim()]);
      setInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Skills</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Add Skills</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. JavaScript, Project Management, Public Speaking"
          />
          <Button onClick={addSkill}>Add</Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Press Enter to add a skill</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill}
            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2 border border-blue-100"
          >
            <span>{skill}</span>
            <button onClick={() => removeSkill(skill)} className="hover:text-blue-900 font-bold">
              ×
            </button>
          </div>
        ))}
        {skills.length === 0 && <p className="text-gray-400 italic">No skills added yet.</p>}
      </div>
    </div>
  );
}

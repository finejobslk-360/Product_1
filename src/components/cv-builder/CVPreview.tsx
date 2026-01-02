import { CVData, CVTemplate } from '@/types/cv';
import { useRef, useState } from 'react';
import { saveCV } from '@/app/actions/cv';
import { Button } from '@/components/ui/button';

interface CVPreviewProps {
  data: CVData;
  template: CVTemplate;
}

export default function CVPreview({ data, template }: CVPreviewProps) {
  const cvRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const title = prompt('Enter a name for your CV:', 'My Resume');
      if (!title) {
        setIsSaving(false);
        return;
      }

      const result = await saveCV(data, template, title);
      if (result.success) {
        setSaveMessage('CV saved successfully!');
        // Optional: Redirect or show success UI
      } else {
        setSaveMessage('Failed to save CV: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving CV', error);
      setSaveMessage('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'classic':
        return <ClassicTemplate data={data} />;
      // Add other cases
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="flex-1 bg-gray-100 p-8 overflow-y-auto rounded shadow-inner flex justify-center">
        <div
          id="cv-preview"
          ref={cvRef}
          className="bg-white shadow-lg w-[210mm] min-h-[297mm] p-[20mm] text-sm print:shadow-none print:w-full print:h-full print:p-0"
        >
          {renderTemplate()}
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-4 print:hidden">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-bold text-lg mb-4">Preview & Download</h3>
          <p className="text-gray-600 text-sm mb-6">
            Review your resume and choose your export options.
          </p>

          <div className="space-y-3">
            <Button onClick={handlePrint} className="w-full flex items-center justify-center gap-2">
              <span>Download as PDF</span>
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <span>{isSaving ? 'Saving...' : 'Save to Profile'}</span>
            </Button>
            {saveMessage && (
              <p
                className={`text-sm text-center ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}
              >
                {saveMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cv-preview,
          #cv-preview * {
            visibility: visible;
          }
          #cv-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20mm !important;
            box-shadow: none;
          }
          /* Hide headers, footers, sidebars */
          header,
          footer,
          nav,
          aside {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function ModernTemplate({ data }: { data: CVData }) {
  return (
    <div className="font-sans text-gray-800">
      <header className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
          {data.personalDetails.fullName}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {data.personalDetails.email && <span>{data.personalDetails.email}</span>}
          {data.personalDetails.phone && <span>• {data.personalDetails.phone}</span>}
          {data.personalDetails.address && <span>• {data.personalDetails.address}</span>}
          {data.personalDetails.linkedin && <span>• {data.personalDetails.linkedin}</span>}
        </div>
      </header>

      {data.personalDetails.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.personalDetails.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-gray-700 font-medium mb-1">
                  {exp.company}, {exp.location}
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{edu.school}</h3>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <div className="text-gray-700">
                  {edu.degree} in {edu.fieldOfStudy}
                </div>
                {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section>
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ClassicTemplate({ data }: { data: CVData }) {
  return (
    <div className="font-serif text-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.personalDetails.fullName}</h1>
        <div className="text-sm">
          {data.personalDetails.address} | {data.personalDetails.phone} |{' '}
          {data.personalDetails.email}
        </div>
      </div>

      {data.personalDetails.summary && (
        <div className="mb-6">
          <h2 className="font-bold border-b-2 border-black mb-2">Professional Profile</h2>
          <p>{data.personalDetails.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold border-b-2 border-black mb-2">Work Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between font-bold">
                <span>{exp.company}</span>
                <span>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="italic mb-1">{exp.position}</div>
              <p className="text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold border-b-2 border-black mb-2">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold">{edu.school}</span>
                <span>
                  {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
              <div>
                {edu.degree}, {edu.fieldOfStudy}
              </div>
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold border-b-2 border-black mb-2">Skills</h2>
          <p>{data.skills.join(' • ')}</p>
        </div>
      )}
    </div>
  );
}

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
      case 'minimalist':
        return <MinimalistTemplate data={data} />;
      case 'professional':
        return <ProfessionalTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
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

      <div className="grid grid-cols-2 gap-8">
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

        {data.languages && data.languages.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Languages</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {data.languages.map((lang, i) => (
                <li key={i}>{lang}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {data.awards && data.awards.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Awards & Activities</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {data.awards.map((award, i) => (
              <li key={i}>{award}</li>
            ))}
          </ul>
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
          {data.personalDetails.website && ` | ${data.personalDetails.website}`}
        </div>
      </div>

      {data.personalDetails.summary && (
        <div className="mb-6">
          <h2 className="font-bold border-b-2 border-black mb-2">Professional Profile</h2>
          <p className="text-sm leading-relaxed">{data.personalDetails.summary}</p>
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
              <p className="text-sm whitespace-pre-line">{exp.description}</p>
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
              <div className="text-sm">
                {edu.degree}, {edu.fieldOfStudy}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold border-b-2 border-black mb-2">Skills</h2>
            <p className="text-sm">{data.skills.join(' • ')}</p>
          </div>
        )}

        {data.languages && data.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold border-b-2 border-black mb-2">Languages</h2>
            <p className="text-sm">{data.languages.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalistTemplate({ data }: { data: CVData }) {
  return (
    <div className="font-sans text-gray-900 max-w-[800px] mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tighter mb-4 uppercase">
          {data.personalDetails.fullName}
        </h1>
        <p className="text-xl font-medium text-gray-600 mb-4">
          {data.experience[0]?.position || 'Professional'}
        </p>
        <div className="text-sm text-gray-500 flex justify-center gap-4">
          <span>{data.personalDetails.phone}</span>
          <span>|</span>
          <span>{data.personalDetails.email}</span>
          {data.personalDetails.website && (
            <>
              <span>|</span>
              <span>{data.personalDetails.website}</span>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8 mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Profile</h2>
        <p className="text-gray-700 leading-relaxed">{data.personalDetails.summary}</p>
      </div>

      <div className="border-t border-gray-200 pt-8 mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Work Experience</h2>
        <div className="space-y-8">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-gray-600 font-medium">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-400 italic">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                {exp.description.split('\n').map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 border-t border-gray-200 pt-8">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <h3 className="font-bold">{edu.school}</h3>
              <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
              <p className="text-sm text-gray-700">{edu.degree}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Skills</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {data.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ProfessionalTemplate({ data }: { data: CVData }) {
  return (
    <div className="font-sans text-gray-800">
      <div className="flex gap-8 mb-8">
        <div className="w-32 h-32 bg-gray-200 rounded overflow-hidden flex-shrink-0">
          {/* Placeholder for photo if available */}
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Photo
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">{data.personalDetails.fullName}</h1>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
            <div className="flex gap-2">
              <span className="font-bold w-16">Address:</span>
              <span>{data.personalDetails.address}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-16">Phone:</span>
              <span>{data.personalDetails.phone}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-16">Email:</span>
              <span>{data.personalDetails.email}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-16">Website:</span>
              <span>{data.personalDetails.website || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-blue-900 border-b-2 border-blue-900 mb-3 uppercase">Summary</h2>
        <p className="text-sm leading-relaxed">{data.personalDetails.summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-blue-900 border-b-2 border-blue-900 mb-3 uppercase">Work Experience</h2>
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between font-bold mb-1">
                <span>{exp.position}, {exp.company}</span>
                <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1">
                {exp.description.split('\n').map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-blue-900 border-b-2 border-blue-900 mb-3 uppercase">Education</h2>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between font-bold mb-1">
                <span>{edu.degree} in {edu.fieldOfStudy}</span>
                <span>{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-sm">{edu.school}</p>
              {edu.description && <p className="text-xs text-gray-600 mt-1 italic">{edu.description}</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-blue-900 border-b-2 border-blue-900 mb-3 uppercase">Additional Information</h2>
        <div className="space-y-2 text-sm">
          {data.skills.length > 0 && (
            <p><span className="font-bold">Technical Skills:</span> {data.skills.join(', ')}</p>
          )}
          {data.languages && data.languages.length > 0 && (
            <p><span className="font-bold">Languages:</span> {data.languages.join(', ')}</p>
          )}
          {data.certifications.length > 0 && (
            <p><span className="font-bold">Certifications:</span> {data.certifications.map(c => c.name).join(', ')}</p>
          )}
          {data.awards && data.awards.length > 0 && (
            <p><span className="font-bold">Awards/Activities:</span> {data.awards.join(', ')}</p>
          )}
        </div>
      </section>
    </div>
  );
}

function ExecutiveTemplate({ data }: { data: CVData }) {
  const nameParts = data.personalDetails.fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ');

  return (
    <div className="font-sans text-gray-800 flex gap-8">
      <div className="w-1/3 bg-slate-50 p-6 -m-[20mm] mr-0 min-h-[297mm]">
        <div className="w-full aspect-square bg-gray-200 rounded-lg mb-8 overflow-hidden">
          {/* Photo placeholder */}
        </div>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 mb-4">My Contact</h2>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">📧 {data.personalDetails.email}</p>
              <p className="flex items-center gap-2">📞 {data.personalDetails.phone}</p>
              <p className="flex items-center gap-2">📍 {data.personalDetails.address}</p>
              {data.personalDetails.website && <p className="flex items-center gap-2">🌐 {data.personalDetails.website}</p>}
            </div>
          </section>

          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 mb-4">Hard Skill</h2>
              <ul className="space-y-2 text-sm">
                {data.skills.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2">• {skill}</li>
                ))}
              </ul>
            </section>
          )}

          {data.softSkills && data.softSkills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 mb-4">Soft Skill</h2>
              <ul className="space-y-2 text-sm">
                {data.softSkills.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2">• {skill}</li>
                ))}
              </ul>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 mb-4">Education Background</h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="text-sm">
                    <p className="font-bold">• {edu.school}</p>
                    <p className="italic">{edu.degree}</p>
                    <p className="text-gray-500">Completed in {edu.endDate.split('-')[0] || edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="w-2/3 py-4">
        <header className="mb-12">
          <h1 className="text-6xl font-bold text-orange-700 mb-2">
            {firstName} <span className="text-slate-800">{lastName}</span>
          </h1>
          <p className="text-3xl font-bold text-slate-600 tracking-widest uppercase">{data.experience[0]?.position || 'Professional'}</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">About Me</h2>
          <p className="text-sm leading-relaxed text-gray-700 border-2 border-purple-500 p-4 rounded">
            {data.personalDetails.summary}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-2">Professional Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-slate-800">{exp.company} | {exp.position}</h3>
                </div>
                <p className="text-sm italic text-slate-500 mb-3">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {exp.description.split('\n').map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {data.achievements && data.achievements.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-2">Achievements</h2>
            <div className="space-y-4">
              {data.achievements.map((ach, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <p className="text-gray-700">{ach}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function CreativeTemplate({ data }: { data: CVData }) {
  const nameParts = data.personalDetails.fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ');

  return (
    <div className="font-sans text-white flex min-h-[297mm] -m-[20mm]">
      <div className="w-[35%] bg-slate-800 p-8 pt-12">
        <div className="w-48 h-48 mx-auto rounded-full border-8 border-slate-700 overflow-hidden mb-12 bg-gray-300">
          {/* Photo placeholder */}
        </div>

        <div className="space-y-12">
          {data.references && data.references.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold border-l-4 border-cyan-400 pl-4 mb-6 uppercase tracking-widest">Reference</h2>
              <div className="space-y-6">
                {data.references.map((ref) => (
                  <div key={ref.id} className="text-sm">
                    <p className="font-bold text-lg">{ref.name}</p>
                    <p className="text-gray-300">{ref.company} / {ref.position}</p>
                    <p className="text-gray-300">{ref.phone}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold border-l-4 border-cyan-400 pl-4 mb-6 uppercase tracking-widest">My Skills</h2>
              <div className="space-y-4">
                {data.skills.map((skill, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm">{skill}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className={`w-2 h-2 rounded-full ${star <= 4 ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="w-[65%] bg-white text-slate-800">
        <div className="bg-cyan-600 p-12 pt-16 rounded-bl-[100px]">
          <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">{firstName}</h1>
          <h1 className="text-6xl font-light text-white mb-6 tracking-tight">{lastName}</h1>
          <p className="text-2xl font-bold text-white tracking-[0.2em] uppercase">{data.experience[0]?.position || 'Graphic Designer'}</p>
        </div>

        <div className="p-12 space-y-12">
          <section>
            <h2 className="text-3xl font-bold border-l-4 border-cyan-600 pl-4 mb-6 text-slate-800">About Me</h2>
            <p className="text-gray-600 leading-relaxed">
              {data.personalDetails.summary}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold border-l-4 border-cyan-600 pl-4 mb-8 text-slate-800">Work Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id} className="flex gap-8">
                  <div className="w-24 flex-shrink-0">
                    <p className="font-bold text-sm">{exp.company}</p>
                    <p className="text-xs text-gray-500">{exp.location}</p>
                    <p className="font-bold text-xs mt-1">{exp.startDate.split('-')[0]} - {exp.current ? 'Present' : exp.endDate.split('-')[0]}</p>
                  </div>
                  <div className="border-l-2 border-cyan-600 pl-6">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold border-l-4 border-cyan-600 pl-4 mb-8 text-slate-800">Education</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-2 border-cyan-100 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-500">{edu.startDate.split('-')[0]} - {edu.endDate.split('-')[0]}</p>
                  <p className="font-bold text-slate-800">{edu.school}</p>
                  <p className="text-sm text-gray-600">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

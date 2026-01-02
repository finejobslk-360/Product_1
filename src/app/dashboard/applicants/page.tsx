'use client';

export default function ApplicantsPage() {
  const stages: { label: string; count?: number; description?: string }[] = [];

  return (
    <div className="space-y-6">
      {stages.length === 0 ? (
        <section className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Applicant Pipeline</h2>
          <p className="text-xs text-gray-500 mb-4">
            Applicant counts will show here once your jobs or gigs start receiving interest.
          </p>
          <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center">
            No applicants yet. Post a role to begin tracking candidates by stage.
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stages.map((stage) => (
            <div key={stage.label} className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{stage.label}</p>
              <p className="text-2xl font-semibold text-gray-900 mb-1">{stage.count ?? '--'}</p>
              <p className="text-xs text-gray-500">{stage.description || 'Waiting for data...'}</p>
            </div>
          ))}
        </section>
      )}

      <section className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
        Candidate pipeline tooling is under construction. Soon you will filter by stage, skills, and
        availability.
      </section>
    </div>
  );
}

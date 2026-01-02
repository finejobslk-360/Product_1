'use client';

import { useEffect, useMemo, useState, type ReactNode, type ChangeEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  ArrowRight,
  Clock,
  X,
  MapPin,
  Pencil,
  Trash2,
  Building2,
  AtSign,
  Mail,
  Tag,
  Camera,
} from 'lucide-react';

type SummaryStat = {
  label: string;
  value?: string;
  trend?: string;
  trendUp?: boolean;
};

type PostSummary = {
  id: string;
  title: string;
  company?: string;
  department?: string;
  coverImage?: string;
  overview?: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location?: string;
  experienceLevel: ExperienceLevel;
  type: 'job' | 'gig';
  status: 'Active' | 'Draft';
  lastUpdated?: string;
  applicants?: number;
  budget?: string;
  description?: string;
  responsibilities?: string[];
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  perks?: string[];
  hiringSteps?: string[];
  tags?: string[];
  ctaText?: string;
};

type TabKey = 'all' | 'jobs' | 'gigs';
type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
type ExperienceLevel = 'Junior' | 'Mid-level' | 'Senior' | 'Lead';

type RoleFormState = {
  title: string;
  company: string;
  department: string;
  coverImage: string;
  overview: string;
  type: 'job' | 'gig';
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  experienceLevel: ExperienceLevel;
  budget: string;
  status: 'Active' | 'Draft';
  applicants?: number;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  whyJoin: string;
  perks: string[];
  hiringSteps: string[];
  ctaText: string;
  tags: string[];
};

const defaultHiringSteps = [
  'Application review',
  'Introductory call',
  'Skill assessment',
  'Final interview',
  'Offer & onboarding',
];

const defaultPerks = [
  'Flexible working hours',
  'Remote-friendly culture',
  'Learning & development budget',
  'Paid leave',
  'Career growth opportunities',
];

const defaultTags = ['#Remote', '#ARVR', '#Startup', '#Creative'];

const emptyDraft = (type: 'job' | 'gig' = 'job'): RoleFormState => ({
  title: '',
  company: '',
  department: '',
  coverImage: '',
  overview: '',
  type,
  employmentType: 'Full-time',
  workMode: 'Remote',
  location: '',
  experienceLevel: 'Mid-level',
  budget: '',
  status: 'Active',
  applicants: undefined,
  description: '',
  responsibilities: [''],
  requiredSkills: [''],
  niceToHaveSkills: [],
  whyJoin: '',
  perks: [],
  hiringSteps: [...defaultHiringSteps],
  ctaText: 'Apply Now',
  tags: [],
});

export default function DashboardHome() {
  const searchParams = useSearchParams();
  const isBrowser = typeof window !== 'undefined';
  const openParam = searchParams?.get('open');
  const defaultWizardType: 'job' | 'gig' = openParam === 'gig' ? 'gig' : 'job';
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [activePosts, setActivePosts] = useState<PostSummary[]>(() => {
    if (!isBrowser) return [];
    const stored = window.localStorage.getItem('employerPosts');
    if (!stored) return [];
    try {
      return JSON.parse(stored) as PostSummary[];
    } catch (err) {
      console.warn('Failed to parse stored posts', err);
      return [];
    }
  });
  const [wizardOpen, setWizardOpen] = useState(openParam === 'job' || openParam === 'gig');
  const [wizardStep, setWizardStep] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RoleFormState>(() => emptyDraft(defaultWizardType));
  const [pendingDelete, setPendingDelete] = useState<PostSummary | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(() =>
    isBrowser ? window.localStorage.getItem('employerAvatar') : null
  );
  const [profile] = useState<{ company: string; contact: string; email: string }>(() => {
    const storedName = isBrowser ? window.localStorage.getItem('userName') : null;
    const storedSubtitle = isBrowser ? window.localStorage.getItem('userSubtitle') : null;
    const storedEmail = isBrowser ? window.localStorage.getItem('userEmail') : null;

    return {
      company: storedSubtitle || '360 Technologies',
      contact: storedName || 'Workspace member',
      email: storedEmail || 'employer@example.com',
    };
  });

  const openWizard = (type: 'job' | 'gig' = 'job') => {
    setDraft(emptyDraft(type));
    setWizardStep(1);
    setEditingId(null);
    setWizardOpen(true);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('employerPosts', JSON.stringify(activePosts));
    } catch (err) {
      console.warn('Failed to persist posts', err);
    }
  }, [activePosts]);

  const summaryStats: SummaryStat[] = useMemo(() => {
    const total = activePosts.length;
    const totalApplicants = activePosts.reduce((sum, post) => sum + (post.applicants ?? 0), 0);

    return [
      {
        label: 'Total Posts',
        value: total ? `${total}` : undefined,
        trend: total ? `${total} saved locally` : 'Data will appear after your first post.',
      },
      {
        label: 'Applications',
        value: totalApplicants ? `${totalApplicants}` : undefined,
        trend: totalApplicants ? 'Across all roles' : 'Connect tracking to view applications.',
      },
      { label: 'Total Views', trend: 'Views will populate once roles go live.' },
      { label: 'CTR', trend: 'CTR is calculated after collecting traffic.' },
    ];
  }, [activePosts]);

  const filteredPosts = useMemo(() => {
    if (activeTab === 'jobs') return activePosts.filter((post) => post.type === 'job');
    if (activeTab === 'gigs') return activePosts.filter((post) => post.type === 'gig');
    return activePosts;
  }, [activeTab, activePosts]);

  const openEditWizard = (post: PostSummary) => {
    setDraft({
      title: post.title,
      company: post.company ?? '',
      department: post.department ?? '',
      coverImage: post.coverImage ?? '',
      overview: post.overview ?? '',
      type: post.type,
      employmentType: post.employmentType,
      workMode: post.workMode,
      location: post.location ?? '',
      experienceLevel: post.experienceLevel,
      budget: post.budget ?? '',
      status: post.status,
      applicants: post.applicants,
      description: post.description ?? '',
      responsibilities: post.responsibilities?.length ? post.responsibilities : [''],
      requiredSkills: post.requiredSkills?.length ? post.requiredSkills : [''],
      niceToHaveSkills: post.niceToHaveSkills ?? [],
      whyJoin: post.description ?? '',
      perks: post.perks ?? [],
      hiringSteps: post.hiringSteps?.length ? post.hiringSteps : [...defaultHiringSteps],
      ctaText: post.ctaText || 'Apply Now',
      tags: post.tags ?? [],
    });
    setEditingId(post.id);
    setWizardStep(1);
    setWizardOpen(true);
  };

  const handleDeletePost = (id: string) => {
    setActivePosts((prev) => prev.filter((post) => post.id !== id));
  };

  const requestDelete = (post: PostSummary) => {
    setPendingDelete(post);
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      handleDeletePost(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  const handleSavePost = () => {
    if (!draft.title.trim() || !draft.company.trim() || !draft.location.trim()) return;
    const now = new Date();
    const newId = editingId ?? `post-${now.getTime()}`;
    const formattedDate = now.toLocaleDateString();

    const nextPost: PostSummary = {
      id: newId,
      title: draft.title.trim(),
      company: draft.company.trim(),
      department: draft.department || undefined,
      coverImage: draft.coverImage || undefined,
      overview: draft.overview || undefined,
      employmentType: draft.employmentType,
      workMode: draft.workMode,
      location: draft.location.trim(),
      experienceLevel: draft.experienceLevel,
      type: draft.type,
      status: draft.status,
      lastUpdated: formattedDate,
      applicants: draft.applicants,
      budget: draft.budget?.trim() || undefined,
      description: draft.whyJoin || draft.description || undefined,
      responsibilities: draft.responsibilities.filter(Boolean),
      requiredSkills: draft.requiredSkills.filter(Boolean),
      niceToHaveSkills: draft.niceToHaveSkills.filter(Boolean),
      perks: draft.perks,
      hiringSteps: draft.hiringSteps.filter(Boolean),
      tags: draft.tags,
      ctaText: draft.ctaText,
    };

    setActivePosts((prev) => {
      if (editingId) {
        return prev.map((post) => (post.id === editingId ? { ...post, ...nextPost } : post));
      }
      return [...prev, nextPost];
    });

    setWizardOpen(false);
    setEditingId(null);
    setWizardStep(1);
    setDraft(emptyDraft());
  };

  const totalSteps = 4;

  const canProceed =
    (wizardStep === 1 &&
      !!draft.title.trim() &&
      !!draft.company.trim() &&
      !!draft.overview.trim()) ||
    (wizardStep === 2 && !!draft.employmentType && !!draft.workMode && !!draft.location.trim()) ||
    (wizardStep === 3 &&
      draft.responsibilities.filter(Boolean).length > 0 &&
      draft.requiredSkills.filter(Boolean).length > 0) ||
    (wizardStep === 4 && !!draft.ctaText.trim());

  return (
    <div className="space-y-6">
      <HeroHeader
        profile={profile}
        profileImage={profileImage}
        onAvatarChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            setProfileImage(result);
            try {
              window.localStorage.setItem('employerAvatar', result);
            } catch (err) {
              console.warn('Failed to persist avatar', err);
            }
          };
          reader.readAsDataURL(file);
        }}
        onCreate={() => openWizard('job')}
      />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Active Posts</h2>
              <p className="text-xs text-gray-500">
                Track drafts, live roles, and gigs. Use the wizard to add more details.
              </p>
            </div>
            <div className="flex gap-2 text-xs bg-gray-100 rounded-full p-1">
              <TabButton
                label="All"
                active={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
              />
              <TabButton
                label="Jobs"
                active={activeTab === 'jobs'}
                onClick={() => setActiveTab('jobs')}
              />
              <TabButton
                label="Gigs"
                active={activeTab === 'gigs'}
                onClick={() => setActiveTab('gigs')}
              />
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-600 text-center">
              <p className="font-semibold text-gray-900 mb-1">No postings yet</p>
              <p className="text-gray-500 mb-3">
                Add your first job or gig to see analytics and listings here. Use Manage Jobs or
                Manage Gigs to start.
              </p>
              <div className="flex items-center justify-center gap-3 text-xs text-blue-600">
                <Link href="/dashboard/manage-jobs" className="font-semibold hover:text-blue-700">
                  Go to Manage Jobs
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/dashboard/manage-gigs" className="font-semibold hover:text-blue-700">
                  Go to Manage Gigs
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y">
              {filteredPosts.map((post) => (
                <JobRow
                  key={post.id}
                  {...post}
                  onEdit={() => openEditWizard(post)}
                  onDelete={() => requestDelete(post)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <RoleWizard
        open={wizardOpen}
        step={wizardStep}
        totalSteps={totalSteps}
        draft={draft}
        isEditing={!!editingId}
        canProceed={canProceed}
        onChange={setDraft}
        onClose={() => {
          setWizardOpen(false);
          setEditingId(null);
          setWizardStep(1);
          setDraft(emptyDraft());
        }}
        onBack={() => setWizardStep((prev) => Math.max(1, prev - 1))}
        onNext={() => setWizardStep((prev) => Math.min(totalSteps, prev + 1))}
        onSave={handleSavePost}
        onCoverImageChange={(file) => {
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => setDraft((d) => ({ ...d, coverImage: reader.result as string }));
          reader.readAsDataURL(file);
        }}
      />

      <DeleteConfirm
        open={!!pendingDelete}
        postTitle={pendingDelete?.title ?? ''}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
function HeroHeader({
  profile,
  profileImage,
  onAvatarChange,
  onCreate,
}: {
  profile: { company: string; contact: string; email: string };
  profileImage: string | null;
  onAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCreate: () => void;
}) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-base font-semibold uppercase overflow-hidden border border-white/40">
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile.company.slice(0, 2)
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-white text-blue-700 rounded-full border border-blue-100 flex items-center justify-center shadow">
              <Camera className="w-3.5 h-3.5" />
            </span>
          </label>
          <div>
            <p className="text-sm opacity-90">Company</p>
            <p className="text-xl font-semibold leading-tight">{profile.company}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs opacity-90">
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            {profile.contact}
          </span>
          <span className="inline-flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            {profile.email}
          </span>
          <span className="inline-flex items-center gap-1">
            <AtSign className="w-3.5 h-3.5" />
            Workspace access enabled
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/manage-jobs"
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/15 transition"
        >
          Manage jobs
        </Link>
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-lg bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50 transition"
        >
          Create role
        </button>
      </div>
    </section>
  );
}

function StatCard({ label, value, trend, trendUp }: SummaryStat) {
  const displayValue = value ?? '--';
  const displayTrend = trend ?? 'Waiting for data...';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-semibold text-gray-900 mb-1">{displayValue}</p>
      <p className={`text-[11px] font-medium ${trendUp ? 'text-green-600' : 'text-gray-500'}`}>
        {displayTrend}
      </p>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full ${
        active ? 'bg-white shadow text-gray-900' : 'text-gray-500'
      } text-[11px] font-medium`}
    >
      {label}
    </button>
  );
}

function JobRow({
  title,
  company,
  department,
  location,
  type,
  status,
  lastUpdated,
  applicants,
  budget,
  description,
  coverImage,
  employmentType,
  workMode,
  experienceLevel,
  tags,
  onEdit,
  onDelete,
}: PostSummary & { onEdit: () => void; onDelete: () => void }) {
  const statusStyles =
    status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700';

  return (
    <div className="px-4 py-4 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        {coverImage ? (
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
        )}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-[11px] text-gray-500">
            {company || 'Company pending'} - {department || 'Dept TBD'} -{' '}
            {type === 'job' ? 'Job' : 'Gig'}
          </p>
          <p className="text-[11px] text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            {location || 'Location TBD'} - {employmentType} - {workMode} - {experienceLevel}
          </p>
          {budget && <p className="text-[11px] text-gray-500">Budget / salary: {budget}</p>}
          {description && <p className="text-[11px] text-gray-500 mt-1">{description}</p>}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusStyles}`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </span>
          <p className="text-[11px] text-gray-500 mt-1">
            {typeof applicants === 'number'
              ? `${applicants} applicants`
              : 'Applicants will appear once live'}
            {lastUpdated ? ` - Updated ${lastUpdated}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            onClick={onEdit}
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
          <button
            className="text-[11px] font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
            onClick={onDelete}
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
function DeleteConfirm({
  open,
  postTitle,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  postTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 py-8 z-[70]">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-sm p-5 space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">Delete role?</p>
          <p className="text-xs text-gray-600 mt-1">
            You are about to remove{' '}
            <span className="font-semibold">{postTitle || 'this role'}</span>. This cannot be
            undone.
          </p>
        </div>
        <div className="flex justify-end gap-2 text-xs">
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}
function RoleWizard({
  open,
  step,
  totalSteps,
  draft,
  isEditing,
  canProceed,
  onChange,
  onClose,
  onBack,
  onNext,
  onSave,
  onCoverImageChange,
}: {
  open: boolean;
  step: number;
  totalSteps: number;
  draft: RoleFormState;
  isEditing: boolean;
  canProceed: boolean;
  onChange: (draft: RoleFormState) => void;
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  onSave: () => void;
  onCoverImageChange: (file: File | null) => void;
}) {
  if (!open) return null;

  const handleNext = () => {
    if (step < totalSteps) {
      onNext();
    } else {
      onSave();
    }
  };

  const buttonLabel = step < totalSteps ? 'Next step' : isEditing ? 'Save changes' : 'Publish role';

  type ArrayField =
    | 'responsibilities'
    | 'requiredSkills'
    | 'niceToHaveSkills'
    | 'perks'
    | 'hiringSteps'
    | 'tags';

  const updateListItem = (field: ArrayField, index: number, value: string) => {
    const list = [...draft[field]];
    list[index] = value;
    onChange({ ...draft, [field]: list });
  };

  const addListItem = (field: ArrayField) => {
    const list = [...draft[field], ''];
    onChange({ ...draft, [field]: list });
  };

  const removeListItem = (field: ArrayField, index: number) => {
    const list = [...draft[field]];
    list.splice(index, 1);
    onChange({ ...draft, [field]: list.length ? list : [''] });
  };

  const toggleSelection = (field: ArrayField, value: string) => {
    const list = new Set(draft[field]);
    if (list.has(value)) {
      list.delete(value);
    } else {
      list.add(value);
    }
    onChange({ ...draft, [field]: Array.from(list) });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 py-8 z-[60]">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-5xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">Post new role</p>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit role' : 'Create a new role'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            aria-label="Close wizard"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 text-xs">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const current = index + 1;
            return (
              <div key={current} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                    step === current ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {current}
                </div>
                <span
                  className={step === current ? 'text-gray-900 font-semibold' : 'text-gray-500'}
                >
                  {current === 1
                    ? 'Basics & Branding'
                    : current === 2
                      ? 'Employment'
                      : current === 3
                        ? 'Responsibilities & Culture'
                        : 'Review & Publish'}
                </span>
                {current < totalSteps && <div className="w-8 h-px bg-gray-200" />}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[65vh] overflow-y-auto">
          {step === 1 && (
            <>
              <Field label="Role Title" required>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => onChange({ ...draft, title: e.target.value })}
                  placeholder="e.g. Senior UI/UX Designer"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Company Name" required>
                  <input
                    type="text"
                    value={draft.company}
                    onChange={(e) => onChange({ ...draft, company: e.target.value })}
                    placeholder="Your company name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </Field>
                <Field label="Department / Team">
                  <select
                    value={draft.department}
                    onChange={(e) => onChange({ ...draft, department: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select department</option>
                    {[
                      'Engineering',
                      'Design',
                      'Product',
                      'XR / Game Development',
                      'Marketing',
                      'Operations',
                      'Other',
                    ].map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Role Cover Image">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onCoverImageChange(e.target.files?.[0] ?? null)}
                      className="text-xs"
                    />
                    {draft.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={draft.coverImage}
                        alt="Cover preview"
                        className="w-16 h-10 object-cover rounded border border-gray-200"
                      />
                    )}
                  </div>
                </Field>
                <Field label="Role Overview" required>
                  <input
                    type="text"
                    value={draft.overview}
                    onChange={(e) => onChange({ ...draft, overview: e.target.value })}
                    placeholder="Short summary explaining the role and its impact"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Employment Type" required>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'Full-time',
                        'Part-time',
                        'Contract',
                        'Internship',
                        'Freelance',
                      ] as EmploymentType[]
                    ).map((value) => (
                      <ChipButton
                        key={value}
                        active={draft.employmentType === value}
                        label={value}
                        onClick={() => onChange({ ...draft, employmentType: value })}
                      />
                    ))}
                  </div>
                </Field>
                <Field label="Work Mode" required>
                  <div className="flex gap-2">
                    {(['Remote', 'Hybrid', 'On-site'] as WorkMode[]).map((value) => (
                      <ChipButton
                        key={value}
                        active={draft.workMode === value}
                        label={value}
                        onClick={() => onChange({ ...draft, workMode: value })}
                      />
                    ))}
                  </div>
                </Field>
                <Field label="Experience Level">
                  <select
                    value={draft.experienceLevel}
                    onChange={(e) =>
                      onChange({ ...draft, experienceLevel: e.target.value as ExperienceLevel })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {['Junior', 'Mid-level', 'Senior', 'Lead'].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Location" required>
                  <input
                    type="text"
                    value={draft.location}
                    onChange={(e) => onChange({ ...draft, location: e.target.value })}
                    placeholder="Remote / Colombo / Singapore / Global"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </Field>
                <Field label="Budget / Salary Range">
                  <input
                    type="text"
                    value={draft.budget}
                    onChange={(e) => onChange({ ...draft, budget: e.target.value })}
                    placeholder="e.g. LKR 150,000 – 250,000 / Month"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Key Responsibilities" hint="Add bullet points">
                <ListInput
                  items={draft.responsibilities}
                  onChange={(index, value) => updateListItem('responsibilities', index, value)}
                  onAdd={() => addListItem('responsibilities')}
                  onRemove={(index) => removeListItem('responsibilities', index)}
                  placeholder="Design intuitive user experiences"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Required Skills (Must-Have)">
                  <ListInput
                    items={draft.requiredSkills}
                    onChange={(index, value) => updateListItem('requiredSkills', index, value)}
                    onAdd={() => addListItem('requiredSkills')}
                    onRemove={(index) => removeListItem('requiredSkills', index)}
                    placeholder="Figma, React, UX research..."
                  />
                </Field>
                <Field label="Nice-to-Have Skills">
                  <ListInput
                    items={draft.niceToHaveSkills}
                    onChange={(index, value) => updateListItem('niceToHaveSkills', index, value)}
                    onAdd={() => addListItem('niceToHaveSkills')}
                    onRemove={(index) => removeListItem('niceToHaveSkills', index)}
                    placeholder="Motion design, 3D, analytics..."
                  />
                </Field>
              </div>

              <Field label="Why Join Us?">
                <textarea
                  value={draft.whyJoin}
                  onChange={(e) => onChange({ ...draft, whyJoin: e.target.value })}
                  placeholder="Explain culture, growth, learning, and impact"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                />
              </Field>

              <Field label="Perks & Benefits">
                <div className="flex flex-wrap gap-2">
                  {defaultPerks.map((perk) => (
                    <ChipButton
                      key={perk}
                      active={draft.perks.includes(perk)}
                      label={perk}
                      onClick={() => toggleSelection('perks', perk)}
                    />
                  ))}
                </div>
              </Field>

              <Field label="Our Hiring Process">
                <ListInput
                  items={draft.hiringSteps}
                  onChange={(index, value) => updateListItem('hiringSteps', index, value)}
                  onAdd={() => addListItem('hiringSteps')}
                  onRemove={(index) => removeListItem('hiringSteps', index)}
                  placeholder="Application review"
                />
              </Field>
            </>
          )}

          {step === 4 && (
            <div className="space-y-3 text-sm text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Application CTA Text">
                  <input
                    type="text"
                    value={draft.ctaText}
                    onChange={(e) => onChange({ ...draft, ctaText: e.target.value })}
                    placeholder="Apply Now"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </Field>
                <Field label="Role Status">
                  <div className="flex gap-2">
                    {(['Active', 'Draft'] as const).map((status) => (
                      <ChipButton
                        key={status}
                        active={draft.status === status}
                        label={status}
                        onClick={() => onChange({ ...draft, status })}
                      />
                    ))}
                  </div>
                </Field>
              </div>

              <Field label="Role Tags">
                <div className="flex flex-wrap gap-2">
                  {defaultTags.map((tag) => (
                    <ChipButton
                      key={tag}
                      active={draft.tags.includes(tag)}
                      label={tag}
                      onClick={() => toggleSelection('tags', tag)}
                    />
                  ))}
                </div>
              </Field>

              <Field label="Live Preview (Read-only)">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">
                    {draft.title || 'Untitled role'} - {draft.company || 'Company'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {draft.location || 'Location'} - {draft.employmentType} - {draft.workMode}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {draft.overview || 'Role overview will show here for candidates.'}
                  </p>
                  {draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {draft.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Field>

              <Field label="Social Share Preview">
                <p className="text-xs text-gray-600">
                  Uses cover image, company logo, and role title for LinkedIn/Twitter cards.
                </p>
              </Field>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={step === 1}
            className="text-xs font-semibold text-gray-600 px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-gray-600 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-gray-600">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </div>
      {children}
      {hint && <p className="text-[11px] text-gray-500 mt-1">{hint}</p>}
    </label>
  );
}

function ListInput({
  items,
  onChange,
  onAdd,
  onRemove,
  placeholder,
}: {
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => onRemove(index)}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            aria-label="Remove item"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-xs font-semibold text-blue-600 inline-flex items-center gap-1"
      >
        <ArrowRight className="w-3 h-3" />
        Add another
      </button>
    </div>
  );
}

function ChipButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-sm font-semibold ${
        active
          ? 'border-blue-600 text-blue-600 bg-blue-50'
          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experienceLevel: string;
  description: string;
  requirements: string[];
  postedDate: string;
  salaryRange?: string;
  matchPercentage?: number;
  isRecommended?: boolean;
  logo?: string;
}

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'Tech Innovators Inc.',
    location: 'Remote',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    description:
      "Based on your profile, we think you'd be a great fit for this role. Apply now to join our team of innovators.",
    requirements: ['React', 'Node.js', 'TypeScript', 'AWS'],
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    matchPercentage: 95,
    isRecommended: true,
    logo: 'https://ui-avatars.com/api/?name=Tech+Innovators&background=0D8ABC&color=fff',
  },
  {
    id: '2',
    title: 'Data Analyst',
    company: 'Global Solutions Ltd.',
    location: 'New York, NY',
    type: 'Full-time',
    experienceLevel: 'Entry Level',
    description:
      'Your skills match our requirements for this role. We encourage you to apply and explore this opportunity.',
    requirements: ['SQL', 'Python', 'Tableau', 'Excel'],
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    matchPercentage: 88,
    isRecommended: true,
    logo: 'https://ui-avatars.com/api/?name=Global+Solutions&background=6366f1&color=fff',
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: 'Creative Minds Agency',
    location: 'Los Angeles, CA',
    type: 'Contract',
    experienceLevel: 'Senior Level',
    description:
      'Join our dynamic team as a Frontend Developer. We need someone with a creative flair and a proven track record in building responsive web applications.',
    requirements: ['Vue.js', 'Tailwind CSS', 'Figma', 'JavaScript'],
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    matchPercentage: 75,
    isRecommended: false,
    logo: 'https://ui-avatars.com/api/?name=Creative+Minds&background=f43f5e&color=fff',
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'FutureTech Corp.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    experienceLevel: 'Senior Level',
    description:
      'FutureTech is hiring a Product Manager to lead the development of our next-generation products. The role requires strong leadership skills and a deep understanding of product development lifecycles.',
    requirements: ['Agile', 'Scrum', 'Product Strategy', 'JIRA'],
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    matchPercentage: 60,
    isRecommended: false,
    logo: 'https://ui-avatars.com/api/?name=Future+Tech&background=10b981&color=fff',
  },
  {
    id: '5',
    title: 'Marketing Specialist',
    company: 'Brand Builders',
    location: 'Chicago, IL',
    type: 'Part-time',
    experienceLevel: 'Mid Level',
    description:
      'We are looking for a Marketing Specialist to help us grow our brand presence. You will be responsible for creating and executing marketing campaigns across various channels.',
    requirements: ['SEO', 'Content Marketing', 'Social Media', 'Google Analytics'],
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    matchPercentage: 45,
    isRecommended: false,
    logo: 'https://ui-avatars.com/api/?name=Brand+Builders&background=f59e0b&color=fff',
  },
  {
    id: '6',
    title: 'Healthcare Administrator',
    company: 'HealthFirst Group',
    location: 'Chicago, IL',
    type: 'Full-time',
    experienceLevel: 'Senior Level',
    description:
      'HealthFirst is seeking a Healthcare Administrator to oversee daily operations and ensure efficient service delivery. Strong organizational and communication skills are essential.',
    requirements: ['Healthcare Management', 'Operations', 'Compliance', 'Leadership'],
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    matchPercentage: 30,
    isRecommended: false,
    logo: 'https://ui-avatars.com/api/?name=Health+First&background=3b82f6&color=fff',
  },
];

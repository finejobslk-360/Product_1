export interface CVData {
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
    website?: string;
    linkedin?: string;
  };
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  references?: Reference[];
  achievements?: string[];
  languages?: string[];
  awards?: string[];
  softSkills?: string[];
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  phone: string;
  email?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export type CVTemplate = 'modern' | 'classic' | 'minimalist' | 'professional' | 'executive' | 'creative';

// --- UTILITY: Add this to the bottom of the file ---

export const initialCVData: CVData = {
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    website: '',
    linkedin: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  references: [],
  achievements: [],
  languages: [],
  awards: [],
  softSkills: [],
};
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

export type CVTemplate = 'modern' | 'classic' | 'minimalist' | 'professional';

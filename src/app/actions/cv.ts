import { CVData } from '@/types/cv';

type LocalCv = {
  id: string;
  title: string;
  templateId: string;
  content: CVData;
  createdAt: string;
};

export async function saveCV(data: CVData, templateId: string, title: string) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { success: false, error: 'Local storage not available' };
    }

    const key = 'local_cvs';
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as LocalCv[];
    const id = 'local-' + Date.now().toString();
    const newCv: LocalCv = {
      id,
      title: title || 'My CV',
      templateId,
      content: data,
      createdAt: new Date().toISOString(),
    };

    existing.unshift(newCv);
    localStorage.setItem(key, JSON.stringify(existing));

    return { success: true, cvId: id };
  } catch (error: unknown) {
    console.error('Error saving CV to localStorage:', error);
    return { success: false, error: 'Failed to save CV locally' };
  }
}

export async function getCVs() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const key = 'local_cvs';
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as LocalCv[];
    // Ensure createdAt is a string and return only relevant fields expected by UI
    return existing.map((c) => ({ id: c.id, title: c.title, templateId: c.templateId, createdAt: c.createdAt }));
  } catch (error: unknown) {
    console.error('Error reading CVs from localStorage:', error);
    return [];
  }
}

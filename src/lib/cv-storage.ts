import { CVData } from '@/types/cv';

// Define the shape of the stored object
export type LocalCv = {
  id: string;
  title: string;
  templateId: string;
  content: CVData;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = 'local_cvs';

/**
 * Save a new or existing CV to LocalStorage
 */
export async function saveCV(data: CVData, templateId: string, title: string, existingId?: string) {
  try {
    if (typeof window === 'undefined') return { success: false, error: 'Window not defined' };

    const existingJSON = localStorage.getItem(STORAGE_KEY);
    const existing: LocalCv[] = existingJSON ? JSON.parse(existingJSON) : [];

    const now = new Date().toISOString();

    if (existingId) {
      // Update existing CV
      const index = existing.findIndex((cv) => cv.id === existingId);
      if (index !== -1) {
        existing[index] = {
          ...existing[index],
          title,
          templateId,
          content: data,
          updatedAt: now,
        };
      } else {
        return { success: false, error: 'CV not found to update' };
      }
    } else {
      // Create new CV
      const newCv: LocalCv = {
        id: 'local-' + Date.now().toString(),
        title: title || 'My CV',
        templateId,
        content: data,
        createdAt: now,
        updatedAt: now,
      };
      existing.unshift(newCv);
      // Return the ID so the UI can redirect to the edit page
      existingId = newCv.id;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return { success: true, cvId: existingId };
  } catch (error) {
    console.error('Error saving CV:', error);
    return { success: false, error: 'Failed to save CV locally' };
  }
}

/**
 * Get the list of all CVs (metadata only, no heavy content)
 */
export async function getCVs() {
  try {
    if (typeof window === 'undefined') return [];
    
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];

    const existing = JSON.parse(json) as LocalCv[];
    
    // Return lightweight objects for the dashboard list
    return existing.map((c) => ({
      id: c.id,
      title: c.title,
      templateId: c.templateId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));
  } catch (error) {
    console.error('Error reading CVs:', error);
    return [];
  }
}

/**
 * Get a single full CV by ID (includes content)
 */
export async function getCVById(id: string): Promise<LocalCv | null> {
  try {
    if (typeof window === 'undefined') return null;
    
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return null;

    const existing = JSON.parse(json) as LocalCv[];
    return existing.find((c) => c.id === id) || null;
  } catch (error) {
    console.error('Error getting CV by ID:', error);
    return null;
  }
}

/**
 * Delete a CV by ID
 */
export async function deleteCV(id: string) {
  try {
    if (typeof window === 'undefined') return { success: false };

    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return { success: false };

    const existing = JSON.parse(json) as LocalCv[];
    const filtered = existing.filter((c) => c.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error('Error deleting CV:', error);
    return { success: false };
  }
}
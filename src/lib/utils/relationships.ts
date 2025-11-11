/**
 * İlişkilendirme Utility Fonksiyonları
 * Companies, Contacts, Tasks, Notes, Events arasında ilişki yönetimi
 */

export type EntityType = 'company' | 'contact';
export type RelationType = 'task' | 'note' | 'event' | 'project';

export interface RelatedEntity {
  type: EntityType;
  id: string;
  name: string;
}

// LocalStorage Keys
export const STORAGE_KEYS = {
  companies: 'crmdeep_companies',
  contacts: 'crmdeep_contacts',
  tasks: 'crmdeep_tasks',
  notes: 'crmdeep_notes',
  events: 'crmdeep_calendar_events',
  projects: 'crmdeep_projects',
};

/**
 * Varlığa ilişki ekle (company veya contact'a task/note/event ekle)
 */
export function addRelationship(
  entityType: EntityType,
  entityId: string,
  relationType: RelationType,
  relationId: string
): void {
  const storageKey = entityType === 'company' ? STORAGE_KEYS.companies : STORAGE_KEYS.contacts;
  const stored = localStorage.getItem(storageKey);

  if (!stored) return;

  const entities = JSON.parse(stored);
  const entityIndex = entities.findIndex((e: any) => e.id === entityId);

  if (entityIndex === -1) return;

  const fieldName = `related${capitalize(relationType)}s` as 'relatedTasks' | 'relatedNotes' | 'relatedEvents';

  if (!entities[entityIndex][fieldName]) {
    entities[entityIndex][fieldName] = [];
  }

  // Eğer zaten eklenmemişse ekle
  if (!entities[entityIndex][fieldName].includes(relationId)) {
    entities[entityIndex][fieldName].push(relationId);
    entities[entityIndex].updated_at = new Date().toISOString();
    entities[entityIndex].last_activity_date = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(entities));
  }
}

/**
 * Varlıktan ilişki çıkar
 */
export function removeRelationship(
  entityType: EntityType,
  entityId: string,
  relationType: RelationType,
  relationId: string
): void {
  const storageKey = entityType === 'company' ? STORAGE_KEYS.companies : STORAGE_KEYS.contacts;
  const stored = localStorage.getItem(storageKey);

  if (!stored) return;

  const entities = JSON.parse(stored);
  const entityIndex = entities.findIndex((e: any) => e.id === entityId);

  if (entityIndex === -1) return;

  const fieldName = `related${capitalize(relationType)}s` as 'relatedTasks' | 'relatedNotes' | 'relatedEvents';

  if (entities[entityIndex][fieldName]) {
    entities[entityIndex][fieldName] = entities[entityIndex][fieldName].filter(
      (id: string) => id !== relationId
    );
    entities[entityIndex].updated_at = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(entities));
  }
}

/**
 * Varlığın tüm ilişkili öğelerini getir
 */
export function getRelatedItems(
  entityType: EntityType,
  entityId: string
): {
  tasks: any[];
  notes: any[];
  events: any[];
} {
  const storageKey = entityType === 'company' ? STORAGE_KEYS.companies : STORAGE_KEYS.contacts;
  const stored = localStorage.getItem(storageKey);

  if (!stored) return { tasks: [], notes: [], events: [] };

  const entities = JSON.parse(stored);
  const entity = entities.find((e: any) => e.id === entityId);

  if (!entity) return { tasks: [], notes: [], events: [] };

  // Tasks
  const tasksStored = localStorage.getItem(STORAGE_KEYS.tasks);
  const allTasks = tasksStored ? JSON.parse(tasksStored) : [];
  const tasks = allTasks.filter((task: any) =>
    entity.relatedTasks?.includes(task.id)
  );

  // Notes
  const notesStored = localStorage.getItem(STORAGE_KEYS.notes);
  const allNotes = notesStored ? JSON.parse(notesStored) : [];
  const notes = allNotes.filter((note: any) =>
    entity.relatedNotes?.includes(note.id)
  );

  // Events
  const eventsStored = localStorage.getItem(STORAGE_KEYS.events);
  const allEvents = eventsStored ? JSON.parse(eventsStored) : [];
  const events = allEvents.filter((event: any) => {
    // Event'ler Date objesi olarak saklanıyor, parse et
    if (event.date && typeof event.date === 'string') {
      event.date = new Date(event.date);
    }
    return entity.relatedEvents?.includes(event.id);
  });

  return { tasks, notes, events };
}

/**
 * Task/Note/Event silindiğinde tüm ilişkileri temizle
 */
export function cleanupRelationships(
  relationType: RelationType,
  relationId: string
): void {
  // Companies'den temizle
  const companiesStored = localStorage.getItem(STORAGE_KEYS.companies);
  if (companiesStored) {
    const companies = JSON.parse(companiesStored);
    const fieldName = `related${capitalize(relationType)}s` as 'relatedTasks' | 'relatedNotes' | 'relatedEvents';

    companies.forEach((company: any) => {
      if (company[fieldName]) {
        company[fieldName] = company[fieldName].filter((id: string) => id !== relationId);
      }
    });
    localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(companies));
  }

  // Contacts'den temizle
  const contactsStored = localStorage.getItem(STORAGE_KEYS.contacts);
  if (contactsStored) {
    const contacts = JSON.parse(contactsStored);
    const fieldName = `related${capitalize(relationType)}s` as 'relatedTasks' | 'relatedNotes' | 'relatedEvents';

    contacts.forEach((contact: any) => {
      if (contact[fieldName]) {
        contact[fieldName] = contact[fieldName].filter((id: string) => id !== relationId);
      }
    });
    localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(contacts));
  }
}

/**
 * Varlığın bilgilerini getir (isim, tip)
 */
export function getEntityInfo(entityType: EntityType, entityId: string): { name: string; type: EntityType } | null {
  const storageKey = entityType === 'company' ? STORAGE_KEYS.companies : STORAGE_KEYS.contacts;
  const stored = localStorage.getItem(storageKey);

  if (!stored) return null;

  const entities = JSON.parse(stored);
  const entity = entities.find((e: any) => e.id === entityId);

  if (!entity) return null;

  return {
    name: entity.name,
    type: entityType,
  };
}

/**
 * Proje ekle (company'ye özel)
 */
export function addProjectToCompany(companyId: string, project: any): void {
  const stored = localStorage.getItem(STORAGE_KEYS.companies);
  if (!stored) return;

  const companies = JSON.parse(stored);
  const companyIndex = companies.findIndex((c: any) => c.id === companyId);

  if (companyIndex === -1) return;

  if (!companies[companyIndex].projects) {
    companies[companyIndex].projects = [];
  }

  companies[companyIndex].projects.push(project);
  companies[companyIndex].updated_at = new Date().toISOString();
  companies[companyIndex].last_activity_date = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(companies));
}

/**
 * Proje güncelle
 */
export function updateProjectInCompany(companyId: string, projectId: string, updatedProject: any): void {
  const stored = localStorage.getItem(STORAGE_KEYS.companies);
  if (!stored) return;

  const companies = JSON.parse(stored);
  const companyIndex = companies.findIndex((c: any) => c.id === companyId);

  if (companyIndex === -1) return;

  const projectIndex = companies[companyIndex].projects?.findIndex((p: any) => p.id === projectId);

  if (projectIndex !== undefined && projectIndex !== -1) {
    companies[companyIndex].projects[projectIndex] = { ...updatedProject };
    companies[companyIndex].updated_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(companies));
  }
}

/**
 * Proje sil
 */
export function removeProjectFromCompany(companyId: string, projectId: string): void {
  const stored = localStorage.getItem(STORAGE_KEYS.companies);
  if (!stored) return;

  const companies = JSON.parse(stored);
  const companyIndex = companies.findIndex((c: any) => c.id === companyId);

  if (companyIndex === -1) return;

  if (companies[companyIndex].projects) {
    companies[companyIndex].projects = companies[companyIndex].projects.filter(
      (p: any) => p.id !== projectId
    );
    companies[companyIndex].updated_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(companies));
  }
}

// Yardımcı fonksiyon
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

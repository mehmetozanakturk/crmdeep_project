/**
 * Sıralama Utility Fonksiyonları
 * Companies ve Contacts için gelişmiş sıralama
 */

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'created-newest'
  | 'created-oldest'
  | 'activity-recent'
  | 'activity-oldest'
  | 'priority-high'
  | 'priority-low'
  | 'revenue-high'
  | 'revenue-low'
  | 'projects-most'
  | 'projects-least'
  | 'contacts-most'
  | 'contacts-least'
  | 'deals-most'
  | 'deals-least'
  | 'relationships-most'
  | 'relationships-least';

interface SortableCompany {
  id: string;
  name: string;
  created_at: string;
  last_activity_date?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  total_revenue?: string;
  projects?: any[];
  contacts?: number;
  deals?: number;
  relatedTasks?: string[];
  relatedNotes?: string[];
  relatedEvents?: string[];
  [key: string]: any;
}

interface SortableContact {
  id: string;
  name: string;
  created_at: string;
  last_contact_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  relatedTasks?: string[];
  relatedNotes?: string[];
  relatedEvents?: string[];
  is_key_contact?: boolean;
  [key: string]: any;
}

/**
 * Firma listesini sırala
 */
export function sortCompanies(
  companies: SortableCompany[],
  sortBy: SortOption
): SortableCompany[] {
  const sorted = [...companies];

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'tr'));

    case 'created-newest':
      return sorted.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    case 'created-oldest':
      return sorted.sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

    case 'activity-recent':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.last_activity_date || a.created_at).getTime();
        const dateB = new Date(b.last_activity_date || b.created_at).getTime();
        return dateB - dateA;
      });

    case 'activity-oldest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.last_activity_date || a.created_at).getTime();
        const dateB = new Date(b.last_activity_date || b.created_at).getTime();
        return dateA - dateB;
      });

    case 'priority-high':
      return sorted.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

    case 'priority-low':
      return sorted.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    case 'revenue-high':
      return sorted.sort((a, b) => {
        const revenueA = parseRevenue(a.total_revenue);
        const revenueB = parseRevenue(b.total_revenue);
        return revenueB - revenueA;
      });

    case 'revenue-low':
      return sorted.sort((a, b) => {
        const revenueA = parseRevenue(a.total_revenue);
        const revenueB = parseRevenue(b.total_revenue);
        return revenueA - revenueB;
      });

    case 'projects-most':
      return sorted.sort((a, b) =>
        (b.projects?.length || 0) - (a.projects?.length || 0)
      );

    case 'projects-least':
      return sorted.sort((a, b) =>
        (a.projects?.length || 0) - (b.projects?.length || 0)
      );

    case 'contacts-most':
      return sorted.sort((a, b) => (b.contacts || 0) - (a.contacts || 0));

    case 'contacts-least':
      return sorted.sort((a, b) => (a.contacts || 0) - (b.contacts || 0));

    case 'deals-most':
      return sorted.sort((a, b) => (b.deals || 0) - (a.deals || 0));

    case 'deals-least':
      return sorted.sort((a, b) => (a.deals || 0) - (b.deals || 0));

    case 'relationships-most':
      return sorted.sort((a, b) => {
        const countA = (a.relatedTasks?.length || 0) + (a.relatedNotes?.length || 0) + (a.relatedEvents?.length || 0);
        const countB = (b.relatedTasks?.length || 0) + (b.relatedNotes?.length || 0) + (b.relatedEvents?.length || 0);
        return countB - countA;
      });

    case 'relationships-least':
      return sorted.sort((a, b) => {
        const countA = (a.relatedTasks?.length || 0) + (a.relatedNotes?.length || 0) + (a.relatedEvents?.length || 0);
        const countB = (b.relatedTasks?.length || 0) + (b.relatedNotes?.length || 0) + (b.relatedEvents?.length || 0);
        return countA - countB;
      });

    default:
      return sorted;
  }
}

/**
 * Kişi listesini sırala
 */
export function sortContacts(
  contacts: SortableContact[],
  sortBy: SortOption
): SortableContact[] {
  const sorted = [...contacts];

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'tr'));

    case 'created-newest':
      return sorted.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    case 'created-oldest':
      return sorted.sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

    case 'activity-recent':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.last_contact_date || a.created_at).getTime();
        const dateB = new Date(b.last_contact_date || b.created_at).getTime();
        return dateB - dateA;
      });

    case 'activity-oldest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.last_contact_date || a.created_at).getTime();
        const dateB = new Date(b.last_contact_date || b.created_at).getTime();
        return dateA - dateB;
      });

    case 'priority-high':
      return sorted.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityA = a.priority ? priorityOrder[a.priority] : 0;
        const priorityB = b.priority ? priorityOrder[b.priority] : 0;
        return priorityB - priorityA;
      });

    case 'priority-low':
      return sorted.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityA = a.priority ? priorityOrder[a.priority] : 0;
        const priorityB = b.priority ? priorityOrder[b.priority] : 0;
        return priorityA - priorityB;
      });

    case 'relationships-most':
      return sorted.sort((a, b) => {
        const countA = (a.relatedTasks?.length || 0) + (a.relatedNotes?.length || 0) + (a.relatedEvents?.length || 0);
        const countB = (b.relatedTasks?.length || 0) + (b.relatedNotes?.length || 0) + (b.relatedEvents?.length || 0);
        return countB - countA;
      });

    case 'relationships-least':
      return sorted.sort((a, b) => {
        const countA = (a.relatedTasks?.length || 0) + (a.relatedNotes?.length || 0) + (a.relatedEvents?.length || 0);
        const countB = (b.relatedTasks?.length || 0) + (b.relatedNotes?.length || 0) + (b.relatedEvents?.length || 0);
        return countA - countB;
      });

    default:
      return sorted;
  }
}

/**
 * Gelir string'ini sayıya çevir (₺500,000 -> 500000)
 */
function parseRevenue(revenue?: string): number {
  if (!revenue) return 0;

  // ₺ ve virgülleri temizle
  const cleaned = revenue.replace(/[₺,]/g, '').trim();

  // Aralık varsa (₺5M - ₺10M) ortalamasını al
  if (cleaned.includes('-')) {
    const parts = cleaned.split('-');
    const start = parseRevenueValue(parts[0].trim());
    const end = parseRevenueValue(parts[1].trim());
    return (start + end) / 2;
  }

  return parseRevenueValue(cleaned);
}

/**
 * Gelir değerini parse et (K, M desteği ile)
 */
function parseRevenueValue(value: string): number {
  value = value.toUpperCase();

  if (value.includes('M')) {
    return parseFloat(value.replace('M', '')) * 1000000;
  }

  if (value.includes('K')) {
    return parseFloat(value.replace('K', '')) * 1000;
  }

  return parseFloat(value) || 0;
}

/**
 * Sıralama seçeneklerini label ile birlikte getir
 */
export const SORT_OPTIONS = {
  companies: [
    { value: 'name-asc', label: 'İsim (A-Z)' },
    { value: 'name-desc', label: 'İsim (Z-A)' },
    { value: 'created-newest', label: 'En Yeni Eklenen' },
    { value: 'created-oldest', label: 'En Eski Eklenen' },
    { value: 'activity-recent', label: 'Son Aktivite (Yeni)' },
    { value: 'activity-oldest', label: 'Son Aktivite (Eski)' },
    { value: 'priority-high', label: 'Öncelik (Yüksek → Düşük)' },
    { value: 'priority-low', label: 'Öncelik (Düşük → Yüksek)' },
    { value: 'revenue-high', label: 'Gelir (Yüksek → Düşük)' },
    { value: 'revenue-low', label: 'Gelir (Düşük → Yüksek)' },
    { value: 'projects-most', label: 'En Çok Proje' },
    { value: 'contacts-most', label: 'En Çok Kişi' },
    { value: 'deals-most', label: 'En Çok Fırsat' },
    { value: 'relationships-most', label: 'En Çok İlişki' },
  ],
  contacts: [
    { value: 'name-asc', label: 'İsim (A-Z)' },
    { value: 'name-desc', label: 'İsim (Z-A)' },
    { value: 'created-newest', label: 'En Yeni Eklenen' },
    { value: 'created-oldest', label: 'En Eski Eklenen' },
    { value: 'activity-recent', label: 'Son İletişim (Yeni)' },
    { value: 'activity-oldest', label: 'Son İletişim (Eski)' },
    { value: 'priority-high', label: 'Öncelik (Yüksek → Düşük)' },
    { value: 'priority-low', label: 'Öncelik (Düşük → Yüksek)' },
    { value: 'relationships-most', label: 'En Çok İlişki' },
  ],
} as const;

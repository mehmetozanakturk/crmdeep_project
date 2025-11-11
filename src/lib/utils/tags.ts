/**
 * Etiket Yönetim Sistemi
 * Önceden tanımlı etiketler ve özel etiket yönetimi
 */

export interface Tag {
  id: string;
  name: string;
  color: string;
  category: 'company' | 'contact' | 'common';
}

// Önceden Tanımlı Etiketler
export const PREDEFINED_TAGS: Tag[] = [
  // Ortak Etiketler
  { id: 'vip', name: 'VIP', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', category: 'common' },
  { id: 'priority', name: 'Öncelikli', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', category: 'common' },
  { id: 'important', name: 'Önemli', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', category: 'common' },
  { id: 'hot', name: 'Sıcak Lead', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300', category: 'common' },

  // Firma Etiketleri
  { id: 'corporate', name: 'Kurumsal', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', category: 'company' },
  { id: 'startup', name: 'Startup', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', category: 'company' },
  { id: 'sme', name: 'KOBİ', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300', category: 'company' },
  { id: 'enterprise', name: 'Enterprise', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', category: 'company' },
  { id: 'partner', name: 'Partner', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300', category: 'company' },
  { id: 'competitor', name: 'Rakip', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300', category: 'company' },

  // Kişi Etiketleri
  { id: 'decision-maker', name: 'Karar Verici', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', category: 'contact' },
  { id: 'influencer', name: 'Etkileyici', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300', category: 'contact' },
  { id: 'technical', name: 'Teknik', color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300', category: 'contact' },
  { id: 'creative', name: 'Kreatif', color: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300', category: 'contact' },
  { id: 'referral', name: 'Referans', color: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300', category: 'contact' },
];

const STORAGE_KEY = 'crmdeep_custom_tags';

/**
 * Tüm etiketleri getir (önceden tanımlı + özel)
 */
export function getAllTags(category?: 'company' | 'contact' | 'common'): Tag[] {
  const customTags = getCustomTags();
  const allTags = [...PREDEFINED_TAGS, ...customTags];

  if (category) {
    return allTags.filter(tag => tag.category === category || tag.category === 'common');
  }

  return allTags;
}

/**
 * Özel etiketleri getir
 */
export function getCustomTags(): Tag[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Yeni özel etiket ekle
 */
export function addCustomTag(name: string, category: 'company' | 'contact' | 'common'): Tag {
  const customTags = getCustomTags();

  // Rastgele renk seç
  const colors = [
    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  ];

  const newTag: Tag = {
    id: `custom-${Date.now()}`,
    name: name.trim(),
    color: colors[Math.floor(Math.random() * colors.length)],
    category,
  };

  customTags.push(newTag);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customTags));

  return newTag;
}

/**
 * Özel etiketi sil
 */
export function deleteCustomTag(tagId: string): void {
  const customTags = getCustomTags();
  const filtered = customTags.filter(tag => tag.id !== tagId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Etiket adından Tag objesi oluştur
 */
export function getOrCreateTag(tagName: string, category: 'company' | 'contact' | 'common'): Tag {
  const allTags = getAllTags();

  // Önce mevcut etiketlerde ara (case-insensitive)
  const existing = allTags.find(tag =>
    tag.name.toLowerCase() === tagName.toLowerCase()
  );

  if (existing) {
    return existing;
  }

  // Yoksa yeni oluştur
  return addCustomTag(tagName, category);
}

/**
 * Etiket adlarını Tag objelerine çevir
 */
export function convertTagNamesToTags(
  tagNames: string[],
  category: 'company' | 'contact' | 'common'
): Tag[] {
  return tagNames.map(name => getOrCreateTag(name, category));
}

/**
 * Tag objelerini string array'e çevir
 */
export function convertTagsToNames(tags: Tag[]): string[] {
  return tags.map(tag => tag.name);
}

/**
 * Popüler etiketleri getir (en çok kullanılan)
 */
export function getPopularTags(category?: 'company' | 'contact' | 'common', limit: number = 5): Tag[] {
  // TODO: Gelecekte kullanım istatistiklerine göre sıralama yapılabilir
  const tags = getAllTags(category);
  return tags.slice(0, limit);
}

/**
 * Etiket rengini getir
 */
export function getTagColor(tagName: string): string {
  const allTags = getAllTags();
  const tag = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
  return tag?.color || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
}

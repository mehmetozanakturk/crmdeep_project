/**
 * Gruplama Utility Fonksiyonları
 * Companies ve Contacts için gelişmiş gruplama
 */

export type CompanyGroupOption =
  | 'none'
  | 'size'
  | 'status'
  | 'priority'
  | 'industry'
  | 'location'
  | 'project-status';

export type ContactGroupOption = 'none' | 'status' | 'priority' | 'company' | 'department';

interface Company {
  id: string;
  name: string;
  size: string;
  status: 'active' | 'prospect' | 'inactive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  industry: string;
  location: string;
  projects?: any[];
  [key: string]: any;
}

interface Contact {
  id: string;
  name: string;
  status: 'active' | 'client' | 'lead' | 'prospect' | 'vip' | 'inactive';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  company_name?: string;
  department?: string;
  [key: string]: any;
}

export interface GroupedItems<T> {
  groupName: string;
  groupLabel: string;
  items: T[];
  color?: string;
  icon?: string;
}

/**
 * Firmaları boyutuna göre grupla
 */
function groupCompaniesBySize(companies: Company[]): GroupedItems<Company>[] {
  const groups: Record<string, Company[]> = {
    small: [],
    medium: [],
    large: [],
    enterprise: [],
  };

  companies.forEach((company) => {
    const size = company.size.toLowerCase();
    const numericSize = parseInt(size.split('-')[0]);

    if (numericSize < 50 || size.includes('10')) {
      groups.small.push(company);
    } else if (numericSize < 250) {
      groups.medium.push(company);
    } else if (numericSize < 500) {
      groups.large.push(company);
    } else {
      groups.enterprise.push(company);
    }
  });

  return [
    {
      groupName: 'small',
      groupLabel: '🟢 Küçük Çaplı (1-49 kişi)',
      items: groups.small,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      groupName: 'medium',
      groupLabel: '🟡 Orta Çaplı (50-249 kişi)',
      items: groups.medium,
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      groupName: 'large',
      groupLabel: '🟠 Büyük Çaplı (250-499 kişi)',
      items: groups.large,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      groupName: 'enterprise',
      groupLabel: '🔴 Kurumsal (500+ kişi)',
      items: groups.enterprise,
      color: 'text-red-600 dark:text-red-400',
    },
  ].filter((group) => group.items.length > 0);
}

/**
 * Firmaları duruma göre grupla
 */
function groupCompaniesByStatus(companies: Company[]): GroupedItems<Company>[] {
  const groups: Record<string, Company[]> = {
    active: [],
    prospect: [],
    inactive: [],
  };

  companies.forEach((company) => {
    groups[company.status].push(company);
  });

  return [
    {
      groupName: 'active',
      groupLabel: '✅ Aktif Müşteriler',
      items: groups.active,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      groupName: 'prospect',
      groupLabel: '🎯 Potansiyel Müşteriler',
      items: groups.prospect,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      groupName: 'inactive',
      groupLabel: '⏸️ Pasif Müşteriler',
      items: groups.inactive,
      color: 'text-neutral-600 dark:text-neutral-400',
    },
  ].filter((group) => group.items.length > 0);
}

/**
 * Firmaları önceliğe göre grupla
 */
function groupCompaniesByPriority(companies: Company[]): GroupedItems<Company>[] {
  const groups: Record<string, Company[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  companies.forEach((company) => {
    groups[company.priority].push(company);
  });

  return [
    {
      groupName: 'critical',
      groupLabel: '🔴 Kritik Öncelik',
      items: groups.critical,
      color: 'text-red-600 dark:text-red-400',
    },
    {
      groupName: 'high',
      groupLabel: '🟠 Yüksek Öncelik',
      items: groups.high,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      groupName: 'medium',
      groupLabel: '🟡 Orta Öncelik',
      items: groups.medium,
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      groupName: 'low',
      groupLabel: '🟢 Düşük Öncelik',
      items: groups.low,
      color: 'text-green-600 dark:text-green-400',
    },
  ].filter((group) => group.items.length > 0);
}

/**
 * Firmaları sektöre göre grupla
 */
function groupCompaniesByIndustry(companies: Company[]): GroupedItems<Company>[] {
  const groups: Record<string, Company[]> = {};

  companies.forEach((company) => {
    const industry = company.industry || 'Diğer';
    if (!groups[industry]) {
      groups[industry] = [];
    }
    groups[industry].push(company);
  });

  return Object.entries(groups)
    .map(([industry, items]) => ({
      groupName: industry,
      groupLabel: `📊 ${industry}`,
      items,
    }))
    .sort((a, b) => b.items.length - a.items.length);
}

/**
 * Firmaları lokasyona göre grupla
 */
function groupCompaniesByLocation(companies: Company[]): GroupedItems<Company>[] {
  const groups: Record<string, Company[]> = {};

  companies.forEach((company) => {
    // Şehir ismini al (İstanbul, Türkiye -> İstanbul)
    const city = company.location.split(',')[0].trim() || 'Diğer';
    if (!groups[city]) {
      groups[city] = [];
    }
    groups[city].push(company);
  });

  return Object.entries(groups)
    .map(([city, items]) => ({
      groupName: city,
      groupLabel: `📍 ${city}`,
      items,
    }))
    .sort((a, b) => b.items.length - a.items.length);
}

/**
 * Firmaları proje durumuna göre grupla
 */
function groupCompaniesByProjectStatus(companies: Company[]): GroupedItems<Company>[] {
  const groups: Record<string, Company[]> = {
    'active-projects': [],
    'no-projects': [],
    'completed-projects': [],
  };

  companies.forEach((company) => {
    if (!company.projects || company.projects.length === 0) {
      groups['no-projects'].push(company);
    } else {
      const hasActiveProject = company.projects.some(
        (p: any) => p.status === 'in_progress' || p.status === 'planned'
      );
      if (hasActiveProject) {
        groups['active-projects'].push(company);
      } else {
        groups['completed-projects'].push(company);
      }
    }
  });

  return [
    {
      groupName: 'active-projects',
      groupLabel: '🚀 Aktif Projesi Var',
      items: groups['active-projects'],
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      groupName: 'completed-projects',
      groupLabel: '✅ Projeleri Tamamlanmış',
      items: groups['completed-projects'],
      color: 'text-green-600 dark:text-green-400',
    },
    {
      groupName: 'no-projects',
      groupLabel: '📋 Projesi Yok',
      items: groups['no-projects'],
      color: 'text-neutral-600 dark:text-neutral-400',
    },
  ].filter((group) => group.items.length > 0);
}

/**
 * Firmaları grupla (ana fonksiyon)
 */
export function groupCompanies(
  companies: Company[],
  groupBy: CompanyGroupOption
): GroupedItems<Company>[] {
  switch (groupBy) {
    case 'size':
      return groupCompaniesBySize(companies);
    case 'status':
      return groupCompaniesByStatus(companies);
    case 'priority':
      return groupCompaniesByPriority(companies);
    case 'industry':
      return groupCompaniesByIndustry(companies);
    case 'location':
      return groupCompaniesByLocation(companies);
    case 'project-status':
      return groupCompaniesByProjectStatus(companies);
    case 'none':
    default:
      return [
        {
          groupName: 'all',
          groupLabel: 'Tüm Firmalar',
          items: companies,
        },
      ];
  }
}

/**
 * Kişileri duruma göre grupla
 */
function groupContactsByStatus(contacts: Contact[]): GroupedItems<Contact>[] {
  const groups: Record<string, Contact[]> = {
    vip: [],
    client: [],
    active: [],
    lead: [],
    prospect: [],
    inactive: [],
  };

  contacts.forEach((contact) => {
    groups[contact.status].push(contact);
  });

  return [
    {
      groupName: 'vip',
      groupLabel: '⭐ VIP',
      items: groups.vip,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      groupName: 'client',
      groupLabel: '✅ Müşteri',
      items: groups.client,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      groupName: 'active',
      groupLabel: '🟢 Aktif',
      items: groups.active,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      groupName: 'lead',
      groupLabel: '🎯 Lead',
      items: groups.lead,
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      groupName: 'prospect',
      groupLabel: '💡 Potansiyel',
      items: groups.prospect,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      groupName: 'inactive',
      groupLabel: '⏸️ Pasif',
      items: groups.inactive,
      color: 'text-neutral-600 dark:text-neutral-400',
    },
  ].filter((group) => group.items.length > 0);
}

/**
 * Kişileri önceliğe göre grupla
 */
function groupContactsByPriority(contacts: Contact[]): GroupedItems<Contact>[] {
  const groups: Record<string, Contact[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
    none: [],
  };

  contacts.forEach((contact) => {
    const priority = contact.priority || 'none';
    groups[priority].push(contact);
  });

  return [
    {
      groupName: 'critical',
      groupLabel: '🔴 Kritik Öncelik',
      items: groups.critical,
      color: 'text-red-600 dark:text-red-400',
    },
    {
      groupName: 'high',
      groupLabel: '🟠 Yüksek Öncelik',
      items: groups.high,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      groupName: 'medium',
      groupLabel: '🟡 Orta Öncelik',
      items: groups.medium,
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      groupName: 'low',
      groupLabel: '🟢 Düşük Öncelik',
      items: groups.low,
      color: 'text-green-600 dark:text-green-400',
    },
  ].filter((group) => group.items.length > 0);
}

/**
 * Kişileri şirkete göre grupla
 */
function groupContactsByCompany(contacts: Contact[]): GroupedItems<Contact>[] {
  const groups: Record<string, Contact[]> = {};

  contacts.forEach((contact) => {
    const company = contact.company_name || 'Bağımsız';
    if (!groups[company]) {
      groups[company] = [];
    }
    groups[company].push(contact);
  });

  return Object.entries(groups)
    .map(([company, items]) => ({
      groupName: company,
      groupLabel: `🏢 ${company}`,
      items,
    }))
    .sort((a, b) => b.items.length - a.items.length);
}

/**
 * Kişileri departmana göre grupla
 */
function groupContactsByDepartment(contacts: Contact[]): GroupedItems<Contact>[] {
  const groups: Record<string, Contact[]> = {};

  contacts.forEach((contact) => {
    const department = contact.department || 'Belirtilmemiş';
    if (!groups[department]) {
      groups[department] = [];
    }
    groups[department].push(contact);
  });

  return Object.entries(groups)
    .map(([department, items]) => ({
      groupName: department,
      groupLabel: `📂 ${department}`,
      items,
    }))
    .sort((a, b) => b.items.length - a.items.length);
}

/**
 * Kişileri grupla (ana fonksiyon)
 */
export function groupContacts(
  contacts: Contact[],
  groupBy: ContactGroupOption
): GroupedItems<Contact>[] {
  switch (groupBy) {
    case 'status':
      return groupContactsByStatus(contacts);
    case 'priority':
      return groupContactsByPriority(contacts);
    case 'company':
      return groupContactsByCompany(contacts);
    case 'department':
      return groupContactsByDepartment(contacts);
    case 'none':
    default:
      return [
        {
          groupName: 'all',
          groupLabel: 'Tüm Kişiler',
          items: contacts,
        },
      ];
  }
}

/**
 * Gruplama seçeneklerini label ile birlikte getir
 */
export const GROUP_OPTIONS = {
  companies: [
    { value: 'none', label: 'Gruplama Yok' },
    { value: 'size', label: 'Firma Büyüklüğü' },
    { value: 'status', label: 'Durum' },
    { value: 'priority', label: 'Öncelik' },
    { value: 'industry', label: 'Sektör' },
    { value: 'location', label: 'Lokasyon' },
    { value: 'project-status', label: 'Proje Durumu' },
  ],
  contacts: [
    { value: 'none', label: 'Gruplama Yok' },
    { value: 'status', label: 'Durum' },
    { value: 'priority', label: 'Öncelik' },
    { value: 'company', label: 'Şirket' },
    { value: 'department', label: 'Departman' },
  ],
} as const;

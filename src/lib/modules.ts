import {
  LayoutDashboard,
  Users,
  Building2,
  CheckSquare,
  Calendar,
  StickyNote,
  Target,
  TrendingUp,
  FileText,
  Settings,
  FolderKanban,
  Clock,
  List,
  Mail,
  DollarSign,
  CreditCard,
  Package,
  MessageSquare,
  BookOpen,
  Inbox,
  FolderTree,
  BarChart3,
  Workflow,
  UserCircle,
  Briefcase,
  PieChart,
  type LucideIcon,
} from 'lucide-react';

export type ModuleCategory =
  | 'core'
  | 'sales'
  | 'operations'
  | 'marketing'
  | 'finance'
  | 'support'
  | 'company';

export interface CRMModule {
  key: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ModuleCategory;
  href: string;
  defaultPinned: boolean; // Should this be pinned by default for new users?
  requiredRole?: 'owner' | 'admin' | 'member'; // Minimum role required
}

export const MODULE_CATEGORIES: Record<ModuleCategory, { name: string; description: string }> = {
  core: {
    name: 'Çekirdek Modüller',
    description: 'Temel CRM işlevleri - Çoğu kullanıcının ihtiyacı',
  },
  sales: {
    name: 'Satış Modülleri',
    description: 'Satış süreçleri ve fırsat yönetimi',
  },
  operations: {
    name: 'Operasyon Modülleri',
    description: 'Proje ve iş takibi',
  },
  marketing: {
    name: 'Pazarlama Modülleri',
    description: 'Pazarlama kampanyaları ve listeler',
  },
  finance: {
    name: 'Finans Modülleri',
    description: 'Faturalama ve gelir yönetimi',
  },
  support: {
    name: 'Destek Modülleri',
    description: 'Müşteri destek ve yardım',
  },
  company: {
    name: 'Şirket Modülleri',
    description: 'Ekip ve yönetim araçları',
  },
};

export const CRM_MODULES: CRMModule[] = [
  // ============================================================================
  // CORE MODULES
  // ============================================================================
  {
    key: 'dashboard',
    name: 'Kontrol Paneli',
    description: 'Ana ekran ve genel bakış',
    icon: LayoutDashboard,
    category: 'core',
    href: '/dashboard',
    defaultPinned: true,
  },
  {
    key: 'contacts',
    name: 'Kişiler',
    description: 'İrtibatlar ve iletişim bilgileri',
    icon: Users,
    category: 'core',
    href: '/dashboard/contacts',
    defaultPinned: true,
  },
  {
    key: 'companies',
    name: 'Firmalar',
    description: 'Müşteriler ve şirketler',
    icon: Building2,
    category: 'core',
    href: '/dashboard/companies',
    defaultPinned: true,
  },
  {
    key: 'tasks',
    name: 'Görevler',
    description: 'Yapılacaklar ve görev takibi',
    icon: CheckSquare,
    category: 'core',
    href: '/dashboard/tasks',
    defaultPinned: true,
  },
  {
    key: 'calendar',
    name: 'Takvim',
    description: 'Randevu ve toplantılar',
    icon: Calendar,
    category: 'core',
    href: '/dashboard/calendar',
    defaultPinned: true,
  },
  {
    key: 'notes',
    name: 'Notlar',
    description: 'Kişisel not defteri',
    icon: StickyNote,
    category: 'core',
    href: '/dashboard/notes',
    defaultPinned: false,
  },
  {
    key: 'analytics',
    name: 'Analitik',
    description: 'İş performansı ve raporlar',
    icon: PieChart,
    category: 'core',
    href: '/dashboard/analytics',
    defaultPinned: true,
  },

  // ============================================================================
  // SALES MODULES
  // ============================================================================
  {
    key: 'brands',
    name: 'Markalar',
    description: 'Marka yönetimi ve takibi',
    icon: Briefcase,
    category: 'sales',
    href: '/dashboard/brands',
    defaultPinned: true,
  },
  {
    key: 'leads',
    name: 'Potansiyel Müşteriler',
    description: 'Lead yönetimi ve takibi',
    icon: Target,
    category: 'sales',
    href: '/dashboard/leads',
    defaultPinned: false,
  },
  {
    key: 'deals',
    name: 'Satış Fırsatları',
    description: 'Satış pipeline ve fırsatlar',
    icon: TrendingUp,
    category: 'sales',
    href: '/dashboard/deals',
    defaultPinned: true,
  },
  {
    key: 'quotes',
    name: 'Teklifler',
    description: 'Fiyat teklifleri ve öneriler',
    icon: FileText,
    category: 'sales',
    href: '/dashboard/quotes',
    defaultPinned: false,
  },

  // ============================================================================
  // OPERATIONS MODULES
  // ============================================================================
  {
    key: 'projects',
    name: 'Projeler',
    description: 'İş takibi ve proje yönetimi',
    icon: FolderKanban,
    category: 'operations',
    href: '/dashboard/projects',
    defaultPinned: true,
  },
  {
    key: 'timesheet',
    name: 'Zaman Çizelgesi',
    description: 'Harcanan zaman takibi',
    icon: Clock,
    category: 'operations',
    href: '/dashboard/timesheet',
    defaultPinned: false,
  },

  // ============================================================================
  // MARKETING MODULES
  // ============================================================================
  {
    key: 'lists',
    name: 'Listeler',
    description: 'Pazarlama segmentleri',
    icon: List,
    category: 'marketing',
    href: '/dashboard/lists',
    defaultPinned: false,
  },
  {
    key: 'campaigns',
    name: 'Kampanyalar',
    description: 'E-posta ve SMS kampanyaları',
    icon: Mail,
    category: 'marketing',
    href: '/dashboard/campaigns',
    defaultPinned: false,
  },

  // ============================================================================
  // FINANCE MODULES
  // ============================================================================
  {
    key: 'invoices',
    name: 'Faturalar',
    description: 'Ödeme takibi ve e-Fatura',
    icon: FileText,
    category: 'finance',
    href: '/dashboard/invoices',
    defaultPinned: false,
  },
  {
    key: 'subscriptions',
    name: 'Abonelikler',
    description: 'Yinelenen gelir yönetimi',
    icon: CreditCard,
    category: 'finance',
    href: '/dashboard/subscriptions',
    defaultPinned: false,
  },
  {
    key: 'expenses',
    name: 'Harcamalar',
    description: 'Masraf yönetimi',
    icon: DollarSign,
    category: 'finance',
    href: '/dashboard/expenses',
    defaultPinned: false,
  },
  {
    key: 'products',
    name: 'Ürünler & Hizmetler',
    description: 'Fiyat kataloğu',
    icon: Package,
    category: 'finance',
    href: '/dashboard/products',
    defaultPinned: false,
  },

  // ============================================================================
  // SUPPORT MODULES
  // ============================================================================
  {
    key: 'tickets',
    name: 'Destek Talepleri',
    description: 'Ticket sistemi',
    icon: MessageSquare,
    category: 'support',
    href: '/dashboard/tickets',
    defaultPinned: false,
  },
  {
    key: 'knowledge',
    name: 'Bilgi Bankası',
    description: 'Yardım makaleleri',
    icon: BookOpen,
    category: 'support',
    href: '/dashboard/knowledge',
    defaultPinned: false,
  },

  // ============================================================================
  // COMPANY MODULES
  // ============================================================================
  {
    key: 'inbox',
    name: 'Birleşik Gelen Kutusu',
    description: 'Ortak e-postalar',
    icon: Inbox,
    category: 'company',
    href: '/dashboard/inbox',
    defaultPinned: false,
  },
  {
    key: 'files',
    name: 'Dosya Kütüphanesi',
    description: 'Varlık yönetimi',
    icon: FolderTree,
    category: 'company',
    href: '/dashboard/files',
    defaultPinned: false,
  },
  {
    key: 'reports',
    name: 'Raporlar',
    description: 'Detaylı analiz ve raporlama',
    icon: BarChart3,
    category: 'company',
    href: '/dashboard/reports',
    defaultPinned: false,
  },
  {
    key: 'automations',
    name: 'Otomasyonlar',
    description: 'İş akışları',
    icon: Workflow,
    category: 'company',
    href: '/dashboard/automations',
    defaultPinned: false,
  },
  {
    key: 'team',
    name: 'Takım',
    description: 'Kullanıcı yönetimi',
    icon: UserCircle,
    category: 'company',
    href: '/dashboard/team',
    defaultPinned: false,
    requiredRole: 'admin',
  },
];

// Helper functions
export function getModuleByKey(key: string): CRMModule | undefined {
  return CRM_MODULES.find((module) => module.key === key);
}

export function getModulesByCategory(category: ModuleCategory): CRMModule[] {
  return CRM_MODULES.filter((module) => module.category === category);
}

export function getDefaultPinnedModules(): CRMModule[] {
  return CRM_MODULES.filter((module) => module.defaultPinned);
}

export function getAllCategories(): ModuleCategory[] {
  return Object.keys(MODULE_CATEGORIES) as ModuleCategory[];
}

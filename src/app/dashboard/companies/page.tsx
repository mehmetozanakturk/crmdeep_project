'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  Plus,
  Search,
  Globe,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import { AddCompanyModal } from '@/components/companies/AddCompanyModal';
import { EditCompanyModal } from '@/components/companies/EditCompanyModal';
import { CompanyDetailModal } from '@/components/companies/CompanyDetailModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';

// Simplified Company interface to match database schema
interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  start_date: string;
  end_date?: string;
  budget?: string;
  progress: number;
}

export interface Company {
  id: string;
  organization_id: string;
  name: string;
  logo: string | null;
  industry: string | null;
  size: string | null;
  revenue: string | null;
  location: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  contacts: number;
  deals: number;
  status: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  projects?: Project[];
  agreement_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  relatedTasks?: string[];
  relatedNotes?: string[];
  relatedEvents?: string[];
  last_activity_date?: string;
  total_revenue?: string;
  description?: string;
}

const DEMO_COMPANIES_REMOVED = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    logo: '',
    industry: 'Teknoloji',
    size: '100-500',
    revenue: '₺5M - ₺10M',
    location: 'İstanbul, Türkiye',
    website: 'techcorp.com',
    email: 'hello@techcorp.com',
    phone: '+90 212 100 0000',
    contacts: 8,
    deals: 3,
    status: 'active',
    tags: ['Kurumsal', 'Öncelikli'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    projects: [
      {
        id: 'p1',
        title: 'CRM Sistemi Geliştirme',
        description: 'Özel CRM yazılımı geliştirme projesi',
        status: 'in_progress',
        start_date: '2024-01-15',
        end_date: '2024-06-30',
        budget: '₺500,000',
        progress: 65,
      },
      {
        id: 'p2',
        title: 'Mobil Uygulama',
        description: 'iOS ve Android mobil uygulama',
        status: 'planned',
        start_date: '2024-03-01',
        budget: '₺250,000',
        progress: 0,
      },
    ],
    agreement_date: '2023-12-10',
    priority: 'high',
    relatedTasks: [],
    relatedNotes: [],
    relatedEvents: [],
    last_activity_date: new Date().toISOString(),
    total_revenue: '₺750,000',
    description: 'Kurumsal yazılım çözümleri konusunda uzmanlaşmış teknoloji şirketi',
  },
  {
    id: '2',
    name: 'Digital Marketing Co',
    logo: '',
    industry: 'Pazarlama',
    size: '50-100',
    revenue: '₺2M - ₺5M',
    location: 'Ankara, Türkiye',
    website: 'digitalmarketing.com',
    email: 'info@digitalmarketing.com',
    phone: '+90 312 200 0000',
    contacts: 5,
    deals: 2,
    status: 'active',
    tags: ['Müşteri'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    projects: [
      {
        id: 'p3',
        title: 'Sosyal Medya Kampanyası',
        description: '6 aylık sosyal medya yönetimi',
        status: 'in_progress',
        start_date: '2024-02-01',
        end_date: '2024-07-31',
        budget: '₺150,000',
        progress: 40,
      },
    ],
    agreement_date: '2024-01-15',
    priority: 'medium',
    relatedTasks: [],
    relatedNotes: [],
    relatedEvents: [],
    last_activity_date: new Date().toISOString(),
    total_revenue: '₺150,000',
    description: 'Dijital pazarlama ve sosyal medya yönetimi',
  },
  {
    id: '3',
    name: 'E-commerce Plus',
    logo: '',
    industry: 'E-ticaret',
    size: '200-500',
    revenue: '₺10M+',
    location: 'İzmir, Türkiye',
    website: 'ecommerceplus.com',
    email: 'contact@ecommerceplus.com',
    phone: '+90 232 300 0000',
    contacts: 12,
    deals: 5,
    status: 'active',
    tags: ['Kurumsal', 'VIP'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    projects: [
      {
        id: 'p4',
        title: 'E-ticaret Platform Yenileme',
        description: 'Mevcut platformun baştan geliştirilmesi',
        status: 'completed',
        start_date: '2023-09-01',
        end_date: '2024-01-31',
        budget: '₺1,200,000',
        progress: 100,
      },
      {
        id: 'p5',
        title: 'Mobil Uygulama v2.0',
        description: 'Mobil uygulamanın ikinci versiyonu',
        status: 'in_progress',
        start_date: '2024-02-15',
        budget: '₺600,000',
        progress: 55,
      },
    ],
    agreement_date: '2023-08-20',
    priority: 'critical',
    relatedTasks: [],
    relatedNotes: [],
    relatedEvents: [],
    last_activity_date: new Date().toISOString(),
    total_revenue: '₺1,800,000',
    description: 'Lider e-ticaret platformu ve çözümleri',
  },
  {
    id: '4',
    name: 'StartUp Ventures',
    logo: '',
    industry: 'Finans',
    size: '10-50',
    revenue: '₺500K - ₺1M',
    location: 'Bursa, Türkiye',
    website: 'startup.io',
    email: 'hello@startup.io',
    phone: '+90 224 400 0000',
    contacts: 3,
    deals: 1,
    status: 'prospect',
    tags: ['Potansiyel'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    projects: [],
    agreement_date: undefined,
    priority: 'low',
    relatedTasks: [],
    relatedNotes: [],
    relatedEvents: [],
    last_activity_date: undefined,
    total_revenue: undefined,
    description: 'Yeni nesil fintech startup',
  },
  {
    id: '5',
    name: 'Creative Agency',
    logo: '',
    industry: 'Tasarım',
    size: '20-50',
    revenue: '₺1M - ₺2M',
    location: 'Antalya, Türkiye',
    website: 'creativeagency.com',
    email: 'hi@creativeagency.com',
    phone: '+90 242 500 0000',
    contacts: 6,
    deals: 2,
    status: 'active',
    tags: ['Müşteri', 'Kreatif'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    projects: [
      {
        id: 'p6',
        title: 'Marka Kimliği Tasarımı',
        description: 'Kurumsal kimlik ve marka rehberi',
        status: 'on_hold',
        start_date: '2024-01-10',
        budget: '₺80,000',
        progress: 25,
      },
    ],
    agreement_date: '2023-11-05',
    priority: 'medium',
    relatedTasks: [],
    relatedNotes: [],
    relatedEvents: [],
    last_activity_date: '2024-01-25',
    total_revenue: '₺80,000',
    description: 'Kreatif tasarım ve branding ajansı',
  },
];

export default function CompaniesPage() {
  const { currentOrganization, isLoading: orgLoading } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  const loadCompanies = useCallback(async () => {
    if (!currentOrganization) return;

    try {
      setIsLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading companies:', error);
        return;
      }

      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentOrganization]);

  // Load companies from Supabase
  useEffect(() => {
    if (currentOrganization) {
      loadCompanies();
    }
  }, [currentOrganization, loadCompanies]);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (company.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCompanyAdded = async (newCompany: Company) => {
    if (!currentOrganization) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('companies')
        .insert({
          organization_id: currentOrganization.id,
          name: newCompany.name,
          logo: newCompany.logo,
          industry: newCompany.industry,
          size: newCompany.size,
          revenue: newCompany.revenue,
          location: newCompany.location,
          website: newCompany.website,
          email: newCompany.email,
          phone: newCompany.phone,
          contacts: newCompany.contacts,
          deals: newCompany.deals,
          status: newCompany.status,
          tags: newCompany.tags,
        });

      if (error) {
        console.error('Error creating company:', error);
        alert('Firma oluşturulurken hata oluştu');
        return;
      }

      await loadCompanies();
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Firma oluşturulurken hata oluştu');
    }
  };

  const handleCompanyUpdated = async (updatedCompany: Company) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('companies')
        .update({
          name: updatedCompany.name,
          logo: updatedCompany.logo,
          industry: updatedCompany.industry,
          size: updatedCompany.size,
          revenue: updatedCompany.revenue,
          location: updatedCompany.location,
          website: updatedCompany.website,
          email: updatedCompany.email,
          phone: updatedCompany.phone,
          contacts: updatedCompany.contacts,
          deals: updatedCompany.deals,
          status: updatedCompany.status,
          tags: updatedCompany.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedCompany.id);

      if (error) {
        console.error('Error updating company:', error);
        alert('Firma güncellenirken hata oluştu');
        return;
      }

      await loadCompanies();
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Firma güncellenirken hata oluştu');
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm('Bu firmayı silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) {
        console.error('Error deleting company:', error);
        alert('Firma silinirken hata oluştu');
        return;
      }

      await loadCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Firma silinirken hata oluştu');
    }
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const activeCount = companies.filter(c => c.status === 'active').length;
  const prospectCount = companies.filter(c => c.status === 'prospect').length;
  const totalContacts = companies.reduce((sum, c) => sum + c.contacts, 0);
  const totalDeals = companies.reduce((sum, c) => sum + c.deals, 0);

  const stats = [
    { label: 'Toplam Firma', value: companies.length, icon: Building2, color: 'text-primary-600 dark:text-primary-400' },
    { label: 'Aktif', value: activeCount, icon: TrendingUp, color: 'text-success-600 dark:text-success-400' },
    { label: 'Potansiyel', value: prospectCount, icon: Users, color: 'text-warning-600 dark:text-warning-400' },
    { label: 'Toplam Fırsat', value: totalDeals, icon: DollarSign, color: 'text-purple-600 dark:text-purple-400' },
  ];

  const statusOptions = [
    { label: 'Tümü', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Potansiyel', value: 'prospect' },
    { label: 'Pasif', value: 'inactive' },
  ];

  // Show loading state
  if (orgLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600 dark:text-primary-400" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Firmalar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Organizasyon bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Firmalar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Müşteriler ve şirketleri yönetin</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Yeni Firma
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stat.value}</p>
                  </div>
                  <div className={`rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card className="border-neutral-200 dark:border-neutral-700">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <Input
                placeholder="Firma, sektör veya lokasyon ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter === 'all' ? 'Tüm Durumlar' : statusOptions.find(o => o.value === statusFilter)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                    {statusFilter === option.value && ' ✓'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {(searchQuery || statusFilter !== 'all') && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {companies.length === 0 ? 'Henüz firma yok' : 'Firma bulunamadı'}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {companies.length === 0
                ? 'İlk firmanızı eklemek için yukarıdaki "Yeni Firma" butonuna tıklayın'
                : 'Arama kriterlerinize uygun firma yok. Farklı bir arama deneyin.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="overflow-hidden transition-all hover:shadow-lg border-neutral-200 dark:border-neutral-700 cursor-pointer hover:scale-[1.02]"
              onClick={() => handleViewCompany(company)}
            >
              <CardHeader className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-800/50 pb-4">
                <div className="flex items-start justify-between">
                  <Avatar className="h-16 w-16 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary-100 dark:bg-primary-900/30 text-xl font-bold text-primary-600 dark:text-primary-400">
                      {company.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteCompany(company.id)}
                        className="text-danger-600 dark:text-danger-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-3">
                  <CardTitle className="text-xl text-neutral-900 dark:text-neutral-100">{company.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="secondary">{company.industry}</Badge>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Users className="h-4 w-4" />
                    {company.size} çalışan
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <DollarSign className="h-4 w-4" />
                    Gelir: {company.revenue}
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Globe className="h-4 w-4" />
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>

                <div className="flex gap-1 pt-2 flex-wrap">
                  {company.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-neutral-200 dark:border-neutral-700 pt-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{company.contacts}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Kişiler</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{company.deals}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Fırsatlar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Company Modal */}
      <AddCompanyModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onCompanyAdded={handleCompanyAdded}
      />

      {/* Detail Company Modal */}
      {selectedCompany && (
        <CompanyDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          company={selectedCompany}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
        />
      )}

      {/* Edit Company Modal */}
      {selectedCompany && (
        <EditCompanyModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          company={selectedCompany}
          onCompanyUpdated={handleCompanyUpdated}
        />
      )}
    </div>
  );
}

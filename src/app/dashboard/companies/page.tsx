'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Building2,
  Plus,
  Search,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Filter,
  MoreVertical,
} from 'lucide-react';

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Load from Supabase
  const companies = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      logo: '',
      industry: 'Technology',
      size: '100-500',
      revenue: '$5M - $10M',
      location: 'San Francisco, CA',
      website: 'techcorp.com',
      email: 'hello@techcorp.com',
      phone: '+1 (555) 100-0000',
      contacts: 8,
      deals: 3,
      status: 'active',
      tags: ['Enterprise', 'Priority'],
    },
    {
      id: '2',
      name: 'Digital Marketing Co',
      logo: '',
      industry: 'Marketing',
      size: '50-100',
      revenue: '$2M - $5M',
      location: 'New York, NY',
      website: 'digitalmarketing.com',
      email: 'info@digitalmarketing.com',
      phone: '+1 (555) 200-0000',
      contacts: 5,
      deals: 2,
      status: 'active',
      tags: ['Client'],
    },
    {
      id: '3',
      name: 'E-commerce Plus',
      logo: '',
      industry: 'E-commerce',
      size: '200-500',
      revenue: '$10M+',
      location: 'Los Angeles, CA',
      website: 'ecommerceplus.com',
      email: 'contact@ecommerceplus.com',
      phone: '+1 (555) 300-0000',
      contacts: 12,
      deals: 5,
      status: 'active',
      tags: ['Enterprise', 'VIP'],
    },
    {
      id: '4',
      name: 'StartUp Ventures',
      logo: '',
      industry: 'Finance',
      size: '10-50',
      revenue: '$500K - $1M',
      location: 'Austin, TX',
      website: 'startup.io',
      email: 'hello@startup.io',
      phone: '+1 (555) 400-0000',
      contacts: 3,
      deals: 1,
      status: 'prospect',
      tags: ['Prospect'],
    },
    {
      id: '5',
      name: 'Creative Agency',
      logo: '',
      industry: 'Design',
      size: '20-50',
      revenue: '$1M - $2M',
      location: 'Portland, OR',
      website: 'creativeagency.com',
      email: 'hi@creativeagency.com',
      phone: '+1 (555) 500-0000',
      contacts: 6,
      deals: 2,
      status: 'active',
      tags: ['Client', 'Creative'],
    },
  ];

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Toplam Firma', value: companies.length, icon: Building2, color: 'text-primary-600 dark:text-primary-400' },
    { label: 'Aktif', value: 4, icon: TrendingUp, color: 'text-success-600 dark:text-success-400' },
    { label: 'Prospect', value: 1, icon: Users, color: 'text-warning-600 dark:text-warning-400' },
    { label: 'Toplam Gelir', value: '$28M+', icon: DollarSign, color: 'text-purple-600 dark:text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Firmalar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Müşteriler ve şirketleri yönetin</p>
        </div>
        <Button className="flex items-center gap-2">
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
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrele
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="overflow-hidden transition-shadow hover:shadow-lg border-neutral-200 dark:border-neutral-700">
            <CardHeader className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-800/50 pb-4">
              <div className="flex items-start justify-between">
                <Avatar className="h-16 w-16 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary-100 dark:bg-primary-900/30 text-xl font-bold text-primary-600 dark:text-primary-400">
                    {company.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
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
                  {company.size} employees
                </div>
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <DollarSign className="h-4 w-4" />
                  Revenue: {company.revenue}
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

              <div className="flex gap-1 pt-2">
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

              <Button className="w-full" variant="outline">
                Detayları Gör
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Firma bulunamadı</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Arama kriterlerinize uygun firma yok. Farklı bir arama deneyin.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

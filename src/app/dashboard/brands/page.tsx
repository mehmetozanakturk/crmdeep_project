'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Briefcase, Search, TrendingUp, Users, Palette, MoreVertical } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  logo?: string;
  status: 'active' | 'paused' | 'archived';
  primaryColor: string;
  projectCount: number;
  campaignCount: number;
  teamSize: number;
  revenue: string;
  description: string;
}

const DEMO_BRANDS: Brand[] = [
  {
    id: '1',
    name: 'TechCorp',
    status: 'active',
    primaryColor: '#3B82F6',
    projectCount: 12,
    campaignCount: 8,
    teamSize: 5,
    revenue: '₺250K',
    description: 'Teknoloji ve yazılım çözümleri',
  },
  {
    id: '2',
    name: 'GreenLife',
    status: 'active',
    primaryColor: '#10B981',
    projectCount: 8,
    campaignCount: 15,
    teamSize: 3,
    revenue: '₺180K',
    description: 'Organik gıda ve sağlıklı yaşam',
  },
  {
    id: '3',
    name: 'BlueSky Airlines',
    status: 'active',
    primaryColor: '#0EA5E9',
    projectCount: 6,
    campaignCount: 4,
    teamSize: 8,
    revenue: '₺420K',
    description: 'Havayolu ve seyahat hizmetleri',
  },
  {
    id: '4',
    name: 'StyleHub',
    status: 'paused',
    primaryColor: '#EC4899',
    projectCount: 10,
    campaignCount: 12,
    teamSize: 4,
    revenue: '₺195K',
    description: 'Moda ve lifestyle markası',
  },
  {
    id: '5',
    name: 'AutoMax',
    status: 'active',
    primaryColor: '#EF4444',
    projectCount: 5,
    campaignCount: 3,
    teamSize: 6,
    revenue: '₺320K',
    description: 'Otomotiv satış ve servis',
  },
  {
    id: '6',
    name: 'EduPro',
    status: 'active',
    primaryColor: '#8B5CF6',
    projectCount: 9,
    campaignCount: 11,
    teamSize: 7,
    revenue: '₺275K',
    description: 'Eğitim teknolojileri platformu',
  },
  {
    id: '7',
    name: 'FoodDelight',
    status: 'paused',
    primaryColor: '#F59E0B',
    projectCount: 4,
    campaignCount: 6,
    teamSize: 2,
    revenue: '₺95K',
    description: 'Restoran ve catering hizmetleri',
  },
  {
    id: '8',
    name: 'HealthPlus',
    status: 'active',
    primaryColor: '#14B8A6',
    projectCount: 7,
    campaignCount: 9,
    teamSize: 5,
    revenue: '₺210K',
    description: 'Sağlık ve fitness merkezi',
  },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(DEMO_BRANDS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeBrands = brands.filter((b) => b.status === 'active').length;
  const totalRevenue = brands.reduce((sum, b) => {
    const value = parseInt(b.revenue.replace(/[^0-9]/g, ''));
    return sum + value;
  }, 0);

  const getStatusBadge = (status: Brand['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">Aktif</Badge>;
      case 'paused':
        return <Badge className="bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">Duraklatıldı</Badge>;
      case 'archived':
        return <Badge className="bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">Arşivlendi</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Markalar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Tüm markalarınızı tek yerden yönetin
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Marka
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Toplam Marka</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{brands.length}</p>
              </div>
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                <Briefcase className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Aktif Marka</p>
                <p className="mt-1 text-3xl font-bold text-success-600 dark:text-success-400">{activeBrands}</p>
              </div>
              <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-3">
                <TrendingUp className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Toplam Gelir</p>
                <p className="mt-1 text-3xl font-bold text-primary-600 dark:text-primary-400">₺{totalRevenue}K</p>
              </div>
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Toplam Ekip</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {brands.reduce((sum, b) => sum + b.teamSize, 0)}
                </p>
              </div>
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                <Users className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
          <Input
            type="text"
            placeholder="Marka ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBrands.map((brand) => (
          <Card
            key={brand.id}
            className="border-neutral-200 dark:border-neutral-700 transition-all hover:shadow-md dark:hover:border-neutral-600"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback
                      style={{ backgroundColor: brand.primaryColor + '20', color: brand.primaryColor }}
                    >
                      {getInitials(brand.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-neutral-900 dark:text-neutral-100">
                      {brand.name}
                    </CardTitle>
                    <CardDescription className="text-neutral-600 dark:text-neutral-400">
                      {brand.description}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                {getStatusBadge(brand.status)}
                <div className="flex items-center gap-1">
                  <Palette className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  <div
                    className="h-4 w-4 rounded-full border border-neutral-200 dark:border-neutral-700"
                    style={{ backgroundColor: brand.primaryColor }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Projeler</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {brand.projectCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Kampanyalar</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {brand.campaignCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Ekip</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {brand.teamSize} kişi
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Gelir</p>
                  <p className="mt-1 text-lg font-semibold text-success-600 dark:text-success-400">
                    {brand.revenue}
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Detayları Görüntüle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center">
            <Search className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Marka bulunamadı
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              &quot;{searchQuery}&quot; için sonuç bulunamadı
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

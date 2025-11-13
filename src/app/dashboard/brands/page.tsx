'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Briefcase, Search, TrendingUp, Users, Palette, MoreVertical, Trash2, Edit } from 'lucide-react';
import { AddBrandModal } from '@/components/brands/AddBrandModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Brand {
  id: string;
  organization_id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  primary_color: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export default function BrandsPage() {
  const { currentOrganization } = useOrganization();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBrands = useCallback(async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  }, [currentOrganization]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu markayı silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('brands').delete().eq('id', id);

      if (error) throw error;
      loadBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Marka silinirken hata oluştu');
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBrands = brands.length;

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
        <Button onClick={() => setAddModalOpen(true)}>
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
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{totalBrands}</p>
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
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Bu Ay Eklenen</p>
                <p className="mt-1 text-3xl font-bold text-success-600 dark:text-success-400">
                  {brands.filter(b => {
                    const brandDate = new Date(b.created_at);
                    const now = new Date();
                    return brandDate.getMonth() === now.getMonth() && brandDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
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
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Web Sitesi Olan</p>
                <p className="mt-1 text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {brands.filter(b => b.website_url).length}
                </p>
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
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Logo Olan</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {brands.filter(b => b.logo_url).length}
                </p>
              </div>
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                <Palette className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
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

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Markalar yükleniyor...</p>
          </div>
        </div>
      ) : filteredBrands.length === 0 ? (
        /* Empty State */
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {searchQuery ? 'Marka bulunamadı' : 'Henüz marka yok'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery
                ? `"${searchQuery}" için sonuç bulunamadı`
                : 'Yeni marka eklemek için yukarıdaki butonu kullanın'}
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Brands Grid */
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
                        style={{ backgroundColor: brand.primary_color + '20', color: brand.primary_color }}
                      >
                        {getInitials(brand.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg text-neutral-900 dark:text-neutral-100">
                        {brand.name}
                      </CardTitle>
                      {brand.website_url && (
                        <CardDescription className="text-neutral-600 dark:text-neutral-400">
                          {brand.website_url}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(brand.id)} className="text-danger-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    <div
                      className="h-4 w-4 rounded-full border border-neutral-200 dark:border-neutral-700"
                      style={{ backgroundColor: brand.primary_color }}
                    />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {brand.primary_color}
                    </span>
                  </div>
                </div>

                {brand.description && (
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {brand.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Oluşturulma</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {new Date(brand.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  {brand.website_url && (
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Website</p>
                      <a
                        href={brand.website_url.startsWith('http') ? brand.website_url : `https://${brand.website_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Ziyaret Et
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddBrandModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onBrandAdded={loadBrands}
      />
    </div>
  );
}

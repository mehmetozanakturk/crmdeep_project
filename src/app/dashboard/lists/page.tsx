'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, List, Users, Mail, Trash2, Edit, MoreVertical, TrendingUp } from 'lucide-react';
import { AddContactListModal } from '@/components/lists/AddContactListModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useBrands } from '@/lib/hooks/useBrands';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ContactList {
  id: string;
  organization_id: string;
  brand_id: string | null;
  name: string;
  description: string | null;
  contact_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function ListsPage() {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [lists, setLists] = useState<ContactList[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, [currentOrganization, currentBrand]);

  const loadLists = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('contact_lists')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (currentBrand) {
        query = query.eq('brand_id', currentBrand.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLists(data || []);
    } catch (error) {
      console.error('Error loading contact lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu listeyi silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('contact_lists').delete().eq('id', id);

      if (error) throw error;
      loadLists();
    } catch (error) {
      console.error('Error deleting contact list:', error);
      alert('Liste silinirken hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR');
    }
  };

  // Calculate stats
  const totalLists = lists.length;
  const totalContacts = lists.reduce((sum, list) => sum + (list.contact_count || 0), 0);
  const avgContactsPerList = totalLists > 0 ? Math.round(totalContacts / totalLists) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Listeler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Pazarlama segmentleri ve kişi listeleri</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Yeni Liste</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Liste</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalLists}</p>
              </div>
              <List className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Kişi</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{totalContacts}</p>
              </div>
              <Users className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Ortalama / Liste</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">{avgContactsPerList}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Listeler yükleniyor...</p>
          </div>
        </div>
      ) : lists.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <List className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Henüz liste yok</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Yeni kişi listesi eklemek için yukarıdaki butonu kullanın</p>
            <Button onClick={() => setAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" />İlk Listeni Oluştur</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {lists.map((list) => (
            <Card key={list.id} className="border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3 flex-shrink-0">
                      <List className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{list.name}</h3>
                      {list.description && (
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{list.description}</p>
                      )}
                      <p className="mt-1 text-xs text-neutral-500">Son güncelleme: {formatDate(list.updated_at)}</p>
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {list.contact_count || 0} kişi
                        </Badge>
                        {list.tags && list.tags.length > 0 && (
                          list.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))
                        )}
                        {list.tags && list.tags.length > 2 && (
                          <Badge variant="outline">+{list.tags.length - 2}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm"><Mail className="mr-1 h-3 w-3" />Gönder</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Düzenle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(list.id)} className="text-danger-600">
                          <Trash2 className="mr-2 h-4 w-4" />Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddContactListModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onListAdded={loadLists}
      />
    </div>
  );
}

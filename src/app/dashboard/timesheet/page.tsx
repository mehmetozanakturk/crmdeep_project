'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Plus, Trash2, CalendarClock } from 'lucide-react';
import { AddTimesheetModal } from '@/components/timesheet/AddTimesheetModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useBrands } from '@/lib/hooks/useBrands';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface TimesheetEntry {
  id: string;
  date: string;
  hours: number;
  task_name: string;
  description?: string;
  project_name?: string;
  created_at: string;
}

export default function TimesheetPage() {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [currentOrganization, currentBrand]);

  const loadEntries = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('timesheet_entries')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('date', { ascending: false });

      if (currentBrand) {
        query = query.eq('brand_id', currentBrand.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading timesheet entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu zaman kaydını silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('timesheet_entries').delete().eq('id', id);

      if (error) throw error;
      loadEntries();
    } catch (error) {
      console.error('Error deleting timesheet entry:', error);
      alert('Zaman kaydı silinirken hata oluştu');
    }
  };

  // Calculate stats
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Get start of week (Monday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  const weekStart = startOfWeek.toISOString().split('T')[0];

  // Get start of month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const todayHours = entries.filter(e => e.date === today).reduce((sum, entry) => sum + entry.hours, 0);
  const weekHours = entries.filter(e => e.date >= weekStart).reduce((sum, entry) => sum + entry.hours, 0);
  const monthHours = entries.filter(e => e.date >= monthStart).reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Zaman Çizelgesi</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Harcanan zaman takibi</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Yeni Kayıt</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bugün</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{todayHours.toFixed(1)} saat</p>
              </div>
              <CalendarClock className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bu Hafta</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{weekHours.toFixed(1)} saat</p>
              </div>
              <Clock className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bu Ay</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{monthHours.toFixed(1)} saat</p>
              </div>
              <Calendar className="h-8 w-8 text-warning-600 dark:text-warning-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam</p>
                <p className="mt-1 text-3xl font-bold text-success-600 dark:text-success-400">{totalHours.toFixed(1)} saat</p>
              </div>
              <Clock className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Zaman kayıtları yükleniyor...</p>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Henüz zaman kaydı yok</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Yeni zaman kaydı eklemek için yukarıdaki butonu kullanın</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{entry.task_name}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{entry.project_name || 'Proje belirtilmemiş'}</p>
                    {entry.description && (
                      <p className="text-xs text-neutral-500 mt-1">{entry.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-500">{new Date(entry.date).toLocaleDateString('tr-TR')}</span>
                    <Badge variant="secondary" className="min-w-[80px] justify-center">{entry.hours} saat</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(entry.id)} className="text-danger-600">
                          <Trash2 className="mr-2 h-4 w-4" />Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AddTimesheetModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onTimesheetAdded={loadEntries}
      />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard, TrendingUp, Users, DollarSign, Trash2, Edit, MoreVertical } from 'lucide-react';
import { AddSubscriptionModal } from '@/components/subscriptions/AddSubscriptionModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useBrands } from '@/lib/hooks/useBrands';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Subscription {
  id: string;
  service_name: string;
  client_name: string;
  amount: number;
  billing_cycle: string;
  status: string;
  start_date: string;
  next_billing_date?: string;
  plan_name?: string;
}

export default function SubscriptionsPage() {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, [currentOrganization, currentBrand]);

  const loadSubscriptions = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('subscriptions')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (currentBrand) {
        query = query.eq('brand_id', currentBrand.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu aboneliği silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('subscriptions').delete().eq('id', id);

      if (error) throw error;
      loadSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('Abonelik silinirken hata oluştu');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const getBillingCycleLabel = (cycle: string) => {
    switch (cycle) {
      case 'monthly': return 'Aylık';
      case 'quarterly': return '3 Aylık';
      case 'yearly': return 'Yıllık';
      default: return cycle;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'paused': return 'Duraklatıldı';
      case 'cancelled': return 'İptal Edildi';
      case 'expired': return 'Süresi Doldu';
      default: return status;
    }
  };

  // Calculate stats
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const monthlyRevenue = activeSubscriptions
    .filter(s => s.billing_cycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);
  const quarterlyRevenue = activeSubscriptions
    .filter(s => s.billing_cycle === 'quarterly')
    .reduce((sum, s) => sum + (s.amount / 3), 0);
  const yearlyRevenue = activeSubscriptions
    .filter(s => s.billing_cycle === 'yearly')
    .reduce((sum, s) => sum + (s.amount / 12), 0);
  const totalMonthlyRevenue = monthlyRevenue + quarterlyRevenue + yearlyRevenue;

  const totalActiveCount = activeSubscriptions.length;
  const pausedCount = subscriptions.filter(s => s.status === 'paused').length;
  const cancelledCount = subscriptions.filter(s => s.status === 'cancelled').length;

  // Calculate churn rate (cancelled / total)
  const churnRate = subscriptions.length > 0
    ? ((cancelledCount / subscriptions.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Abonelikler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Yinelenen gelir yönetimi</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Yeni Abonelik</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Aylık Gelir</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(totalMonthlyRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Aktif</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{totalActiveCount}</p>
              </div>
              <Users className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Duraklatıldı</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">{pausedCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Churn Rate</p>
                <p className="mt-1 text-2xl font-bold text-danger-600 dark:text-danger-400">{churnRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-danger-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Abonelikler yükleniyor...</p>
          </div>
        </div>
      ) : subscriptions.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Henüz abonelik yok</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Yeni abonelik eklemek için yukarıdaki butonu kullanın</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {subscription.service_name || subscription.plan_name || 'N/A'}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {subscription.client_name || 'Müşteri belirtilmemiş'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {formatCurrency(subscription.amount)}
                      </p>
                      <p className="text-xs text-neutral-500">{getBillingCycleLabel(subscription.billing_cycle)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        subscription.status === 'active'
                          ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400 mb-1'
                          : subscription.status === 'paused'
                          ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400 mb-1'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 mb-1'
                      }>
                        {getStatusLabel(subscription.status)}
                      </Badge>
                      {subscription.next_billing_date && (
                        <p className="text-xs text-neutral-500">
                          Sonraki: {new Date(subscription.next_billing_date).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Düzenle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(subscription.id)} className="text-danger-600">
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

      <AddSubscriptionModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubscriptionAdded={loadSubscriptions}
      />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Receipt, TrendingDown, Calendar, CheckCircle2, Trash2, Edit } from 'lucide-react';
import { AddExpenseModal } from '@/components/expenses/AddExpenseModal';
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

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  status: string;
  expense_date: string;
  description?: string;
}

export default function ExpensesPage() {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, [currentOrganization, currentBrand]);

  const loadExpenses = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (currentBrand) {
        query = query.eq('brand_id', currentBrand.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu harcamayı silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('expenses').delete().eq('id', id);

      if (error) throw error;
      loadExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Harcama silinirken hata oluştu');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      office: 'Ofis',
      software: 'Yazılım',
      marketing: 'Pazarlama',
      meals: 'Yemek',
      travel: 'Seyahat',
      other: 'Diğer',
    };
    return categories[category] || category;
  };

  // Calculate stats
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.expense_date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const totalThisMonth = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingCount = expenses.filter(e => e.status === 'pending').length;
  const approvedAmount = expenses.filter(e => e.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Harcamalar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Masraf yönetimi ve onayları</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Harcama Ekle</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bu Ay</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{formatCurrency(totalThisMonth)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-danger-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Onay Bekliyor</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">{pendingCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Onaylandı</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{formatCurrency(approvedAmount)}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Harcamalar yükleniyor...</p>
          </div>
        </div>
      ) : expenses.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <Receipt className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Henüz harcama yok</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Yeni harcama eklemek için yukarıdaki butonu kullanın</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {expenses.map((expense) => (
            <Card key={expense.id} className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Receipt className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{expense.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Kategori: {getCategoryLabel(expense.category)}</p>
                      {expense.description && (
                        <p className="text-xs text-neutral-500 mt-1">{expense.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{formatCurrency(expense.amount)}</p>
                      <p className="text-xs text-neutral-500">{new Date(expense.expense_date).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <Badge className={
                      expense.status === 'approved' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' :
                      expense.status === 'pending' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' :
                      'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
                    }>
                      {expense.status === 'approved' ? 'Onaylandı' : expense.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Düzenle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(expense.id)} className="text-danger-600">
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

      <AddExpenseModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onExpenseAdded={loadExpenses}
      />
    </div>
  );
}

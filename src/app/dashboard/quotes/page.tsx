'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Download, DollarSign, CheckCircle2, Send, FilePlus, Trash2, Edit } from 'lucide-react';
import { AddQuoteModal } from '@/components/quotes/AddQuoteModal';
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

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  title: string;
  amount: number;
  status: string;
  valid_until?: string;
  notes?: string;
  created_at: string;
}

export default function QuotesPage() {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, [currentOrganization, currentBrand]);

  const loadQuotes = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('quotes')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (currentBrand) {
        query = query.eq('brand_id', currentBrand.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu teklifi silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('quotes').delete().eq('id', id);

      if (error) throw error;
      loadQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Teklif silinirken hata oluştu');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const totalAmount = quotes.reduce((sum, quote) => sum + quote.amount, 0);
  const acceptedAmount = quotes.filter(q => q.status === 'accepted').reduce((sum, quote) => sum + quote.amount, 0);
  const sentAmount = quotes.filter(q => q.status === 'sent').reduce((sum, quote) => sum + quote.amount, 0);
  const draftAmount = quotes.filter(q => q.status === 'draft').reduce((sum, quote) => sum + quote.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Teklifler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Fiyat teklifleri ve öneriler</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Yeni Teklif</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{formatCurrency(totalAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Kabul Edildi</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{formatCurrency(acceptedAmount)}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Gönderildi</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">{formatCurrency(sentAmount)}</p>
              </div>
              <Send className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Taslak</p>
                <p className="mt-1 text-2xl font-bold text-neutral-600 dark:text-neutral-400">{formatCurrency(draftAmount)}</p>
              </div>
              <FilePlus className="h-8 w-8 text-neutral-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Teklifler yükleniyor...</p>
          </div>
        </div>
      ) : quotes.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Henüz teklif yok</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Yeni teklif eklemek için yukarıdaki butonu kullanın</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quotes.map((quote) => (
            <Card key={quote.id} className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{quote.quote_number}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{quote.client_name}</p>
                      {quote.title && <p className="text-xs text-neutral-500 dark:text-neutral-500">{quote.title}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{formatCurrency(quote.amount)}</p>
                      {quote.valid_until && (
                        <p className="text-xs text-neutral-500">Geçerlilik: {new Date(quote.valid_until).toLocaleDateString('tr-TR')}</p>
                      )}
                    </div>
                    <Badge className={
                      quote.status === 'accepted' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' :
                      quote.status === 'sent' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' :
                      quote.status === 'rejected' ? 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400' :
                      'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                    }>
                      {quote.status === 'accepted' ? 'Kabul Edildi' :
                       quote.status === 'sent' ? 'Gönderildi' :
                       quote.status === 'rejected' ? 'Reddedildi' : 'Taslak'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Download className="mr-2 h-4 w-4" />İndir</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Düzenle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(quote.id)} className="text-danger-600">
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

      <AddQuoteModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onQuoteAdded={loadQuotes}
      />
    </div>
  );
}

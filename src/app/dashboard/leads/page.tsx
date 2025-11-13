'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, Mail, Phone, Building2, TrendingUp, Users, Target, MoreVertical, Trash2, Edit } from 'lucide-react';
import { AddLeadModal } from '@/components/leads/AddLeadModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useBrands } from '@/lib/hooks/useBrands';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  estimated_value?: number;
  value?: string;
  created_at?: string;
}

export default function LeadsPage() {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, [currentOrganization, currentBrand]);

  const loadLeads = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('leads')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (currentBrand) {
        query = query.eq('brand_id', currentBrand.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu lead\'i silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('leads').delete().eq('id', id);

      if (error) throw error;
      loadLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Lead silinirken hata oluştu');
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">Yeni</Badge>;
      case 'contacted':
        return <Badge className="bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">İletişimde</Badge>;
      case 'qualified':
        return <Badge className="bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">Nitelikli</Badge>;
      case 'unqualified':
        return <Badge className="bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">Niteliksiz</Badge>;
      case 'converted':
        return <Badge className="bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">Dönüştürüldü</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600 dark:text-success-400';
    if (score >= 60) return 'text-warning-600 dark:text-warning-400';
    return 'text-danger-600 dark:text-danger-400';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  // Calculate stats
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const totalValue = leads.reduce((sum, lead) => {
    // Handle both estimated_value (number) and value (string like "₺45K")
    if (lead.estimated_value) {
      return sum + lead.estimated_value;
    }
    return sum;
  }, 0);
  const averageScore = leads.length > 0
    ? Math.round(leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / leads.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Potansiyel Müşteriler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Lead yönetimi ve takibi</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Lead
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Lead</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{totalLeads}</p>
              </div>
              <Target className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Nitelikli</p>
                <p className="mt-1 text-3xl font-bold text-success-600 dark:text-success-400">
                  {qualifiedLeads}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">İletişimde</p>
                <p className="mt-1 text-3xl font-bold text-warning-600 dark:text-warning-400">
                  {contactedLeads}
                </p>
              </div>
              <Users className="h-8 w-8 text-warning-600 dark:text-warning-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Potansiyel Değer</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {totalValue > 0 ? formatCurrency(totalValue) : '₺0'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <Input
          type="text"
          placeholder="Lead ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Leadler yükleniyor...</p>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {searchQuery ? 'Lead bulunamadı' : 'Henüz lead yok'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery ? 'Arama kriterlerinizi değiştirmeyi deneyin' : 'Yeni lead eklemek için yukarıdaki butonu kullanın'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                        {lead.name?.split(' ').map((n) => n[0]).join('') || 'L'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{lead.name}</h3>
                        {lead.company && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {lead.company}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm">
                        {lead.email && (
                          <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(lead.status)}
                        {lead.source && <Badge variant="outline">Kaynak: {lead.source}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Lead Skoru</p>
                        <p className={`text-2xl font-bold ${getScoreColor(lead.score || 0)}`}>{lead.score || 0}</p>
                      </div>
                      {lead.estimated_value && (
                        <div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">Potansiyel Değer</p>
                          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            {formatCurrency(lead.estimated_value)}
                          </p>
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="text-danger-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Sil
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

      <AddLeadModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onLeadAdded={loadLeads}
      />
    </div>
  );
}

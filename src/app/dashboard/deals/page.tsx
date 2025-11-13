'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TrendingUp,
  Plus,
  DollarSign,
  Target,
  Clock,
  MoreVertical,
  Building2,
  User,
  Pencil,
  Trash2,
  MoveRight,
  Loader2,
} from 'lucide-react';
import { AddDealModal } from '@/components/deals/AddDealModal';
import { EditDealModal } from '@/components/deals/EditDealModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';

type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  organization_id: string;
  title: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number;
  assignee: string;
  assignee_avatar?: string;
  days_in_stage: number;
  contact_person: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function DealsPage() {
  const { currentOrganization, isLoading: orgLoading } = useOrganization();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Load deals from Supabase
  useEffect(() => {
    if (currentOrganization) {
      loadDeals();
    }
  }, [currentOrganization]);

  const loadDeals = async () => {
    if (!currentOrganization) return;

    try {
      setIsLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading deals:', error);
        return;
      }

      setDeals(data || []);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stages: { key: DealStage; label: string; color: string }[] = [
    { key: 'lead', label: 'Lead', color: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200' },
    { key: 'qualified', label: 'Nitelikli', color: 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200' },
    { key: 'proposal', label: 'Teklif', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' },
    { key: 'negotiation', label: 'Görüşme', color: 'bg-warning-100 text-warning-800 dark:bg-warning-900/40 dark:text-warning-200' },
    { key: 'closed_won', label: 'Kazanıldı', color: 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-200' },
    { key: 'closed_lost', label: 'Kaybedildi', color: 'bg-danger-100 text-danger-800 dark:bg-danger-900/40 dark:text-danger-200' },
  ];

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getStageTotal = (stage: DealStage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleDealAdded = async (newDeal: Omit<Deal, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    if (!currentOrganization) return;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('deals')
        .insert({
          organization_id: currentOrganization.id,
          title: newDeal.title,
          company: newDeal.company,
          value: newDeal.value,
          stage: newDeal.stage,
          probability: newDeal.probability,
          assignee: newDeal.assignee,
          assignee_avatar: newDeal.assignee_avatar || '',
          days_in_stage: newDeal.days_in_stage,
          contact_person: newDeal.contact_person,
          tags: newDeal.tags,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating deal:', error);
        alert('Fırsat oluşturulurken hata oluştu');
        return;
      }

      await loadDeals();
    } catch (error) {
      console.error('Error creating deal:', error);
      alert('Fırsat oluşturulurken hata oluştu');
    }
  };

  const handleDealUpdated = async (updatedDeal: Deal) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('deals')
        .update({
          title: updatedDeal.title,
          company: updatedDeal.company,
          value: updatedDeal.value,
          stage: updatedDeal.stage,
          probability: updatedDeal.probability,
          assignee: updatedDeal.assignee,
          contact_person: updatedDeal.contact_person,
          tags: updatedDeal.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedDeal.id);

      if (error) {
        console.error('Error updating deal:', error);
        alert('Fırsat güncellenirken hata oluştu');
        return;
      }

      await loadDeals();
    } catch (error) {
      console.error('Error updating deal:', error);
      alert('Fırsat güncellenirken hata oluştu');
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Bu fırsatı silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

      if (error) {
        console.error('Error deleting deal:', error);
        alert('Fırsat silinirken hata oluştu');
        return;
      }

      await loadDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Fırsat silinirken hata oluştu');
    }
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsEditModalOpen(true);
  };

  const handleMoveStage = async (dealId: string, newStage: DealStage) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('deals')
        .update({
          stage: newStage,
          days_in_stage: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', dealId);

      if (error) {
        console.error('Error moving deal stage:', error);
        alert('Fırsat aşaması değiştirilirken hata oluştu');
        return;
      }

      await loadDeals();
    } catch (error) {
      console.error('Error moving deal stage:', error);
      alert('Fırsat aşaması değiştirilirken hata oluştu');
    }
  };

  const totalPipelineValue = deals
    .filter(d => d.stage !== 'closed_lost')
    .reduce((sum, deal) => sum + deal.value, 0);
  const averageDealSize = deals.length > 0 ? totalPipelineValue / deals.length : 0;
  const totalDeals = deals.filter(d => d.stage !== 'closed_lost' && d.stage !== 'closed_won').length;
  const wonDeals = deals.filter((d) => d.stage === 'closed_won').length;

  // Show loading state
  if (orgLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600 dark:text-primary-400" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Fırsatlar yükleniyor...</p>
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
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Satış Fırsatları</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Satış pipeline&apos;ınızı yönetin</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Yeni Fırsat
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Pipeline Değeri</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(totalPipelineValue)}
                </p>
              </div>
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3 text-primary-600 dark:text-primary-400">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Aktif Fırsat</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{totalDeals}</p>
              </div>
              <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-3 text-success-600 dark:text-success-400">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Ortalama Değer</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(averageDealSize)}
                </p>
              </div>
              <div className="rounded-lg bg-warning-100 dark:bg-warning-900/30 p-3 text-warning-600 dark:text-warning-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Kazanılan</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{wonDeals}</p>
              </div>
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3 text-purple-600 dark:text-purple-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.key);
            const stageTotal = getStageTotal(stage.key);

            return (
              <div key={stage.key} className="w-80 flex-shrink-0">
                <Card className="border-neutral-200 dark:border-neutral-700">
                  <CardHeader className={`${stage.color} rounded-t-lg border-b border-neutral-200 dark:border-neutral-700`}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{stage.label}</CardTitle>
                      <Badge variant="secondary">{stageDeals.length}</Badge>
                    </div>
                    <CardDescription className="font-semibold dark:text-current">
                      {formatCurrency(stageTotal)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4 bg-neutral-50 dark:bg-neutral-900/50 min-h-[200px]">
                    {stageDeals.map((deal) => (
                      <Card
                        key={deal.id}
                        className="cursor-pointer transition-shadow hover:shadow-md border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 pr-2">{deal.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditDeal(deal)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                    <MoveRight className="mr-2 h-4 w-4" />
                                    Aşamayı Değiştir
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent>
                                    {stages.filter(s => s.key !== deal.stage).map((s) => (
                                      <DropdownMenuItem
                                        key={s.key}
                                        onClick={() => handleMoveStage(deal.id, s.key)}
                                      >
                                        {s.label}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteDeal(deal.id)}
                                  className="text-danger-600 dark:text-danger-400"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Sil
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                              <Building2 className="h-4 w-4" />
                              <span className="truncate">{deal.company}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                              <User className="h-4 w-4" />
                              <span className="truncate">{deal.contact_person}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                              {formatCurrency(deal.value)}
                            </p>
                            <Badge variant="outline">{deal.probability}%</Badge>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                              <Clock className="h-3 w-3" />
                              {deal.days_in_stage} gün
                            </div>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-xs text-primary-600 dark:text-primary-400">
                                {deal.assignee.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {deal.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {deal.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="py-8 text-center">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Fırsat yok</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Deal Modal */}
      <AddDealModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onDealAdded={handleDealAdded}
      />

      {/* Edit Deal Modal */}
      {selectedDeal && (
        <EditDealModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          deal={selectedDeal}
          onDealUpdated={handleDealUpdated}
        />
      )}
    </div>
  );
}

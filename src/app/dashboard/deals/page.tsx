'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  TrendingUp,
  Plus,
  DollarSign,
  Target,
  Clock,
  MoreVertical,
  Building2,
  User,
} from 'lucide-react';

type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number;
  assignee: string;
  assigneeAvatar: string;
  daysInStage: number;
  contactPerson: string;
  tags: string[];
}

export default function DealsPage() {
  // TODO: Load from Supabase
  const [deals] = useState<Deal[]>([
    {
      id: '1',
      title: 'Enterprise CRM Implementation',
      company: 'TechCorp Solutions',
      value: 85000,
      stage: 'proposal',
      probability: 70,
      assignee: 'Sarah J.',
      assigneeAvatar: '',
      daysInStage: 5,
      contactPerson: 'John Smith',
      tags: ['Enterprise', 'High Priority'],
    },
    {
      id: '2',
      title: 'Marketing Automation Package',
      company: 'Digital Marketing Co',
      value: 45000,
      stage: 'negotiation',
      probability: 85,
      assignee: 'Michael C.',
      assigneeAvatar: '',
      daysInStage: 3,
      contactPerson: 'Lisa Brown',
      tags: ['Marketing'],
    },
    {
      id: '3',
      title: 'Website Redesign Project',
      company: 'E-commerce Plus',
      value: 32000,
      stage: 'qualified',
      probability: 60,
      assignee: 'Emily R.',
      assigneeAvatar: '',
      daysInStage: 8,
      contactPerson: 'Mike Johnson',
      tags: ['Design', 'Web'],
    },
    {
      id: '4',
      title: 'Mobile App Development',
      company: 'StartUp Ventures',
      value: 125000,
      stage: 'lead',
      probability: 30,
      assignee: 'David K.',
      assigneeAvatar: '',
      daysInStage: 12,
      contactPerson: 'Emily Davis',
      tags: ['Mobile', 'Large Deal'],
    },
    {
      id: '5',
      title: 'Brand Strategy Consultation',
      company: 'Creative Agency',
      value: 18000,
      stage: 'closed_won',
      probability: 100,
      assignee: 'Lisa A.',
      assigneeAvatar: '',
      daysInStage: 45,
      contactPerson: 'Tom Wilson',
      tags: ['Branding', 'Won'],
    },
    {
      id: '6',
      title: 'Social Media Management',
      company: 'Local Business',
      value: 12000,
      stage: 'proposal',
      probability: 50,
      assignee: 'Sarah J.',
      assigneeAvatar: '',
      daysInStage: 7,
      contactPerson: 'Anna Taylor',
      tags: ['Social Media'],
    },
  ]);

  const stages: { key: DealStage; label: string; color: string }[] = [
    { key: 'lead', label: 'Lead', color: 'bg-neutral-100 text-neutral-700' },
    { key: 'qualified', label: 'Qualified', color: 'bg-primary-100 text-primary-700' },
    { key: 'proposal', label: 'Proposal', color: 'bg-blue-100 text-blue-700' },
    { key: 'negotiation', label: 'Negotiation', color: 'bg-warning-100 text-warning-700' },
    { key: 'closed_won', label: 'Closed Won', color: 'bg-success-100 text-success-700' },
  ];

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getStageTotal = (stage: DealStage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const averageDealSize = totalPipelineValue / deals.length;
  const totalDeals = deals.length;
  const wonDeals = deals.filter((d) => d.stage === 'closed_won').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Satış Fırsatları</h1>
          <p className="mt-1 text-neutral-600">Satış pipeline'ınızı yönetin</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Yeni Fırsat
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Pipeline Değeri</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900">
                  {formatCurrency(totalPipelineValue)}
                </p>
              </div>
              <div className="rounded-lg bg-primary-100 p-3 text-primary-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Toplam Fırsat</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900">{totalDeals}</p>
              </div>
              <div className="rounded-lg bg-success-100 p-3 text-success-600">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Ortalama Değer</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900">
                  {formatCurrency(averageDealSize)}
                </p>
              </div>
              <div className="rounded-lg bg-warning-100 p-3 text-warning-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Kazanılan</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900">{wonDeals}</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
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
                <Card>
                  <CardHeader className={`${stage.color} rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{stage.label}</CardTitle>
                      <Badge variant="secondary">{stageDeals.length}</Badge>
                    </div>
                    <CardDescription className="font-semibold">
                      {formatCurrency(stageTotal)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    {stageDeals.map((deal) => (
                      <Card
                        key={deal.id}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-neutral-900">{deal.title}</h3>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                              <Building2 className="h-4 w-4" />
                              {deal.company}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                              <User className="h-4 w-4" />
                              {deal.contactPerson}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-lg font-bold text-primary-600">
                              {formatCurrency(deal.value)}
                            </p>
                            <Badge variant="outline">{deal.probability}%</Badge>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                              <Clock className="h-3 w-3" />
                              {deal.daysInStage} days
                            </div>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary-100 text-xs text-primary-600">
                                {deal.assignee.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1">
                            {deal.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="py-8 text-center">
                        <p className="text-sm text-neutral-500">Fırsat yok</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

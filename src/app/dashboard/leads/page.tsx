'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, Mail, Phone, Building2, TrendingUp, Users, Target } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  value: string;
}

const DEMO_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Can Demir',
    company: 'Digital Startup',
    email: 'can@digitalstartup.com',
    phone: '+90 532 111 2233',
    source: 'Website',
    score: 85,
    status: 'qualified',
    value: '₺45K',
  },
  {
    id: '2',
    name: 'Elif Kaya',
    company: 'Tech Solutions',
    email: 'elif@techsolutions.com',
    phone: '+90 533 444 5566',
    source: 'Referral',
    score: 92,
    status: 'contacted',
    value: '₺62K',
  },
  {
    id: '3',
    name: 'Murat Arslan',
    company: 'Innovation Labs',
    email: 'murat@innovationlabs.com',
    phone: '+90 534 777 8899',
    source: 'LinkedIn',
    score: 78,
    status: 'new',
    value: '₺38K',
  },
  {
    id: '4',
    name: 'Aylin Yıldız',
    company: 'Growth Marketing',
    email: 'aylin@growthmarketing.com',
    phone: '+90 535 123 4567',
    source: 'Cold Email',
    score: 65,
    status: 'contacted',
    value: '₺28K',
  },
  {
    id: '5',
    name: 'Kerem Öztürk',
    company: 'E-commerce Plus',
    email: 'kerem@ecommerceplus.com',
    phone: '+90 536 987 6543',
    source: 'Event',
    score: 45,
    status: 'unqualified',
    value: '₺15K',
  },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())
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
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600 dark:text-success-400';
    if (score >= 60) return 'text-warning-600 dark:text-warning-400';
    return 'text-danger-600 dark:text-danger-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Potansiyel Müşteriler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Lead yönetimi ve takibi</p>
        </div>
        <Button>
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
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{leads.length}</p>
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
                  {leads.filter((l) => l.status === 'qualified').length}
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
                  {leads.filter((l) => l.status === 'contacted').length}
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
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">₺188K</p>
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

      <div className="grid gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                      {lead.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{lead.name}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {lead.company}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </span>
                      <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(lead.status)}
                      <Badge variant="outline">Kaynak: {lead.source}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Lead Skoru</p>
                    <p className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>{lead.score}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Potansiyel Değer</p>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{lead.value}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Mail, Phone, Building2, TrendingUp, Users, Target, MoreVertical, Pencil, Trash2, ArrowUpDown, Filter } from 'lucide-react';
import { AddLeadModal } from '@/components/leads/AddLeadModal';
import { EditLeadModal } from '@/components/leads/EditLeadModal';
import { LeadDetailModal } from '@/components/leads/LeadDetailModal';

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

const STORAGE_KEY = 'crmdeep_leads';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('score_desc');
  const [groupBy, setGroupBy] = useState<string>('none');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Load leads from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLeads(JSON.parse(stored));
    } else {
      setLeads(DEMO_LEADS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_LEADS));
    }
  }, []);

  // Save to localStorage whenever leads change
  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }
  }, [leads]);

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

  const handleLeadAdded = (newLead: Lead) => {
    setLeads([newLead, ...leads]);
  };

  const handleLeadUpdated = (updatedLead: Lead) => {
    setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm('Bu lead\'i silmek istediğinizden emin misiniz?')) {
      setLeads(leads.filter(l => l.id !== leadId));
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailModalOpen(true);
  };

  // Filter and sort leads
  const getFilteredAndSortedLeads = () => {
    let filtered = leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score_desc':
          return b.score - a.score;
        case 'score_asc':
          return a.score - b.score;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return b.score - a.score;
      }
    });

    return filtered;
  };

  // Group leads
  const getGroupedLeads = () => {
    const filtered = getFilteredAndSortedLeads();

    if (groupBy === 'none') {
      return { 'Tüm Leadler': filtered };
    }

    const grouped: Record<string, Lead[]> = {};

    filtered.forEach((lead) => {
      let groupKey = '';

      switch (groupBy) {
        case 'status':
          groupKey = lead.status === 'new' ? 'Yeni' :
                     lead.status === 'contacted' ? 'İletişimde' :
                     lead.status === 'qualified' ? 'Nitelikli' : 'Niteliksiz';
          break;
        case 'source':
          groupKey = lead.source;
          break;
        case 'score':
          groupKey = lead.score >= 80 ? 'Yüksek Skor (80+)' :
                     lead.score >= 60 ? 'Orta Skor (60-79)' :
                     lead.score >= 40 ? 'Düşük Skor (40-59)' : 'Çok Düşük Skor (<40)';
          break;
        default:
          groupKey = 'Tüm Leadler';
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(lead);
    });

    return grouped;
  };

  const groupedLeads = getGroupedLeads();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Potansiyel Müşteriler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Lead yönetimi ve takibi</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            type="text"
            placeholder="Lead ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sırala" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score_desc">Skor (Yüksek)</SelectItem>
              <SelectItem value="score_asc">Skor (Düşük)</SelectItem>
              <SelectItem value="name">İsim (A-Z)</SelectItem>
              <SelectItem value="company">Firma (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Grupla" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Gruplama Yok</SelectItem>
              <SelectItem value="status">Duruma Göre</SelectItem>
              <SelectItem value="source">Kaynağa Göre</SelectItem>
              <SelectItem value="score">Skora Göre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leads Grid - Grouped */}
      {Object.entries(groupedLeads).map(([groupName, groupLeads]) => (
        <div key={groupName} className="space-y-4">
          {groupBy !== 'none' && (
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              {groupName}
              <Badge variant="secondary">{groupLeads.length}</Badge>
            </h2>
          )}
          <div className="grid gap-4">
            {groupLeads.map((lead) => (
          <Card
            key={lead.id}
            className="border-neutral-200 dark:border-neutral-700 cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => handleViewLead(lead)}
          >
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
                <div className="flex gap-3">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEditLead(lead);
                      }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLead(lead.id);
                        }}
                        className="text-danger-600 dark:text-danger-400"
                      >
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

          {groupLeads.length === 0 && (
            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="flex min-h-[200px] flex-col items-center justify-center">
                <Search className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Lead bulunamadı
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery ? `"${searchQuery}" için sonuç bulunamadı` : 'Bu grupta lead yok'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ))}

      {/* Add Lead Modal */}
      <AddLeadModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onLeadAdded={handleLeadAdded}
      />

      {/* Edit Lead Modal */}
      {selectedLead && (
        <EditLeadModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          lead={selectedLead}
          onLeadUpdated={handleLeadUpdated}
        />
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          lead={selectedLead}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
        />
      )}
    </div>
  );
}

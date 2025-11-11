'use client';

import { useState, useEffect } from 'react';
import { loadContacts, type Contact } from '@/lib/api/contacts';
import { getCurrentOrganizationId } from '@/lib/api/organization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  MoreVertical,
  UserPlus,
  Filter,
  Target,
  Star,
  Loader2,
} from 'lucide-react';
import { AddContactModal } from '@/components/contacts/AddContactModal';

// Demo contacts data
const DEMO_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 532 123 4567',
    position: 'CEO',
    company_name: 'TechCorp',
    status: 'client',
    tags: ['VIP', 'Tech'],
    avatar_url: null,
    organization_id: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Zeynep Kaya',
    email: 'zeynep@example.com',
    phone: '+90 533 234 5678',
    position: 'Marketing Manager',
    company_name: 'Digital Agency',
    status: 'lead',
    tags: ['Marketing'],
    avatar_url: null,
    organization_id: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mehmet Demir',
    email: 'mehmet@example.com',
    phone: '+90 534 345 6789',
    position: 'CTO',
    company_name: 'StartupHub',
    status: 'vip',
    tags: ['VIP', 'Tech', 'Startup'],
    avatar_url: null,
    organization_id: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(DEMO_CONTACTS);
  const [isLoading, setIsLoading] = useState(false);

  // No need for organization loading - using demo data
  useEffect(() => {
    // In the future, load from Supabase here
    console.log('Using demo contacts data');
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContactAdded = (newContact: Contact) => {
    setContacts([newContact, ...contacts]);
  };

  const activeCount = contacts.filter(c => c.status === 'active' || c.status === 'client').length;
  const leadCount = contacts.filter(c => c.status === 'lead' || c.status === 'prospect').length;
  const vipCount = contacts.filter(c => c.status === 'vip').length;

  const stats = [
    { label: 'Toplam Kişi', value: contacts.length, icon: Users, color: 'text-primary-600 dark:text-primary-400' },
    { label: 'Aktif', value: activeCount, icon: UserPlus, color: 'text-success-600 dark:text-success-400' },
    { label: 'Lead', value: leadCount, icon: Target, color: 'text-warning-600 dark:text-warning-400' },
    { label: 'VIP', value: vipCount, icon: Star, color: 'text-purple-600 dark:text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Kişiler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            İrtibatlar ve iletişim bilgilerini yönetin
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Yeni Kişi
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card className="border-neutral-200 dark:border-neutral-700">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <Input
                placeholder="Kişi, e-posta ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrele
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card className="border-neutral-200 dark:border-neutral-700">
        <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
          <CardTitle className="text-neutral-900 dark:text-neutral-100">
            Tüm Kişiler ({filteredContacts.length})
          </CardTitle>
          <CardDescription className="text-neutral-600 dark:text-neutral-400">
            İrtibat listeniz
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredContacts.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-600" />
              <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {contacts.length === 0 ? 'Henüz kişi yok' : 'Kişi bulunamadı'}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {contacts.length === 0
                  ? 'İlk kişinizi eklemek için yukarıdaki "Yeni Kişi" butonuna tıklayın'
                  : 'Arama kriterlerinize uygun kişi yok. Farklı bir arama deneyin.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar_url || ''} />
                      <AvatarFallback className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                        {contact.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {contact.position || 'N/A'}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                        {contact.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </span>
                        )}
                        {contact.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {contact.tags && contact.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      <Badge variant={
                        contact.status === 'vip' ? 'default' :
                        contact.status === 'client' ? 'success' :
                        contact.status === 'lead' ? 'warning' :
                        'secondary'
                      }>
                        {contact.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Contact Modal */}
      <AddContactModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onContactAdded={handleContactAdded}
        organizationId="demo"
      />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { loadContacts, type Contact } from '@/lib/api/contacts';
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
} from 'lucide-react';
import { AddContactModal } from '@/components/contacts/AddContactModal';

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Get actual organization ID
  const organizationId = 'temp-org-id';

  // Load contacts on mount
  useEffect(() => {
    async function fetchContacts() {
      setIsLoading(true);
      const data = await loadContacts(organizationId);
      setContacts(data);
      setIsLoading(false);
    }

    fetchContacts();
  }, [organizationId]);

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
    { label: 'Toplam Kişi', value: contacts.length, icon: Users, color: 'text-primary-600' },
    { label: 'Aktif', value: activeCount, icon: UserPlus, color: 'text-success-600' },
    { label: 'Lead', value: leadCount, icon: Target, color: 'text-warning-600' },
    { label: 'VIP', value: vipCount, icon: Star, color: 'text-purple-600' },
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
            <Card key={stat.label}>
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
                  <div className={`rounded-lg bg-neutral-100 p-3 dark:bg-neutral-700 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Kişi, e-posta veya şirket ara..."
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
      <Card>
        <CardHeader>
          <CardTitle>Tüm Kişiler ({filteredContacts.length})</CardTitle>
          <CardDescription>İrtibat listeniz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
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

          {filteredContacts.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Kişi bulunamadı
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Arama kriterlerinize uygun kişi yok. Farklı bir arama deneyin.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Contact Modal */}
      <AddContactModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onContactAdded={handleContactAdded}
        organizationId={organizationId}
      />
    </div>
  );
}

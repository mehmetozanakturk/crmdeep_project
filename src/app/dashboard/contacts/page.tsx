'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MoreVertical,
  UserPlus,
  Filter,
  Target,
  Star,
  Pencil,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import { AddContactModal } from '@/components/contacts/AddContactModal';
import { EditContactModal } from '@/components/contacts/EditContactModal';
import { ContactDetailModal } from '@/components/contacts/ContactDetailModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';

// Simplified Contact interface to match database schema
export interface Contact {
  id: string;
  organization_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  company_name: string | null;
  status: string;
  tags: string[];
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_key_contact?: boolean;
  department?: string | null;
  city?: string | null;
  address?: string | null;
  state?: string | null;
  country?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  last_contact_date?: string | null;
  birthday?: string | null;
  notes?: string | null;
  relatedEvents?: string[];
  relatedTasks?: string[];
  relatedNotes?: string[];
  priority?: string;
}

export default function ContactsPage() {
  const { currentOrganization, isLoading: orgLoading } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const loadContacts = useCallback(async () => {
    if (!currentOrganization) return;

    try {
      setIsLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading contacts:', error);
        return;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentOrganization]);

  // Load contacts from Supabase
  useEffect(() => {
    if (currentOrganization) {
      loadContacts();
    }
  }, [currentOrganization, loadContacts]);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.company_name && contact.company_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleContactAdded = async (newContact: Omit<Contact, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    if (!currentOrganization) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('contacts')
        .insert({
          organization_id: currentOrganization.id,
          name: newContact.name,
          email: newContact.email,
          phone: newContact.phone,
          position: newContact.position,
          company_name: newContact.company_name,
          status: newContact.status,
          tags: newContact.tags,
          avatar_url: newContact.avatar_url,
        });

      if (error) {
        console.error('Error creating contact:', error);
        alert('Kişi oluşturulurken hata oluştu');
        return;
      }

      await loadContacts();
    } catch (error) {
      console.error('Error creating contact:', error);
      alert('Kişi oluşturulurken hata oluştu');
    }
  };

  const handleContactUpdated = async (updatedContact: Contact) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('contacts')
        .update({
          name: updatedContact.name,
          email: updatedContact.email,
          phone: updatedContact.phone,
          position: updatedContact.position,
          company_name: updatedContact.company_name,
          status: updatedContact.status,
          tags: updatedContact.tags,
          avatar_url: updatedContact.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedContact.id);

      if (error) {
        console.error('Error updating contact:', error);
        alert('Kişi güncellenirken hata oluştu');
        return;
      }

      await loadContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Kişi güncellenirken hata oluştu');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Bu kişiyi silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        console.error('Error deleting contact:', error);
        alert('Kişi silinirken hata oluştu');
        return;
      }

      await loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Kişi silinirken hata oluştu');
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
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

  const statusOptions = [
    { label: 'Tümü', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Müşteri', value: 'client' },
    { label: 'Lead', value: 'lead' },
    { label: 'Potansiyel', value: 'prospect' },
    { label: 'VIP', value: 'vip' },
  ];

  // Show loading state
  if (orgLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600 dark:text-primary-400" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Kişiler yükleniyor...</p>
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
                placeholder="Kişi, e-posta, firma ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter === 'all' ? 'Tüm Durumlar' : statusOptions.find(o => o.value === statusFilter)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                    {statusFilter === option.value && ' ✓'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {(searchQuery || statusFilter !== 'all') && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
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
                  onClick={() => handleViewContact(contact)}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 cursor-pointer hover:shadow-md hover:scale-[1.01]"
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
                        {contact.position || 'N/A'} {contact.company_name && `• ${contact.company_name}`}
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
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      <Badge variant={
                        contact.status === 'vip' ? 'default' :
                        contact.status === 'client' ? 'default' :
                        contact.status === 'lead' ? 'secondary' :
                        'outline'
                      } className="text-xs">
                        {contact.status === 'client' ? 'Müşteri' :
                         contact.status === 'lead' ? 'Lead' :
                         contact.status === 'prospect' ? 'Potansiyel' :
                         contact.status === 'active' ? 'Aktif' :
                         contact.status === 'vip' ? 'VIP' : contact.status}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-danger-600 dark:text-danger-400"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
        organizationId={currentOrganization.id}
      />

      {/* Detail Contact Modal */}
      {selectedContact && (
        <ContactDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          contact={selectedContact}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
        />
      )}

      {/* Edit Contact Modal */}
      {selectedContact && (
        <EditContactModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          contact={selectedContact}
          onContactUpdated={handleContactUpdated}
        />
      )}
    </div>
  );
}

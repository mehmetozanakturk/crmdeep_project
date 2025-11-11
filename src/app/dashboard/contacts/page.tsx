'use client';

import { useState, useEffect } from 'react';
import { type Contact } from '@/lib/api/contacts';
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
  ArrowUpDown,
  Layers,
} from 'lucide-react';
import { AddContactModal } from '@/components/contacts/AddContactModal';
import { EditContactModal } from '@/components/contacts/EditContactModal';
import { ContactDetailModal } from '@/components/contacts/ContactDetailModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sortContacts, SORT_OPTIONS, type SortOption } from '@/lib/utils/sorting';
import { groupContacts, GROUP_OPTIONS, type ContactGroupOption } from '@/lib/utils/grouping';

// Demo contacts data
const DEMO_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 532 123 4567',
    position: 'CEO',
    company_id: null,
    company_name: 'TechCorp',
    status: 'client',
    tags: ['VIP', 'Tech'],
    avatar_url: null,
    linkedin_url: 'https://linkedin.com/in/ahmetyilmaz',
    twitter_url: null,
    address: 'Levent Mah. Teknoloji Cad. No:15',
    city: 'İstanbul',
    state: null,
    country: 'Türkiye',
    notes: 'Uzun süredir çalıştığımız önemli bir müşteri. Her ayın ilk haftasında rutin toplantı yapılıyor.',
    last_contact_date: new Date().toISOString(),
    organization_id: 'demo',
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    relatedTasks: [],
    relatedNotes: [],
    relatedEvents: [],
    priority: 'high',
    birthday: '1985-05-15',
    department: 'Yönetim',
    is_key_contact: true,
  },
  {
    id: '2',
    name: 'Zeynep Kaya',
    email: 'zeynep@example.com',
    phone: '+90 533 234 5678',
    position: 'Marketing Manager',
    company_id: null,
    company_name: 'Digital Agency',
    status: 'lead',
    tags: ['Marketing'],
    avatar_url: null,
    linkedin_url: null,
    twitter_url: null,
    address: null,
    city: 'Ankara',
    state: null,
    country: 'Türkiye',
    notes: 'Yeni lead, pazarlama stratejisi konusunda görüşme talep etti.',
    last_contact_date: null,
    organization_id: 'demo',
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    relatedTasks: [],
    relatedNotes: [],
    relatedEvents: [],
    priority: 'medium',
    birthday: null,
    department: 'Pazarlama',
    is_key_contact: false,
  },
  {
    id: '3',
    name: 'Mehmet Demir',
    email: 'mehmet@example.com',
    phone: '+90 534 345 6789',
    position: 'CTO',
    company_id: null,
    company_name: 'StartupHub',
    status: 'vip',
    tags: ['VIP', 'Tech', 'Startup'],
    avatar_url: null,
    linkedin_url: 'https://linkedin.com/in/mehmetdemir',
    twitter_url: 'https://twitter.com/mdemir',
    address: null,
    city: 'İzmir',
    state: null,
    country: 'Türkiye',
    notes: 'VIP müşteri, teknoloji ortağımız. Aylık inovasyon toplantıları yapılıyor.',
    last_contact_date: new Date().toISOString(),
    organization_id: 'demo',
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    relatedTasks: [],
    relatedNotes: [],
    relatedEvents: [],
    priority: 'critical',
    birthday: '1990-03-22',
    department: 'Teknoloji',
    is_key_contact: true,
  },
  {
    id: '4',
    name: 'Ayşe Şahin',
    email: 'ayse@example.com',
    phone: '+90 535 456 7890',
    position: 'Product Manager',
    company_id: null,
    company_name: 'InnovateLab',
    status: 'prospect',
    tags: ['Product', 'Innovation'],
    avatar_url: null,
    linkedin_url: null,
    twitter_url: null,
    address: null,
    city: 'Bursa',
    state: null,
    country: 'Türkiye',
    notes: null,
    last_contact_date: null,
    organization_id: 'demo',
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    relatedTasks: [],
    relatedNotes: [],
    relatedEvents: [],
    priority: 'low',
    birthday: null,
    department: 'Ürün',
    is_key_contact: false,
  },
  {
    id: '5',
    name: 'Can Öztürk',
    email: 'can@example.com',
    phone: '+90 536 567 8901',
    position: 'Sales Director',
    company_id: null,
    company_name: 'SalesCorp',
    status: 'active',
    tags: ['Sales', 'Enterprise'],
    avatar_url: null,
    linkedin_url: null,
    twitter_url: null,
    address: null,
    city: 'Antalya',
    state: null,
    country: 'Türkiye',
    notes: 'Aktif müşteri, satış partneri.',
    last_contact_date: '2024-02-01',
    organization_id: 'demo',
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    relatedTasks: [],
    relatedNotes: [],
    relatedEvents: [],
    priority: 'high',
    birthday: '1988-11-10',
    department: 'Satış',
    is_key_contact: true,
  },
];

const STORAGE_KEY = 'crmdeep_contacts';

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created-newest');
  const [groupBy, setGroupBy] = useState<ContactGroupOption>('none');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load contacts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const loadedContacts = JSON.parse(stored);
      // Migrate old data to include new fields
      const migratedContacts = loadedContacts.map((contact: any) => ({
        ...contact,
        relatedTasks: contact.relatedTasks || [],
        relatedNotes: contact.relatedNotes || [],
        relatedEvents: contact.relatedEvents || [],
        priority: contact.priority || 'medium',
        birthday: contact.birthday || null,
        department: contact.department || null,
        is_key_contact: contact.is_key_contact || false,
      }));
      setContacts(migratedContacts);
    } else {
      setContacts(DEMO_CONTACTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CONTACTS));
    }
  }, []);

  // Save to localStorage whenever contacts change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }
  }, [contacts]);

  // Filtreleme
  let filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.company_name && contact.company_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sıralama
  filteredContacts = sortContacts(filteredContacts, sortBy);

  // Gruplama
  const groupedContacts = groupContacts(filteredContacts, groupBy);

  const handleContactAdded = (newContact: Contact) => {
    // Add default values for new fields if missing
    const contactWithDefaults: Contact = {
      ...newContact,
      relatedTasks: newContact.relatedTasks || [],
      relatedNotes: newContact.relatedNotes || [],
      relatedEvents: newContact.relatedEvents || [],
      priority: newContact.priority || 'medium',
      birthday: newContact.birthday || null,
      department: newContact.department || null,
      is_key_contact: newContact.is_key_contact || false,
    };
    setContacts([contactWithDefaults, ...contacts]);
  };

  const handleContactUpdated = (updatedContact: Contact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Bu kişiyi silmek istediğinizden emin misiniz?')) {
      setContacts(contacts.filter(c => c.id !== contactId));
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
          <div className="flex flex-col gap-3">
            {/* Search and Status Filter */}
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

            {/* Sort and Group */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sıralama" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.contacts.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={groupBy} onValueChange={(value) => setGroupBy(value as ContactGroupOption)}>
                  <SelectTrigger>
                    <Layers className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Gruplama" />
                  </SelectTrigger>
                  <SelectContent>
                    {GROUP_OPTIONS.contacts.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-600" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {contacts.length === 0 ? 'Henüz kişi yok' : 'Kişi bulunamadı'}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {contacts.length === 0
                ? 'İlk kişinizi eklemek için yukarıdaki "Yeni Kişi" butonuna tıklayın'
                : 'Arama kriterlerinize uygun kişi yok. Farklı bir arama deneyin.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedContacts.map((group) => (
            <Card key={group.groupName} className="border-neutral-200 dark:border-neutral-700">
              <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
                <CardTitle className={groupBy !== 'none' ? group.color : 'text-neutral-900 dark:text-neutral-100'}>
                  {groupBy !== 'none' ? group.groupLabel : `Tüm Kişiler (${group.items.length})`}
                </CardTitle>
                <CardDescription className="text-neutral-600 dark:text-neutral-400">
                  {groupBy !== 'none' ? `${group.items.length} kişi` : 'İrtibat listeniz'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {group.items.map((contact) => (
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <AddContactModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onContactAdded={handleContactAdded}
        organizationId="demo"
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

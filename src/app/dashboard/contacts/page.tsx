'use client';

import { useState } from 'react';
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
} from 'lucide-react';

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Load from Supabase
  const contacts = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Solutions',
      position: 'CEO',
      tags: ['VIP', 'Decision Maker'],
      avatar: '',
      lastContact: '2 hours ago',
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@digitalmarket.com',
      phone: '+1 (555) 234-5678',
      company: 'Digital Marketing Co',
      position: 'Marketing Director',
      tags: ['Lead'],
      avatar: '',
      lastContact: '1 day ago',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.r@ecommerceplus.com',
      phone: '+1 (555) 345-6789',
      company: 'E-commerce Plus',
      position: 'Product Manager',
      tags: ['Client', 'Active'],
      avatar: '',
      lastContact: '3 days ago',
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david@startup.io',
      phone: '+1 (555) 456-7890',
      company: 'StartUp Ventures',
      position: 'CTO',
      tags: ['Prospect'],
      avatar: '',
      lastContact: '1 week ago',
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'lisa@creativeagency.com',
      phone: '+1 (555) 567-8901',
      company: 'Creative Agency',
      position: 'Creative Director',
      tags: ['Client', 'VIP'],
      avatar: '',
      lastContact: '2 weeks ago',
    },
  ];

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Toplam Kişi', value: contacts.length, icon: Users, color: 'text-primary-600' },
    { label: 'Aktif', value: 3, icon: UserPlus, color: 'text-success-600' },
    { label: 'Lead', value: 1, icon: Target, color: 'text-warning-600' },
    { label: 'VIP', value: 2, icon: Star, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Kişiler</h1>
          <p className="mt-1 text-neutral-600">İrtibatlar ve iletişim bilgilerini yönetin</p>
        </div>
        <Button className="flex items-center gap-2">
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
                    <p className="text-sm font-medium text-neutral-600">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-neutral-900">{stat.value}</p>
                  </div>
                  <div className={`rounded-lg bg-neutral-100 p-3 ${stat.color}`}>
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
                className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-primary-100 text-primary-600">
                      {contact.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{contact.name}</h3>
                    <p className="text-sm text-neutral-600">
                      {contact.position} at {contact.company}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-neutral-500">{contact.lastContact}</div>
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
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">Kişi bulunamadı</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Arama kriterlerinize uygun kişi yok. Farklı bir arama deneyin.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Missing imports for demo (will be added when implementing real functionality)
import { Target, Star } from 'lucide-react';

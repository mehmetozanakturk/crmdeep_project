'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User,
  CreditCard,
  Zap,
  Users,
  Key,
  Bell,
  Download,
  Trash2,
  Plus,
  Check,
  ExternalLink,
  Mail,
  Calendar,
  MessageSquare,
  BarChart3,
  Sparkles,
} from 'lucide-react';

type Tab = 'general' | 'subscription' | 'usage' | 'team' | 'api' | 'notifications';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const tabs = [
    { id: 'general' as Tab, label: 'Genel', icon: User },
    { id: 'subscription' as Tab, label: 'Abonelik', icon: CreditCard },
    { id: 'usage' as Tab, label: 'Kullanım', icon: Zap },
    { id: 'team' as Tab, label: 'Ekip', icon: Users },
    { id: 'api' as Tab, label: 'API & Entegrasyonlar', icon: Key },
    { id: 'notifications' as Tab, label: 'Bildirimler', icon: Bell },
  ];

  // Mock data
  const currentPlan = {
    name: 'Startup',
    price: '$49',
    period: '/ay',
    users: 5,
    usedUsers: 3,
    tokens: 30000,
    usedTokens: 12450,
    storage: '25 GB',
    usedStorage: '8.2 GB',
    nextBilling: '15 Mart 2024',
  };

  const tokenUsage = [
    { feature: 'Email Kampanyaları', used: 5200, icon: Mail, color: 'text-primary-600' },
    { feature: 'SMS Kampanyaları', used: 2400, icon: MessageSquare, color: 'text-warning-600' },
    { feature: 'AI Özellikleri', used: 3500, icon: Sparkles, color: 'text-purple-600' },
    { feature: 'Gelişmiş Analitik', used: 800, icon: BarChart3, color: 'text-success-600' },
    { feature: 'Otomasyonlar', used: 550, icon: Calendar, color: 'text-neutral-600' },
  ];

  const teamMembers = [
    { name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Admin', status: 'active' },
    { name: 'Zeynep Kaya', email: 'zeynep@example.com', role: 'Member', status: 'active' },
    { name: 'Mehmet Demir', email: 'mehmet@example.com', role: 'Member', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Ayarlar</h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">Hesabınızı ve organizasyonunuzu yönetin</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <CardTitle>Profil</CardTitle>
                <CardDescription>Kişisel bilgilerinizi güncelleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                      AY
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Avatar Değiştir</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" defaultValue="Ahmet Yılmaz" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="ahmet@example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" defaultValue="+90 532 123 4567" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="language">Dil</Label>
                    <Input id="language" defaultValue="Türkçe" className="mt-1" />
                  </div>
                </div>

                <Button>Değişiklikleri Kaydet</Button>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <CardTitle>Organizasyon</CardTitle>
                <CardDescription>Organizasyon bilgilerinizi yönetin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="org-name">Organizasyon Adı</Label>
                  <Input id="org-name" defaultValue="TechCorp Solutions" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="org-slug">Organizasyon URL</Label>
                  <Input id="org-slug" defaultValue="techcorp-solutions" className="mt-1" />
                  <p className="mt-1 text-xs text-neutral-500">
                    URL: crmdeep.com/org/techcorp-solutions
                  </p>
                </div>

                <Button>Organizasyonu Güncelle</Button>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <CardTitle>Güvenlik</CardTitle>
                <CardDescription>Şifre ve güvenlik ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Mevcut Şifre</Label>
                  <Input id="current-password" type="password" className="mt-1" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="new-password">Yeni Şifre</Label>
                    <Input id="new-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                    <Input id="confirm-password" type="password" className="mt-1" />
                  </div>
                </div>

                <Button>Şifreyi Değiştir</Button>
              </CardContent>
            </Card>

            <Card className="border-danger-200 dark:border-danger-800">
              <CardHeader>
                <CardTitle className="text-danger-600 dark:text-danger-400">Tehlikeli Bölge</CardTitle>
                <CardDescription>Geri alınamaz işlemler</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">Hesabı Sil</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mevcut Paketiniz</CardTitle>
                    <CardDescription>Abonelik ve faturalama bilgileri</CardDescription>
                  </div>
                  <Badge className="bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
                    Aktif
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between border rounded-lg p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {currentPlan.name}
                    </h3>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                      {currentPlan.price}
                      <span className="text-lg text-neutral-600 dark:text-neutral-400">{currentPlan.period}</span>
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                      Sonraki ödeme: {currentPlan.nextBilling}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/pricing">
                      <Button variant="outline">Paketi Değiştir</Button>
                    </Link>
                    <Button variant="outline" className="text-danger-600">İptal Et</Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Kullanıcılar</span>
                      <Users className="h-4 w-4 text-neutral-500" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {currentPlan.usedUsers} / {currentPlan.users}
                    </p>
                    <Progress
                      value={(currentPlan.usedUsers / currentPlan.users) * 100}
                      className="mt-2 h-2"
                    />
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Jetonlar</span>
                      <Zap className="h-4 w-4 text-warning-500" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {currentPlan.usedTokens.toLocaleString()} / {currentPlan.tokens.toLocaleString()}
                    </p>
                    <Progress
                      value={(currentPlan.usedTokens / currentPlan.tokens) * 100}
                      className="mt-2 h-2"
                    />
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Depolama</span>
                      <BarChart3 className="h-4 w-4 text-primary-500" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {currentPlan.usedStorage}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">{currentPlan.storage} limit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <CardTitle>Faturalama Geçmişi</CardTitle>
                <CardDescription>Son faturalarınız</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '15 Şubat 2024', amount: '$49.00', status: 'paid' },
                    { date: '15 Ocak 2024', amount: '$49.00', status: 'paid' },
                    { date: '15 Aralık 2023', amount: '$49.00', status: 'paid' },
                  ].map((invoice, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">{invoice.date}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{invoice.amount}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-success-100 text-success-700">Ödendi</Badge>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      Ekstra Jeton Satın Al
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      Aylık jetonlarınız tükendi mi? Ekstra jeton paketleri ile devam edin.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">10K jeton - $10</Button>
                      <Button variant="outline" size="sm">50K jeton - $40</Button>
                      <Button variant="outline" size="sm">100K jeton - $70</Button>
                    </div>
                  </div>
                  <Zap className="h-12 w-12 text-warning-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <CardTitle>Jeton Kullanımı</CardTitle>
                <CardDescription>Bu ay harcadığınız jetonların detayları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Kullanım</span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {currentPlan.usedTokens.toLocaleString()} / {currentPlan.tokens.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(currentPlan.usedTokens / currentPlan.tokens) * 100} className="h-3" />
                  <p className="text-xs text-neutral-500 mt-2">
                    {currentPlan.tokens - currentPlan.usedTokens} jeton kaldı
                  </p>
                </div>

                <div className="space-y-4">
                  {tokenUsage.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2 ${item.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.feature}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {item.used.toLocaleString()} jeton kullanıldı
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">{((item.used / currentPlan.usedTokens) * 100).toFixed(1)}%</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <CardTitle>Kullanım Geçmişi</CardTitle>
                <CardDescription>Son 6 ayın jeton kullanımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Şubat', 'Ocak', 'Aralık', 'Kasım', 'Ekim', 'Eylül'].map((month, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">{month} 2024</span>
                      <div className="flex items-center gap-3">
                        <Progress value={Math.random() * 100} className="w-32 h-2" />
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 w-20 text-right">
                          {Math.floor(Math.random() * 25000 + 5000).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ekip Üyeleri</CardTitle>
                    <CardDescription>
                      {currentPlan.usedUsers} / {currentPlan.users} kullanıcı
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Üye Davet Et
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary-100 text-primary-600">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">{member.name}</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>
                          {member.role}
                        </Badge>
                        <Badge className="bg-success-100 text-success-700">Aktif</Badge>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-danger-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <CardTitle>API Anahtarları</CardTitle>
                <CardDescription>API erişimi için anahtarlarınızı yönetin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">Production API Key</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono mt-1">
                      sk_live_••••••••••••••••••••
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Yenile</Button>
                </div>

                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni API Anahtarı Oluştur
                </Button>

                <div className="mt-6">
                  <Link href="#" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                    API Dokümantasyonu
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <CardTitle>Entegrasyonlar</CardTitle>
                <CardDescription>Üçüncü parti uygulamalarla entegre olun</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {['Google Workspace', 'Slack', 'Mailchimp', 'Zapier'].map((integration, idx) => (
                    <div key={idx} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{integration}</span>
                      </div>
                      <Button variant="outline" size="sm">Bağlan</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <CardTitle>Bildirim Tercihleri</CardTitle>
                <CardDescription>Hangi bildirimleri almak istediğinizi seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Email Bildirimleri', description: 'Yeni görevler, yorumlar ve güncellemeler' },
                  { title: 'SMS Bildirimleri', description: 'Önemli olaylar için SMS al' },
                  { title: 'Push Bildirimleri', description: 'Tarayıcı bildirimleri' },
                  { title: 'Haftalık Özet', description: 'Haftanın özet raporu' },
                  { title: 'Pazarlama Emailleri', description: 'Yeni özellikler ve güncellemeler' },
                ].map((pref, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">{pref.title}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{pref.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Check className="h-4 w-4 mr-1" />
                      Aktif
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

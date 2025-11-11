'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Users, Mail, MessageSquare, BarChart3, Workflow, Sparkles, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    id: 'freelance',
    name: 'Freelance',
    price: '$20',
    period: '/ay',
    description: 'Bireysel kullanıcılar için ideal',
    popular: false,
    features: {
      users: '1 Kullanıcı',
      tokens: '10,000 Jeton/ay',
      storage: '5 GB Depolama',
      support: 'Email Destek',
    },
    cta: 'Başla',
  },
  {
    id: 'startup',
    name: 'Startup',
    price: '$49',
    period: '/ay',
    description: 'Küçük ekipler için',
    popular: true,
    features: {
      users: '5 Kullanıcı',
      tokens: '30,000 Jeton/ay',
      storage: '25 GB Depolama',
      support: 'Öncelikli Destek',
    },
    cta: 'Başla',
  },
  {
    id: 'business',
    name: 'Business',
    price: '$99',
    period: '/ay',
    description: 'Büyüyen şirketler için',
    popular: false,
    features: {
      users: '15 Kullanıcı',
      tokens: '100,000 Jeton/ay',
      storage: '100 GB Depolama',
      support: '7/24 Destek',
    },
    cta: 'Başla',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Özel',
    period: '',
    description: 'Kurumsal çözümler için',
    popular: false,
    features: {
      users: 'Sınırsız Kullanıcı',
      tokens: 'Özel Jeton Paketi',
      storage: 'Sınırsız Depolama',
      support: 'Özel Hesap Yöneticisi',
    },
    cta: 'İletişime Geç',
  },
];

const BASE_FEATURES = [
  {
    category: 'Temel CRM Özellikleri',
    icon: Users,
    description: 'Tüm paketlerde sınırsız kullanım',
    items: [
      'Sınırsız Kişi & Firma',
      'Sınırsız Anlaşma & Lead',
      'Sınırsız Proje & Görev',
      'Takvim & Not Yönetimi',
      'Ekip İşbirliği',
      'Temel Raporlar',
    ],
  },
];

const TOKEN_USAGE = [
  {
    feature: 'Email Kampanyası',
    icon: Mail,
    cost: '10 jeton = 1 email',
    description: 'Toplu email gönderimi',
  },
  {
    feature: 'SMS Kampanyası',
    icon: MessageSquare,
    cost: '20 jeton = 1 SMS',
    description: 'Toplu SMS gönderimi',
  },
  {
    feature: 'AI Özellikleri',
    icon: Sparkles,
    cost: '50 jeton = 1 AI çağrısı',
    description: 'Yapay zeka destekli özellikler',
  },
  {
    feature: 'Gelişmiş Analitik',
    icon: BarChart3,
    cost: '100 jeton = 1 rapor',
    description: 'Detaylı analiz raporları',
  },
  {
    feature: 'Otomasyon',
    icon: Workflow,
    cost: '5 jeton = 1 çalıştırma',
    description: 'Workflow otomasyonları',
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              CRMDeep
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard&apos;a Dön</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Her Boyuttan İşletme İçin Uygun Fiyatlar
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Temel CRM özellikleri sınırsız. Maliyet yaratan özellikler için jeton kullan.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Yıllık
              <Badge className="ml-2 bg-success-100 text-success-700">20% İndirim</Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative border-2 ${
                  plan.popular
                    ? 'border-primary-500 shadow-xl scale-105'
                    : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary-600 text-white px-4 py-1">En Popüler</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-neutral-600 dark:text-neutral-400">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary-600" />
                      <span className="text-sm font-medium">{plan.features.users}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-warning-600" />
                      <span className="text-sm font-medium">{plan.features.tokens}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-success-600" />
                      <span className="text-sm font-medium">{plan.features.storage}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-neutral-600" />
                      <span className="text-sm font-medium">{plan.features.support}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Base Features */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Tüm Paketlerde Sınırsız
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Temel CRM özellikleri için jeton harcamanıza gerek yok
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {BASE_FEATURES.map((feature, idx) => (
              <Card key={idx} className="border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                      <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <CardTitle>{feature.category}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {feature.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-success-600" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Token Usage */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 px-4 py-2 rounded-full mb-4">
              <Zap className="h-4 w-4" />
              <span className="font-medium">Jeton Sistemi</span>
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Jetonlarınızı Nasıl Kullanabilirsiniz?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Maliyet yaratan özellikler için jeton kullanın. İhtiyacınıza göre ekstra jeton satın alabilirsiniz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TOKEN_USAGE.map((item, idx) => (
              <Card key={idx} className="border-neutral-200 dark:border-neutral-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="rounded-full bg-primary-100 dark:bg-primary-900/30 p-4">
                      <item.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.feature}
                    </h3>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {item.cost}
                    </Badge>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="inline-block border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20">
              <CardContent className="pt-6">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                  <strong>Ekstra Jeton İhtiyacınız mı Var?</strong>
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  10,000 jeton = $10 | 50,000 jeton = $40 | 100,000 jeton = $70
                </p>
                <Button variant="outline">Jeton Satın Al</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 dark:bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bugün Başlayın</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            14 gün ücretsiz deneme. Kredi kartı gerekmez. İstediğiniz zaman iptal edebilirsiniz.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary">
                Ücretsiz Başla
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              Demo İste
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            © 2024 CRMDeep. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, BookOpen, Search, Eye, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

const DEMO_ARTICLES = [
  { id: '1', title: 'Nasıl başlarım?', category: 'Başlangıç', views: 245, likes: 42, updated: '2 gün önce' },
  { id: '2', title: 'API dokümantasyonu', category: 'Geliştirici', views: 180, likes: 35, updated: '5 gün önce' },
  { id: '3', title: 'Faturalama rehberi', category: 'Faturalama', views: 320, likes: 58, updated: '1 hafta önce' },
  { id: '4', title: 'Güvenlik en iyi uygulamaları', category: 'Güvenlik', views: 156, likes: 28, updated: '2 hafta önce' },
];

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Bilgi Bankası</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Yardım makaleleri ve dokümantasyon</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Makale</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <Input type="text" placeholder="Makale ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {DEMO_ARTICLES.map((article) => (
          <Card key={article.id} className="border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3 h-fit">
                  <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{article.title}</h3>
                  <Badge variant="secondary" className="mt-2">{article.category}</Badge>
                  <div className="flex items-center gap-4 mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.views}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{article.likes}</span>
                    <span>{article.updated}</span>
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

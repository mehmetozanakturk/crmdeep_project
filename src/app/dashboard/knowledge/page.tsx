'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, BookOpen, Search, Eye, FileText, CheckCircle2, FileEdit, Trash2, MoreVertical } from 'lucide-react';
import { AddArticleModal } from '@/components/knowledge/AddArticleModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useBrands } from '@/lib/hooks/useBrands';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  tags: string[];
  views: number;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export default function KnowledgePage() {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [articles, setArticles] = useState<Article[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadArticles();
  }, [currentOrganization, currentBrand]);

  const loadArticles = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('knowledge_articles')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (currentBrand) {
        query = query.eq('brand_id', currentBrand.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu makaleyi silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('knowledge_articles').delete().eq('id', id);

      if (error) throw error;
      loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Makale silinirken hata oluştu');
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: 'Genel',
      technical: 'Teknik',
      'how-to': 'Nasıl Yapılır',
      troubleshooting: 'Sorun Giderme',
      faq: 'SSS',
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Taslak',
      published: 'Yayınlandı',
      archived: 'Arşivlendi',
    };
    return labels[status] || status;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR');
  };

  // Filter articles based on search
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.content.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate stats
  const totalArticles = articles.length;
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Bilgi Bankası</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Yardım makaleleri ve dokümantasyon</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />Yeni Makale
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Makale</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalArticles}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Yayınlandı</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{publishedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Taslaklar</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">{draftCount}</p>
              </div>
              <FileEdit className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Görüntülenme</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">{totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <Input
          type="text"
          placeholder="Makale ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Makaleler yükleniyor...</p>
          </div>
        </div>
      ) : filteredArticles.length === 0 ? (
        /* Empty State */
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {search ? 'Makale bulunamadı' : 'Henüz makale yok'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {search ? 'Arama kriterlerinizi değiştirerek tekrar deneyin' : 'Yeni makale eklemek için yukarıdaki butonu kullanın'}
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Articles Grid */
        <div className="grid gap-4 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3 h-fit">
                    <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{article.title}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileEdit className="mr-2 h-4 w-4" />Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(article.id)} className="text-danger-600">
                            <Trash2 className="mr-2 h-4 w-4" />Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{getCategoryLabel(article.category)}</Badge>
                      <Badge className={
                        article.status === 'published' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' :
                        article.status === 'draft' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' :
                        'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                      }>
                        {getStatusLabel(article.status)}
                      </Badge>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 text-neutral-500">+{article.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />{article.views || 0}
                      </span>
                      <span>{formatDate(article.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Article Modal */}
      <AddArticleModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onArticleAdded={loadArticles}
      />
    </div>
  );
}

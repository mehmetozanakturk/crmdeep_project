'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FolderTree, File, FileText, Image, Download } from 'lucide-react';

const DEMO_FILES = [
  { id: '1', name: 'Proje Sunumu.pdf', type: 'pdf', size: '2.4 MB', folder: 'Sunumlar', uploaded: '2 gün önce', icon: FileText },
  { id: '2', name: 'Logo Tasarımları.zip', type: 'zip', size: '15.8 MB', folder: 'Design', uploaded: '5 gün önce', icon: File },
  { id: '3', name: 'Ekip Fotoğrafı.jpg', type: 'image', size: '3.2 MB', folder: 'Görseller', uploaded: '1 hafta önce', icon: Image },
  { id: '4', name: 'Q1 Raporu.xlsx', type: 'excel', size: '1.1 MB', folder: 'Raporlar', uploaded: '2 hafta önce', icon: FileText },
];

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Dosya Kütüphanesi</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Tüm dosyalarınızı tek yerde saklayın</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Dosya Yükle</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Dosya</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">124</p>
              </div>
              <File className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Kullanılan Alan</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">8.2 GB</p>
              </div>
              <FolderTree className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Klasörler</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">18</p>
              </div>
              <FolderTree className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Paylaşılan</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">32</p>
              </div>
              <File className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {DEMO_FILES.map((file) => {
          const Icon = file.icon;
          return (
            <Card key={file.id} className="border-neutral-200 dark:border-neutral-700 hover:shadow-sm transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                      <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{file.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{file.folder}</Badge>
                        <span className="text-sm text-neutral-500">{file.size}</span>
                        <span className="text-sm text-neutral-500">• {file.uploaded}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

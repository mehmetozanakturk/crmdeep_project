'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FolderTree, File, FileText, Image, Download, Trash2, Upload as UploadIcon } from 'lucide-react';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { UploadFileModal } from '@/components/files/UploadFileModal';

interface FileRecord {
  id: string;
  organization_id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  folder: string;
  uploaded_by?: string;
  related_to_type?: string;
  related_to_id?: string;
  created_at: string;
  updated_at: string;
}

export default function FilesPage() {
  const { currentOrganization } = useOrganization();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, [currentOrganization]);

  const loadFiles = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // If file_url is a Supabase storage path, get the public URL
      // Otherwise, use it directly
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Dosya indirilirken hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('files').delete().eq('id', id);

      if (error) throw error;
      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Dosya silinirken hata oluştu');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Bugün';
    } else if (diffInDays === 1) {
      return 'Dün';
    } else if (diffInDays < 7) {
      return `${diffInDays} gün önce`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} hafta önce`;
    } else {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  const getFileIcon = (fileType: string) => {
    if (!fileType) return File;

    const type = fileType.toLowerCase();
    if (type.includes('image') || type.includes('jpg') || type.includes('png') || type.includes('jpeg')) {
      return Image;
    } else if (type.includes('pdf') || type.includes('doc') || type.includes('text')) {
      return FileText;
    }
    return File;
  };

  const totalFiles = files.length;
  const totalSize = files.reduce((sum, file) => sum + (file.file_size || 0), 0);
  const uniqueFolders = new Set(files.map(f => f.folder)).size;

  // Count file types
  const fileTypes = files.reduce((acc, file) => {
    const type = file.file_type || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topFileType = Object.entries(fileTypes).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Dosya Kütüphanesi</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Tüm dosyalarınızı tek yerde saklayın</p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <UploadIcon className="mr-2 h-4 w-4" />Dosya Yükle
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Dosya</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalFiles}</p>
              </div>
              <File className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Boyut</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{formatFileSize(totalSize)}</p>
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
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{uniqueFolders}</p>
              </div>
              <FolderTree className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">En Çok</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
                  {topFileType ? topFileType[0].split('/')[1]?.toUpperCase() || topFileType[0] : 'N/A'}
                </p>
              </div>
              <FileText className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Dosyalar yükleniyor...</p>
          </div>
        </div>
      ) : files.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <File className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Henüz dosya yok</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Dosya yüklemek için yukarıdaki butonu kullanın</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => {
            const Icon = getFileIcon(file.file_type);
            return (
              <Card key={file.id} className="border-neutral-200 dark:border-neutral-700 hover:shadow-sm transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                        <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{file.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{file.folder || 'root'}</Badge>
                          <span className="text-sm text-neutral-500">{formatFileSize(file.file_size)}</span>
                          <span className="text-sm text-neutral-500">• {formatTime(file.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(file.file_url, file.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownload(file.file_url, file.name)}>
                            <Download className="mr-2 h-4 w-4" />İndir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(file.id)} className="text-danger-600">
                            <Trash2 className="mr-2 h-4 w-4" />Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <UploadFileModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onFileUploaded={loadFiles}
      />
    </div>
  );
}

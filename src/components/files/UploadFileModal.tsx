'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';
import { Upload } from 'lucide-react';

interface UploadFileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded: () => void;
}

export function UploadFileModal({ open, onOpenChange, onFileUploaded }: UploadFileModalProps) {
  const { currentOrganization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    file_url: '',
    folder: 'root',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData({
        ...formData,
        name: file.name,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      let fileUrl = formData.file_url;
      let fileSize = 0;
      let fileType = '';

      // If a file was selected, we would upload it to storage here
      // For now, we'll use the provided URL or create a placeholder
      if (selectedFile) {
        // TODO: Upload to Supabase Storage
        // const { data: uploadData, error: uploadError } = await supabase.storage
        //   .from('files')
        //   .upload(`${currentOrganization.id}/${selectedFile.name}`, selectedFile);

        // if (uploadError) throw uploadError;
        // fileUrl = supabase.storage.from('files').getPublicUrl(uploadData.path).data.publicUrl;

        // For now, we'll create a data URL as a placeholder
        fileUrl = formData.file_url || 'https://placeholder.com/file';
        fileSize = selectedFile.size;
        fileType = selectedFile.type;
      }

      const { error } = await supabase.from('files').insert({
        organization_id: currentOrganization.id,
        name: formData.name,
        file_url: fileUrl,
        file_type: fileType,
        file_size: fileSize,
        folder: formData.folder,
        uploaded_by: user?.id || null,
      });

      if (error) throw error;

      onFileUploaded();
      onOpenChange(false);
      setFormData({
        name: '',
        file_url: '',
        folder: 'root',
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Dosya yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Dosya Yükle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file">Dosya Seç</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Dosya seçtikten sonra URL alanına dosyanın erişim linkini girebilirsiniz
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Dosya Adı *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="dosya.pdf"
              />
            </div>
            <div>
              <Label htmlFor="folder">Klasör</Label>
              <Select value={formData.folder} onValueChange={(value) => setFormData({ ...formData, folder: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Ana Dizin</SelectItem>
                  <SelectItem value="Sunumlar">Sunumlar</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Görseller">Görseller</SelectItem>
                  <SelectItem value="Raporlar">Raporlar</SelectItem>
                  <SelectItem value="Dökümanlar">Dökümanlar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="file_url">Dosya URL *</Label>
            <Input
              id="file_url"
              type="url"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              required
              placeholder="https://example.com/file.pdf"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Dosyanın erişilebilir URL adresini girin (Google Drive, Dropbox, vb.)
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-2">
              <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Dosya Yükleme Notu</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Şu an için dosyaları URL ile kaydediyoruz. Gelecekte Supabase Storage entegrasyonu eklenecek.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Yükleniyor...' : 'Dosya Ekle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

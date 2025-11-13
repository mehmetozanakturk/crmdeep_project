'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useBrands } from '@/lib/hooks/useBrands';
import { createClient } from '@/lib/supabase/client';

interface AddQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteAdded: () => void;
}

export function AddQuoteModal({ open, onOpenChange, onQuoteAdded }: AddQuoteModalProps) {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    quote_number: '',
    client_name: '',
    title: '',
    amount: '',
    status: 'draft',
    valid_until: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();

      const { error } = await supabase.from('quotes').insert({
        organization_id: currentOrganization.id,
        brand_id: currentBrand?.id || null,
        quote_number: formData.quote_number,
        client_name: formData.client_name,
        title: formData.title,
        amount: parseFloat(formData.amount),
        status: formData.status,
        valid_until: formData.valid_until,
        notes: formData.notes,
      });

      if (error) throw error;

      onQuoteAdded();
      onOpenChange(false);
      setFormData({
        quote_number: '',
        client_name: '',
        title: '',
        amount: '',
        status: 'draft',
        valid_until: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding quote:', error);
      alert('Teklif eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yeni Teklif</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quote_number">Teklif Numarası *</Label>
              <Input
                id="quote_number"
                value={formData.quote_number}
                onChange={(e) => setFormData({ ...formData, quote_number: e.target.value })}
                required
                placeholder="QUO-2024-001"
              />
            </div>
            <div>
              <Label htmlFor="client_name">Müşteri Adı *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Teklif Başlığı *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Tutar (₺) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Durum</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="sent">Gönderildi</SelectItem>
                  <SelectItem value="accepted">Kabul Edildi</SelectItem>
                  <SelectItem value="rejected">Reddedildi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="valid_until">Geçerlilik Tarihi</Label>
            <Input
              id="valid_until"
              type="date"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Ekleniyor...' : 'Teklif Ekle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

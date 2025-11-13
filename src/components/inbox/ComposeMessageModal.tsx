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
import { createClient } from '@/lib/supabase/client';

interface ComposeMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMessageSent: () => void;
}

export function ComposeMessageModal({ open, onOpenChange, onMessageSent }: ComposeMessageModalProps) {
  const { currentOrganization } = useOrganization();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    to_email: '',
    from_email: '',
    subject: '',
    body: '',
    message_type: 'email',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();

      const { error } = await supabase.from('inbox_messages').insert({
        organization_id: currentOrganization.id,
        to_email: formData.to_email,
        from_email: formData.from_email,
        subject: formData.subject,
        body: formData.body,
        message_type: formData.message_type,
        status: 'read', // Messages we send are marked as read
      });

      if (error) throw error;

      onMessageSent();
      onOpenChange(false);
      setFormData({
        to_email: '',
        from_email: '',
        subject: '',
        body: '',
        message_type: 'email',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Mesaj gönderilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yeni Mesaj</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from_email">Gönderen *</Label>
              <Input
                id="from_email"
                type="email"
                value={formData.from_email}
                onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                required
                placeholder="ornek@sirket.com"
              />
            </div>
            <div>
              <Label htmlFor="to_email">Alıcı *</Label>
              <Input
                id="to_email"
                type="email"
                value={formData.to_email}
                onChange={(e) => setFormData({ ...formData, to_email: e.target.value })}
                required
                placeholder="musteri@ornek.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">Konu *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                placeholder="Mesaj konusu"
              />
            </div>
            <div>
              <Label htmlFor="message_type">Mesaj Tipi</Label>
              <Select value={formData.message_type} onValueChange={(value) => setFormData({ ...formData, message_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">E-posta</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="body">Mesaj *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              required
              placeholder="Mesajınızı buraya yazın..."
              rows={8}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

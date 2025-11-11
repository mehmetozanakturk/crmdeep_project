'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: { name: string; initials: string; color: string };
  dueDate: string;
  project: string;
  tags: string[];
  attachments: number;
  comments: number;
}

export function AddTaskModal({ open, onOpenChange, onTaskAdded }: { open: boolean; onOpenChange: (open: boolean) => void; onTaskAdded: (task: Task) => void }) {
  const [formData, setFormData] = useState({ title: '', description: '', status: 'todo', priority: 'medium', assignee: '', dueDate: '', project: '', tags: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: formData.status as Task['status'],
      priority: formData.priority as Task['priority'],
      assignee: { name: formData.assignee, initials: formData.assignee.split(' ').map(n => n[0]).join(''), color: '#3B82F6' },
      dueDate: formData.dueDate,
      project: formData.project,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      attachments: 0,
      comments: 0,
    };
    onTaskAdded(newTask);
    setFormData({ title: '', description: '', status: 'todo', priority: 'medium', assignee: '', dueDate: '', project: '', tags: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Yeni Görev Ekle</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Başlık</Label><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
          <div><Label>Açıklama</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Durum</Label><Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todo">Yapılacak</SelectItem><SelectItem value="in-progress">Devam Ediyor</SelectItem><SelectItem value="review">İncelemede</SelectItem><SelectItem value="done">Tamamlandı</SelectItem></SelectContent></Select></div>
            <div><Label>Öncelik</Label><Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Düşük</SelectItem><SelectItem value="medium">Orta</SelectItem><SelectItem value="high">Yüksek</SelectItem></SelectContent></Select></div>
          </div>
          <div><Label>Sorumlu</Label><Input value={formData.assignee} onChange={(e) => setFormData({...formData, assignee: e.target.value})} /></div>
          <div><Label>Bitiş Tarihi</Label><Input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} /></div>
          <div><Label>Proje</Label><Input value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} /></div>
          <div><Label>Etiketler</Label><Input value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="Virgülle ayırın" /></div>
          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>İptal</Button><Button type="submit">Ekle</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, StickyNote, Search, Pin, Trash2, Edit } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
  tags: string[];
}

const DEMO_NOTES: Note[] = [
  {
    id: '1',
    title: 'TechCorp Toplantı Notları',
    content: 'Yeni proje için budget onaylandı. Q2\'de başlanacak. Ekip 5 kişi olacak.',
    color: 'bg-blue-100 dark:bg-blue-900/30',
    pinned: true,
    createdAt: '2024-02-15',
    tags: ['Toplantı', 'TechCorp'],
  },
  {
    id: '2',
    title: 'Proje Fikirleri',
    content: 'Mobile app geliştirme, AI entegrasyonu, real-time dashboard',
    color: 'bg-green-100 dark:bg-green-900/30',
    pinned: true,
    createdAt: '2024-02-14',
    tags: ['Fikir', 'Proje'],
  },
  {
    id: '3',
    title: 'Yapılacaklar',
    content: 'Email şablonlarını güncelle, raporları hazırla, client sunumu yap',
    color: 'bg-yellow-100 dark:bg-yellow-900/30',
    pinned: false,
    createdAt: '2024-02-13',
    tags: ['Todo'],
  },
  {
    id: '4',
    title: 'Önemli Linkler',
    content: 'Design docs, API documentation, Project roadmap',
    color: 'bg-purple-100 dark:bg-purple-900/30',
    pinned: false,
    createdAt: '2024-02-12',
    tags: ['Referans'],
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(DEMO_NOTES);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const regularNotes = filteredNotes.filter((n) => !n.pinned);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Notlar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Kişisel notlarınızı yönetin</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Not
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <Input
          type="text"
          placeholder="Not ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-neutral-600 dark:text-neutral-400">SABİTLENMİŞ</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pinnedNotes.map((note) => (
              <Card key={note.id} className={`${note.color} border-neutral-200 dark:border-neutral-700`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Pin className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">{note.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{note.createdAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {regularNotes.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-neutral-600 dark:text-neutral-400">DİĞER NOTLAR</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {regularNotes.map((note) => (
              <Card key={note.id} className={`${note.color} border-neutral-200 dark:border-neutral-700`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Pin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">{note.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{note.createdAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

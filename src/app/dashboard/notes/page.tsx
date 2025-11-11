'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, StickyNote, Search, Pin, Trash2, Edit, MoreVertical } from 'lucide-react';
import { AddNoteModal } from '@/components/notes/AddNoteModal';
import { EditNoteModal } from '@/components/notes/EditNoteModal';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'crmdeep_notes';

const DEMO_NOTES: Note[] = [
  {
    id: '1',
    title: 'TechCorp Toplantı Notları',
    content: 'Yeni proje için budget onaylandı. Q2\'de başlanacak. Ekip 5 kişi olacak.',
    color: 'bg-blue-100 dark:bg-blue-900/30',
    pinned: true,
    createdAt: '2024-02-15',
    tags: ['Toplantı', 'TechCorp'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Proje Fikirleri',
    content: 'Mobile app geliştirme, AI entegrasyonu, real-time dashboard',
    color: 'bg-green-100 dark:bg-green-900/30',
    pinned: true,
    createdAt: '2024-02-14',
    tags: ['Fikir', 'Proje'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Yapılacaklar',
    content: 'Email şablonlarını güncelle, raporları hazırla, client sunumu yap',
    color: 'bg-yellow-100 dark:bg-yellow-900/30',
    pinned: false,
    createdAt: '2024-02-13',
    tags: ['Todo'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Önemli Linkler',
    content: 'Design docs, API documentation, Project roadmap',
    color: 'bg-purple-100 dark:bg-purple-900/30',
    pinned: false,
    createdAt: '2024-02-12',
    tags: ['Referans'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setNotes(JSON.parse(stored));
    } else {
      setNotes(DEMO_NOTES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_NOTES));
    }
  }, []);

  // Save to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes]);

  const handleNoteAdded = (newNote: Note) => {
    setNotes([newNote, ...notes]);
  };

  const handleNoteUpdated = (updatedNote: Note) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      setNotes(notes.filter(n => n.id !== noteId));
    }
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(notes.map(n =>
      n.id === noteId
        ? { ...n, pinned: !n.pinned, updated_at: new Date().toISOString() }
        : n
    ));
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setEditModalOpen(true);
  };

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
        <Button onClick={() => setAddModalOpen(true)}>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleTogglePin(note.id)}
                      >
                        <Pin className="h-4 w-4 fill-current" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditNote(note)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-danger-600 dark:text-danger-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleTogglePin(note.id)}
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditNote(note)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-danger-600 dark:text-danger-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      {/* Add Note Modal */}
      <AddNoteModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onNoteAdded={handleNoteAdded}
      />

      {/* Edit Note Modal */}
      {selectedNote && (
        <EditNoteModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          note={selectedNote}
          onNoteUpdated={handleNoteUpdated}
        />
      )}
    </div>
  );
}

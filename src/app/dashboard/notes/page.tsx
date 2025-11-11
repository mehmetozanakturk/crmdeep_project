'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
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
import {
  Plus,
  StickyNote,
  Search,
  Pin,
  Trash2,
  Edit,
  MoreVertical,
  Filter,
  ArrowUpDown,
  Briefcase,
  User,
  FolderKanban,
  Lightbulb,
  Users,
  MoreHorizontal,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddNoteModal } from '@/components/notes/AddNoteModal';
import { EditNoteModal } from '@/components/notes/EditNoteModal';
import { NoteDetailModal } from '@/components/notes/NoteDetailModal';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
  tags: string[];
  category: 'work' | 'personal' | 'project' | 'idea' | 'meeting' | 'other';
  taskId?: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'crmdeep_notes';

const getCategoryInfo = (category: Note['category']) => {
  switch (category) {
    case 'work':
      return { label: 'İş', color: 'text-blue-600 dark:text-blue-400' };
    case 'personal':
      return { label: 'Kişisel', color: 'text-green-600 dark:text-green-400' };
    case 'project':
      return { label: 'Proje', color: 'text-purple-600 dark:text-purple-400' };
    case 'idea':
      return { label: 'Fikir', color: 'text-yellow-600 dark:text-yellow-400' };
    case 'meeting':
      return { label: 'Toplantı', color: 'text-orange-600 dark:text-orange-400' };
    case 'other':
    default:
      return { label: 'Diğer', color: 'text-neutral-600 dark:text-neutral-400' };
  }
};

const CategoryIcon = ({ category, className }: { category: Note['category']; className?: string }) => {
  const iconProps = { className };

  switch (category) {
    case 'work':
      return <Briefcase {...iconProps} />;
    case 'personal':
      return <User {...iconProps} />;
    case 'project':
      return <FolderKanban {...iconProps} />;
    case 'idea':
      return <Lightbulb {...iconProps} />;
    case 'meeting':
      return <Users {...iconProps} />;
    case 'other':
    default:
      return <MoreHorizontal {...iconProps} />;
  }
};

const DEMO_NOTES: Note[] = [
  {
    id: '1',
    title: 'TechCorp Toplantı Notları',
    content: 'Yeni proje için budget onaylandı. Q2\'de başlanacak. Ekip 5 kişi olacak.',
    color: 'bg-blue-100 dark:bg-blue-900/30',
    pinned: true,
    createdAt: '2024-02-15',
    tags: ['Toplantı', 'TechCorp'],
    category: 'meeting',
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
    category: 'idea',
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
    category: 'work',
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
    category: 'project',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'title'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const loadedNotes = JSON.parse(stored);
      // Migrate notes without category field
      const migratedNotes = loadedNotes.map((note: any) => ({
        ...note,
        category: note.category || 'other',
        created_at: note.created_at || note.createdAt || new Date().toISOString(),
        updated_at: note.updated_at || note.createdAt || new Date().toISOString(),
      }));
      setNotes(migratedNotes);
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
    setDetailModalOpen(false);
    setEditModalOpen(true);
  };

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setDetailModalOpen(true);
  };

  // Filter by category
  const filterByCategory = (notes: Note[]) => {
    if (categoryFilter === 'all') return notes;
    return notes.filter((note) => note.category === categoryFilter);
  };

  // Filter by date
  const filterByDate = (notes: Note[]) => {
    if (dateFilter === 'all') return notes;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateFilter) {
      case 'today':
        return notes.filter((note) => {
          const noteDate = new Date(note.created_at);
          const noteDateOnly = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());
          return noteDateOnly.getTime() === today.getTime();
        });
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return notes.filter((note) => new Date(note.created_at) >= weekAgo);
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return notes.filter((note) => new Date(note.created_at) >= monthAgo);
      default:
        return notes;
    }
  };

  // Sort notes
  const sortNotes = (notes: Note[]) => {
    return [...notes].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title, 'tr');
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // Apply all filters
  const filteredNotes = sortNotes(
    filterByDate(
      filterByCategory(
        notes.filter((note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
    )
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

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            type="text"
            placeholder="Not ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            <SelectItem value="work">İş</SelectItem>
            <SelectItem value="personal">Kişisel</SelectItem>
            <SelectItem value="project">Proje</SelectItem>
            <SelectItem value="idea">Fikir</SelectItem>
            <SelectItem value="meeting">Toplantı</SelectItem>
            <SelectItem value="other">Diğer</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tarih" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Zamanlar</SelectItem>
            <SelectItem value="today">Bugün</SelectItem>
            <SelectItem value="week">Son 7 Gün</SelectItem>
            <SelectItem value="month">Son 30 Gün</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sırala" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Son Güncelleme</SelectItem>
            <SelectItem value="created">Oluşturulma Tarihi</SelectItem>
            <SelectItem value="title">Başlık</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          title={sortOrder === 'asc' ? 'Artan' : 'Azalan'}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-neutral-600 dark:text-neutral-400">SABİTLENMİŞ</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pinnedNotes.map((note) => (
              <Card
                key={note.id}
                className={`${note.color} border-neutral-200 dark:border-neutral-700 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]`}
                onClick={() => handleViewNote(note)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(note.id);
                        }}
                      >
                        <Pin className="h-4 w-4 fill-current" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => e.stopPropagation()}
                          >
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
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <CategoryIcon
                        category={note.category}
                        className={`h-3 w-3 ${getCategoryInfo(note.category).color}`}
                      />
                      <span className="ml-1">{getCategoryInfo(note.category).label}</span>
                    </Badge>
                    {note.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {new Date(note.created_at).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
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
              <Card
                key={note.id}
                className={`${note.color} border-neutral-200 dark:border-neutral-700 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]`}
                onClick={() => handleViewNote(note)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(note.id);
                        }}
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => e.stopPropagation()}
                          >
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
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <CategoryIcon
                        category={note.category}
                        className={`h-3 w-3 ${getCategoryInfo(note.category).color}`}
                      />
                      <span className="ml-1">{getCategoryInfo(note.category).label}</span>
                    </Badge>
                    {note.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {new Date(note.created_at).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
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

      {/* Note Detail Modal */}
      {selectedNote && (
        <NoteDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          note={selectedNote}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          onTogglePin={handleTogglePin}
        />
      )}

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

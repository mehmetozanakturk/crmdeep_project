'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Briefcase, Search, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Workspace {
  id: string;
  name: string;
  domain: string;
  color: string;
  description?: string;
  created_at: string;
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('');

  useEffect(() => {
    loadWorkspaces();

    const active = localStorage.getItem('crmdeep_active_workspace');
    if (active) setActiveWorkspaceId(active);
  }, []);

  const loadWorkspaces = () => {
    const stored = localStorage.getItem('crmdeep_workspaces');
    if (stored) {
      setWorkspaces(JSON.parse(stored));
    }
  };

  const filteredWorkspaces = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (workspaces.length === 1) {
      alert('En az bir workspace olmalı!');
      return;
    }
    if (id === activeWorkspaceId) {
      alert('Aktif workspace silinemez! Önce başka bir workspace\'e geçin.');
      return;
    }
    if (confirm('Bu workspace\'i silmek istediğinize emin misiniz?')) {
      const updated = workspaces.filter(w => w.id !== id);
      setWorkspaces(updated);
      localStorage.setItem('crmdeep_workspaces', JSON.stringify(updated));
    }
  };

  const switchWorkspace = (id: string) => {
    localStorage.setItem('crmdeep_active_workspace', id);
    window.dispatchEvent(new Event('workspaceChanged'));
    window.location.href = '/dashboard';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Workspace Yönetimi
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Markalarınızı ve workspace ayarlarını yönetin
          </p>
        </div>
        <Button onClick={() => alert('Workspace ekleme modali yakında!')}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Workspace
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
        <Input
          type="text"
          placeholder="Workspace ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Workspaces Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className="border-neutral-200 dark:border-neutral-700 transition-all hover:shadow-md"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: workspace.color }}
                  >
                    {workspace.name[0]}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {workspace.name}
                      {workspace.id === activeWorkspaceId && (
                        <Badge variant="default" className="text-xs">
                          Aktif
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{workspace.domain}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {workspace.id !== activeWorkspaceId && (
                      <>
                        <DropdownMenuItem onClick={() => switchWorkspace(workspace.id)}>
                          <Briefcase className="mr-2 h-4 w-4" />
                          Workspace'e Geç
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => alert('Düzenleme yakında!')}>
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(workspace.id)}
                      className="text-danger-600 dark:text-danger-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {workspace.description || 'Workspace açıklaması'}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>Oluşturulma: {new Date(workspace.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkspaces.length === 0 && (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center">
            <Search className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Workspace bulunamadı
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery ? `"${searchQuery}" için sonuç bulunamadı` : 'Henüz workspace yok'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

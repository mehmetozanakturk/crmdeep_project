'use client';

import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { getAllTags, getTagColor, type Tag } from '@/lib/utils/tags';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  category?: 'company' | 'contact' | 'common';
  placeholder?: string;
  maxTags?: number;
}

export function TagSelector({
  selectedTags,
  onChange,
  category = 'common',
  placeholder = 'Etiket ekle...',
  maxTags,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tags = getAllTags(category);
    setAvailableTags(tags);
  }, [category]);

  // Filtrele
  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedTags.includes(tag.name)
  );

  // Etiket ekle
  const handleAddTag = (tagName: string) => {
    if (!tagName.trim()) return;
    if (selectedTags.includes(tagName)) return;
    if (maxTags && selectedTags.length >= maxTags) return;

    onChange([...selectedTags, tagName]);
    setSearchQuery('');
  };

  // Etiket çıkar
  const handleRemoveTag = (tagName: string) => {
    onChange(selectedTags.filter(t => t !== tagName));
  };

  // Enter tuşu ile ekleme
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      handleAddTag(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-2">
      {/* Seçili Etiketler */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tagName) => (
            <Badge
              key={tagName}
              variant="secondary"
              className={`${getTagColor(tagName)} pr-1 pl-3 py-1`}
            >
              {tagName}
              <button
                type="button"
                onClick={() => handleRemoveTag(tagName)}
                className="ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Etiket Seçici */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={maxTags ? selectedTags.length >= maxTags : false}
          >
            <TagIcon className="mr-2 h-4 w-4" />
            {maxTags && selectedTags.length >= maxTags
              ? `Maksimum ${maxTags} etiket eklenebilir`
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-2 border-b border-neutral-200 dark:border-neutral-700">
            <Input
              ref={inputRef}
              placeholder="Etiket ara veya yeni ekle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9"
            />
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {/* Yeni Etiket Oluştur */}
            {searchQuery.trim() && !filteredTags.some(t => t.name.toLowerCase() === searchQuery.toLowerCase()) && (
              <button
                type="button"
                onClick={() => {
                  handleAddTag(searchQuery.trim());
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
              >
                <Plus className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <span className="font-medium text-primary-600 dark:text-primary-400">
                  "{searchQuery}" etiketini oluştur
                </span>
              </button>
            )}

            {/* Mevcut Etiketler */}
            {filteredTags.length > 0 ? (
              <div className="space-y-1">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      handleAddTag(tag.name);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                  >
                    <Badge variant="secondary" className={`${tag.color} text-xs`}>
                      {tag.name}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : searchQuery && (
              <div className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Etiket bulunamadı
              </div>
            )}

            {/* Popüler Etiketler (arama yoksa) */}
            {!searchQuery && filteredTags.length > 0 && (
              <div className="pt-2 mt-2 border-t border-neutral-200 dark:border-neutral-700">
                <p className="px-3 py-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  Popüler Etiketler
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {maxTags && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {selectedTags.length} / {maxTags} etiket seçildi
        </p>
      )}
    </div>
  );
}

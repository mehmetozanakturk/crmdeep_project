'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Preset tags by category
export const PRESET_TAGS = {
  contacts: [
    { label: 'VIP', value: 'vip', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'Lead', value: 'lead', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Müşteri', value: 'customer', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { label: 'Karar Verici', value: 'decision-maker', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'Etkileyici', value: 'influencer', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
    { label: 'Potansiyel', value: 'potential', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  ],
  companies: [
    { label: 'Kurumsal', value: 'enterprise', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { label: 'KOBİ', value: 'sme', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Startup', value: 'startup', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { label: 'Partner', value: 'partner', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'Tedarikçi', value: 'supplier', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'Rakip', value: 'competitor', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  ],
  tasks: [
    { label: 'Acil', value: 'urgent', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    { label: 'Önemli', value: 'important', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'Bug', value: 'bug', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    { label: 'Feature', value: 'feature', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Geliştirme', value: 'development', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { label: 'Tasarım', value: 'design', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
    { label: 'Test', value: 'test', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  ],
  notes: [
    { label: 'Kişisel', value: 'personal', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'İş', value: 'work', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { label: 'Fikir', value: 'idea', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { label: 'Toplantı', value: 'meeting', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'Önemli', value: 'important', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  ],
  projects: [
    { label: 'Web', value: 'web', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Mobile', value: 'mobile', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { label: 'Backend', value: 'backend', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'Frontend', value: 'frontend', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
    { label: 'Full Stack', value: 'fullstack', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  ],
  general: [
    { label: 'Yüksek Öncelik', value: 'high-priority', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    { label: 'Orta Öncelik', value: 'medium-priority', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'Düşük Öncelik', value: 'low-priority', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  ],
};

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  category?: keyof typeof PRESET_TAGS;
  placeholder?: string;
  className?: string;
}

export function TagSelector({
  selectedTags = [],
  onChange,
  category = 'general',
  placeholder = 'Etiket ekle...',
  className,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const presetTags = PRESET_TAGS[category] || PRESET_TAGS.general;

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      onChange([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const getTagColor = (tag: string) => {
    const preset = presetTags.find((p) => p.value === tag || p.label === tag);
    return preset?.color || 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn('flex items-center gap-1 px-2 py-1', getTagColor(tag))}
            >
              <span className="text-xs font-medium">{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add Tag Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start text-left font-normal"
          >
            <Plus className="mr-2 h-4 w-4" />
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-3">
            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Özel etiket yaz..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddCustomTag}
                disabled={!customTag.trim()}
              >
                Ekle
              </Button>
            </div>

            {/* Preset Tags */}
            <div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                Hazır Etiketler
              </p>
              <div className="flex flex-wrap gap-2">
                {presetTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.value) || selectedTags.includes(tag.label);
                  return (
                    <button
                      key={tag.value}
                      type="button"
                      onClick={() => handleAddTag(tag.label)}
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors',
                        tag.color,
                        isSelected && 'ring-2 ring-primary-500 ring-offset-2'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

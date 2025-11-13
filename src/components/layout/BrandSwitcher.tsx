'use client';

import { Check, ChevronsUpDown, Store, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBrands } from '@/lib/hooks/useBrands';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function BrandSwitcher() {
  const { brands, currentBrand, isLoading, switchBrand, clearBrandFilter } = useBrands();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="hidden sm:block">
          <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
        </div>
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'justify-between gap-2 px-3 border-neutral-300 dark:border-neutral-600',
            !currentBrand && 'text-neutral-500'
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-6 w-6">
              <AvatarFallback
                className="text-xs"
                style={{
                  backgroundColor: currentBrand?.primary_color + '20' || '#6366f120',
                  color: currentBrand?.primary_color || '#6366f1',
                }}
              >
                {currentBrand
                  ? currentBrand.name.substring(0, 2).toUpperCase()
                  : <Store className="h-3 w-3" />}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-block truncate max-w-[120px]">
              {currentBrand ? currentBrand.name : 'Tüm Markalar'}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        <DropdownMenuLabel>Marka Seç</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Show All Brands Option */}
        <DropdownMenuItem
          onClick={clearBrandFilter}
          className={cn(!currentBrand && 'bg-neutral-100 dark:bg-neutral-800')}
        >
          <Store className="mr-2 h-4 w-4" />
          <span>Tüm Markalar</span>
          {!currentBrand && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Brand List */}
        {brands.map((brand) => (
          <DropdownMenuItem
            key={brand.id}
            onClick={() => switchBrand(brand.id)}
            className={cn(
              'cursor-pointer',
              currentBrand?.id === brand.id && 'bg-neutral-100 dark:bg-neutral-800'
            )}
          >
            <Avatar className="mr-2 h-6 w-6">
              <AvatarFallback
                className="text-xs"
                style={{
                  backgroundColor: brand.primary_color + '20',
                  color: brand.primary_color,
                }}
              >
                {brand.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate">{brand.name}</span>
              {brand.website_url && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {brand.website_url}
                </span>
              )}
            </div>
            {currentBrand?.id === brand.id && <Check className="ml-2 h-4 w-4 shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

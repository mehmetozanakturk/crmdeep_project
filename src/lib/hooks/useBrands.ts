'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useOrganization } from './useOrganization';

export interface Brand {
  id: string;
  organization_id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  primary_color: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useBrands() {
  const { currentOrganization } = useOrganization();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadBrands = useCallback(async () => {
    if (!currentOrganization) return;

    try {
      setIsLoading(true);
      const supabase = createClient();

      const { data, error: brandsError } = await supabase
        .from('brands')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: true });

      if (brandsError) {
        console.error('Error loading brands:', brandsError);
        setError(brandsError as Error);
        return;
      }

      setBrands(data || []);

      // Set current brand from localStorage or first brand
      const storedBrandId = localStorage.getItem('currentBrandId');
      let selectedBrand = data && data.length > 0 ? data[0] : null;

      if (storedBrandId && data) {
        const found = data.find((b: Brand) => b.id === storedBrandId);
        if (found) {
          selectedBrand = found;
        }
      }

      setCurrentBrand(selectedBrand);
    } catch (err) {
      console.error('Error in loadBrands:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [currentOrganization]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const switchBrand = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    if (brand) {
      setCurrentBrand(brand);
      localStorage.setItem('currentBrandId', brandId);
      // Trigger a page refresh to reload data for new brand
      window.location.reload();
    }
  };

  const clearBrandFilter = () => {
    setCurrentBrand(null);
    localStorage.removeItem('currentBrandId');
    window.location.reload();
  };

  return {
    brands,
    currentBrand,
    isLoading,
    error,
    switchBrand,
    clearBrandFilter,
    refetch: loadBrands,
  };
}

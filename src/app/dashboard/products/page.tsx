'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, DollarSign, TrendingUp, Trash2, Edit } from 'lucide-react';
import { AddProductModal } from '@/components/products/AddProductModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useBrands } from '@/lib/hooks/useBrands';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  category: string | null;
  sku: string | null;
  stock_quantity: number | null;
  unit: string;
  is_active: boolean;
}

export default function ProductsPage() {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [products, setProducts] = useState<Product[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [currentOrganization, currentBrand]);

  const loadProducts = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('products')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (currentBrand) {
        query = query.eq('brand_id', currentBrand.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ürün silinirken hata oluştu');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const totalProducts = products.length;
  const averagePrice = products.length > 0
    ? products.reduce((sum, product) => sum + product.price, 0) / products.length
    : 0;
  const totalValue = products.reduce((sum, product) => {
    const quantity = product.stock_quantity || 0;
    return sum + (product.price * quantity);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Ürünler & Hizmetler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Fiyat kataloğu</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Yeni Ürün</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Ürün</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Değer</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{formatCurrency(totalValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Ort. Fiyat</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(averagePrice)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Ürünler yükleniyor...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Henüz ürün yok</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Yeni ürün eklemek için yukarıdaki butonu kullanın</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                      <Package className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{product.name}</h3>
                      {product.category && (
                        <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                      )}
                      {product.description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Düzenle</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-danger-600">
                        <Trash2 className="mr-2 h-4 w-4" />Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <div>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(product.price)}</p>
                    {product.stock_quantity !== null && (
                      <p className="text-xs text-neutral-500">Stok: {product.stock_quantity} {product.unit}</p>
                    )}
                    {product.sku && (
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">SKU: {product.sku}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddProductModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onProductAdded={loadProducts}
      />
    </div>
  );
}

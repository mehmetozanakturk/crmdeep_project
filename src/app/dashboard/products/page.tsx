'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, DollarSign, TrendingUp } from 'lucide-react';

const DEMO_PRODUCTS = [
  { id: '1', name: 'Website Development', category: 'Services', price: '₺25,000', stock: null, sales: 12 },
  { id: '2', name: 'SEO Package - Premium', category: 'Services', price: '₺8,500', stock: null, sales: 24 },
  { id: '3', name: 'Hosting - Business', category: 'Subscriptions', price: '₺1,499', stock: null, sales: 45 },
  { id: '4', name: 'Logo Design', category: 'Design', price: '₺3,500', stock: null, sales: 18 },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Ürünler & Hizmetler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Fiyat kataloğu</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Ürün</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Ürün</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{DEMO_PRODUCTS.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Satış</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">99</p>
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
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">₺9,625</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DEMO_PRODUCTS.map((product) => (
          <Card key={product.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                    <Package className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{product.name}</h3>
                    <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{product.price}</p>
                  <p className="text-xs text-neutral-500">{product.sales} satış</p>
                </div>
                <Button variant="outline" size="sm">Düzenle</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

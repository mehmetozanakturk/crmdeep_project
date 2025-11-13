'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, BarChart3, Download, Calendar, TrendingUp, Clock, Eye, Edit2, Trash2, Share2 } from 'lucide-react';
import { ReportBuilder } from '@/components/reports/ReportBuilder';
import {
  loadCustomReports,
  createCustomReport,
  updateCustomReport,
  deleteCustomReport,
  getReportStats,
  type CustomReport,
  type ReportConfig
} from '@/lib/api/reports';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function ReportsPage() {
  const { currentOrganization } = useOrganization();
  const [reports, setReports] = useState<CustomReport[]>([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    reportsThisMonth: 0,
    scheduledReports: 0,
    totalViews: 0,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<CustomReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentOrganization) {
      loadData();
    }
  }, [currentOrganization]);

  const loadData = async () => {
    if (!currentOrganization) return;

    setIsLoading(true);
    const [reportsData, statsData] = await Promise.all([
      loadCustomReports(currentOrganization.id),
      getReportStats(currentOrganization.id),
    ]);
    setReports(reportsData);
    setStats(statsData);
    setIsLoading(false);
  };

  const handleSaveReport = async (reportConfig: ReportConfig) => {
    if (!currentOrganization) return;

    const reportName = prompt(
      editingReport ? 'Rapor adını düzenleyin:' : 'Rapor adını girin:',
      editingReport?.name || ''
    );

    if (!reportName) return;

    if (editingReport) {
      // Update existing report
      await updateCustomReport({
        id: editingReport.id,
        name: reportName,
        config: reportConfig,
      });
    } else {
      // Create new report
      await createCustomReport(currentOrganization.id, {
        name: reportName,
        config: reportConfig,
      });
    }

    setIsCreateDialogOpen(false);
    setEditingReport(null);
    await loadData();
  };

  const handleEditReport = (report: CustomReport) => {
    setEditingReport(report);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm('Bu raporu silmek istediğinizden emin misiniz?')) return;

    const success = await deleteCustomReport(id);
    if (success) {
      await loadData();
    }
  };

  const handleExport = async (report: CustomReport, format: 'pdf' | 'csv' | 'excel') => {
    // TODO: Implement export functionality
    console.log('Exporting report:', report.name, 'as', format);
    alert(`${format.toUpperCase()} export will be implemented soon!`);
  };

  const getChartIcon = (chartType: string) => {
    // You can customize icons based on chart type
    return <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />;
  };

  const getDataSourceLabel = (dataSource: string) => {
    const labels: Record<string, string> = {
      deals: 'Satışlar',
      contacts: 'Kişiler',
      companies: 'Firmalar',
      campaigns: 'Kampanyalar',
      tasks: 'Görevler',
      projects: 'Projeler',
    };
    return labels[dataSource] || dataSource;
  };

  const getMetricLabel = (metric: string) => {
    const labels: Record<string, string> = {
      revenue: 'Gelir',
      count: 'Sayı',
      average: 'Ortalama',
      'conversion-rate': 'Dönüşüm Oranı',
    };
    return labels[metric] || metric;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Raporlar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Detaylı analiz ve özel raporlama</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Rapor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Rapor</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stats.totalReports}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bu Ay</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
                  {stats.reportsThisMonth}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Zamanlanmış</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.scheduledReports}
                </p>
              </div>
              <Clock className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Görüntüleme</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stats.totalViews}
                </p>
              </div>
              <Eye className="h-8 w-8 text-neutral-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400">Raporlar yükleniyor...</p>
        </div>
      ) : reports.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Henüz rapor yok
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              İlk özel raporunuzu oluşturun ve verilerinizi analiz edin
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Rapor Oluştur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.id} className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3 h-fit">
                      {getChartIcon(report.config.chartType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {report.name}
                        </h3>
                        {report.is_public && (
                          <Share2 className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                        )}
                      </div>
                      {report.description && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                          {report.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary">
                          {getDataSourceLabel(report.config.dataSource)}
                        </Badge>
                        <Badge variant="outline">
                          {getMetricLabel(report.config.metric)}
                        </Badge>
                        <Badge variant="outline">{report.config.dateRange}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {report.view_count}
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(report.created_at), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </span>
                        {report.is_scheduled && (
                          <Badge variant="outline" className="text-xs">
                            {report.schedule_frequency}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditReport(report)}
                      title="Düzenle"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExport(report, 'pdf')}
                      title="İndir"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReport(report.id)}
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4 text-error-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Report Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingReport ? 'Raporu Düzenle' : 'Yeni Rapor Oluştur'}
            </DialogTitle>
            <DialogDescription>
              Özel raporunuzu yapılandırın ve verilerinizi görselleştirin
            </DialogDescription>
          </DialogHeader>
          <ReportBuilder
            onSave={handleSaveReport}
            onCancel={() => {
              setIsCreateDialogOpen(false);
              setEditingReport(null);
            }}
            initialData={editingReport?.config}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

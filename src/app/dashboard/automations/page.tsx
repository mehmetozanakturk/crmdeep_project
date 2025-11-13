'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Workflow, Zap, Clock, CheckCircle2, Edit2, Trash2, Play, Pause } from 'lucide-react';
import { WorkflowBuilder } from '@/components/automation/WorkflowBuilder';

const DEMO_AUTOMATIONS = [
  {
    id: '1',
    name: 'Yeni Lead Hoşgeldin Emaili',
    description: 'Automatically send welcome email when a new lead is created',
    trigger: 'Lead oluşturulduğunda',
    status: 'active',
    runs: 142,
    successRate: 98,
  },
  {
    id: '2',
    name: 'Fatura Ödeme Hatırlatıcı',
    description: 'Send payment reminder 3 days before due date',
    trigger: 'Vade tarihinden 3 gün önce',
    status: 'active',
    runs: 89,
    successRate: 100,
  },
  {
    id: '3',
    name: 'Proje Tamamlama Bildirimi',
    description: 'Notify team when project reaches 100% completion',
    trigger: 'Proje %100 tamamlandığında',
    status: 'active',
    runs: 24,
    successRate: 95,
  },
  {
    id: '4',
    name: 'İnaktif Müşteri Takibi',
    description: 'Follow up with inactive customers',
    trigger: '30 gün aktivite olmazsa',
    status: 'paused',
    runs: 15,
    successRate: 87,
  },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(DEMO_AUTOMATIONS);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<any>(null);

  const handleSaveWorkflow = (workflowData: any) => {
    console.log('Saving workflow:', workflowData);
    // In real app, this would save to database
    setIsCreateDialogOpen(false);
    setEditingAutomation(null);
    alert('Workflow saved successfully!');
  };

  const handleToggleStatus = (id: string) => {
    setAutomations(
      automations.map((a) =>
        a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
      )
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bu otomasyonu silmek istediğinizden emin misiniz?')) return;
    setAutomations(automations.filter((a) => a.id !== id));
  };

  const activeCount = automations.filter((a) => a.status === 'active').length;
  const pausedCount = automations.filter((a) => a.status === 'paused').length;
  const totalRuns = automations.reduce((sum, a) => sum + a.runs, 0);
  const avgSuccessRate =
    automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Workflow Automation
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Automate your business processes with no-code workflows
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Active</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
                  {activeCount}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Paused</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">
                  {pausedCount}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Runs</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {totalRuns}
                </p>
              </div>
              <Zap className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Success Rate</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
                  {Math.round(avgSuccessRate)}%
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="grid gap-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                    <Workflow className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {automation.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {automation.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-xs text-neutral-500">
                        <span className="font-medium">Trigger:</span> {automation.trigger}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {automation.runs} runs • {automation.successRate}% success
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      automation.status === 'active'
                        ? 'bg-success-100 text-success-700'
                        : 'bg-warning-100 text-warning-700'
                    }
                  >
                    {automation.status === 'active' ? 'Active' : 'Paused'}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(automation.id)}
                      title={automation.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {automation.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingAutomation(automation);
                        setIsCreateDialogOpen(true);
                      }}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(automation.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-error-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Workflow Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAutomation ? 'Edit Workflow' : 'Create New Workflow'}
            </DialogTitle>
            <DialogDescription>
              Build automated workflows with triggers and actions
            </DialogDescription>
          </DialogHeader>
          <WorkflowBuilder
            onSave={handleSaveWorkflow}
            onCancel={() => {
              setIsCreateDialogOpen(false);
              setEditingAutomation(null);
            }}
            initialData={editingAutomation}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

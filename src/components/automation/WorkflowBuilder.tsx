'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Plus,
  X,
  ArrowDown,
  Save,
  Play,
  Settings,
  Mail,
  MessageSquare,
  Bell,
  Database,
  Calendar,
  Users,
  FileText,
  Clock,
  Filter,
} from 'lucide-react';

interface TriggerConfig {
  type: string;
  entity?: string;
  event?: string;
  conditions?: any[];
  schedule?: string;
}

interface ActionConfig {
  id: string;
  type: string;
  entity?: string;
  action?: string;
  params?: Record<string, any>;
  delay?: number;
}

interface WorkflowData {
  name: string;
  description?: string;
  trigger: TriggerConfig;
  actions: ActionConfig[];
  isActive: boolean;
}

const TRIGGERS = [
  { id: 'record-created', name: 'Record Created', icon: Plus, description: 'When a new record is created' },
  { id: 'record-updated', name: 'Record Updated', icon: Settings, description: 'When a record is updated' },
  { id: 'field-changed', name: 'Field Changed', icon: Database, description: 'When a specific field changes' },
  { id: 'schedule', name: 'Schedule', icon: Clock, description: 'Run on a schedule (daily, weekly, etc.)' },
  { id: 'webhook', name: 'Webhook', icon: Zap, description: 'Triggered by external webhook' },
];

const ENTITIES = [
  { id: 'contacts', name: 'Contacts' },
  { id: 'companies', name: 'Companies' },
  { id: 'deals', name: 'Deals' },
  { id: 'projects', name: 'Projects' },
  { id: 'tasks', name: 'Tasks' },
  { id: 'campaigns', name: 'Campaigns' },
];

const ACTIONS = [
  {
    id: 'send-email',
    name: 'Send Email',
    icon: Mail,
    description: 'Send an email notification',
    params: ['to', 'subject', 'body'],
  },
  {
    id: 'send-sms',
    name: 'Send SMS',
    icon: MessageSquare,
    description: 'Send SMS via Twilio',
    params: ['to', 'message'],
  },
  {
    id: 'create-task',
    name: 'Create Task',
    icon: FileText,
    description: 'Create a new task',
    params: ['title', 'assignee', 'due_date'],
  },
  {
    id: 'update-record',
    name: 'Update Record',
    icon: Database,
    description: 'Update a record',
    params: ['entity', 'field', 'value'],
  },
  {
    id: 'send-notification',
    name: 'Send Notification',
    icon: Bell,
    description: 'Send in-app notification',
    params: ['user', 'message'],
  },
  {
    id: 'assign-user',
    name: 'Assign User',
    icon: Users,
    description: 'Assign record to a user',
    params: ['user'],
  },
  {
    id: 'schedule-meeting',
    name: 'Schedule Meeting',
    icon: Calendar,
    description: 'Create a calendar event',
    params: ['attendees', 'date', 'duration'],
  },
  {
    id: 'webhook',
    name: 'Call Webhook',
    icon: Zap,
    description: 'Make HTTP request to external URL',
    params: ['url', 'method', 'body'],
  },
];

interface WorkflowBuilderProps {
  onSave?: (workflow: WorkflowData) => void;
  onCancel?: () => void;
  initialData?: WorkflowData;
}

export function WorkflowBuilder({ onSave, onCancel, initialData }: WorkflowBuilderProps) {
  const [workflowName, setWorkflowName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [trigger, setTrigger] = useState<TriggerConfig>(
    initialData?.trigger || { type: '', conditions: [] }
  );
  const [actions, setActions] = useState<ActionConfig[]>(initialData?.actions || []);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const addAction = () => {
    setActions([
      ...actions,
      {
        id: `action-${Date.now()}`,
        type: '',
        params: {},
      },
    ]);
  };

  const removeAction = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  const updateAction = (id: string, updates: Partial<ActionConfig>) => {
    setActions(actions.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const handleSave = () => {
    if (!workflowName || !trigger.type) {
      alert('Please provide workflow name and trigger');
      return;
    }

    if (actions.length === 0) {
      alert('Please add at least one action');
      return;
    }

    const workflow: WorkflowData = {
      name: workflowName,
      description,
      trigger,
      actions,
      isActive,
    };

    onSave?.(workflow);
  };

  const handleTest = () => {
    alert('Test run will be implemented soon! This will execute the workflow with sample data.');
  };

  return (
    <div className="space-y-6">
      {/* Workflow Info */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Details</CardTitle>
          <CardDescription>Basic information about this automation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              placeholder="e.g., Welcome Email for New Leads"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="What does this workflow do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Trigger Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-2">
              <Zap className="h-5 w-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <CardTitle>Trigger</CardTitle>
              <CardDescription>When should this workflow run?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {TRIGGERS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTrigger({ ...trigger, type: t.id })}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary-500 ${
                    trigger.type === t.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-neutral-600 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">{t.name}</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {t.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Entity Selection for Record Triggers */}
          {(trigger.type === 'record-created' ||
            trigger.type === 'record-updated' ||
            trigger.type === 'field-changed') && (
            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Select value={trigger.entity} onValueChange={(v) => setTrigger({ ...trigger, entity: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {ENTITIES.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Schedule Configuration */}
          {trigger.type === 'schedule' && (
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={trigger.schedule}
                onValueChange={(v) => setTrigger({ ...trigger, schedule: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <ArrowDown className="h-6 w-6 text-neutral-400" />
        </div>

        {actions.map((action, index) => {
          const actionDef = ACTIONS.find((a) => a.id === action.type);
          const ActionIcon = actionDef?.icon || Settings;

          return (
            <div key={action.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2">
                        <ActionIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Action {index + 1}</CardTitle>
                        <CardDescription>What should happen?</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAction(action.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Action Type Selection */}
                  <div className="space-y-2">
                    <Label>Action Type</Label>
                    <Select
                      value={action.type}
                      onValueChange={(v) => updateAction(action.id, { type: v, params: {} })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIONS.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            <div className="flex items-center gap-2">
                              <a.icon className="h-4 w-4" />
                              {a.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Parameters */}
                  {actionDef && actionDef.params.length > 0 && (
                    <div className="space-y-3">
                      {actionDef.params.map((param) => (
                        <div key={param} className="space-y-2">
                          <Label className="capitalize">{param.replace(/_/g, ' ')}</Label>
                          <Input
                            placeholder={`Enter ${param}`}
                            value={action.params?.[param] || ''}
                            onChange={(e) =>
                              updateAction(action.id, {
                                params: { ...action.params, [param]: e.target.value },
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delay */}
                  <div className="space-y-2">
                    <Label>Delay Before Action (Optional)</Label>
                    <Select
                      value={action.delay?.toString() || '0'}
                      onValueChange={(v) => updateAction(action.id, { delay: parseInt(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No Delay</SelectItem>
                        <SelectItem value="60">1 Minute</SelectItem>
                        <SelectItem value="300">5 Minutes</SelectItem>
                        <SelectItem value="900">15 Minutes</SelectItem>
                        <SelectItem value="3600">1 Hour</SelectItem>
                        <SelectItem value="86400">1 Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {index < actions.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <ArrowDown className="h-6 w-6 text-neutral-400" />
                </div>
              )}
            </div>
          );
        })}

        <Button variant="outline" className="w-full" onClick={addAction}>
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="active" className="cursor-pointer">
            Activate workflow immediately
          </Label>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button variant="outline" onClick={handleTest}>
            <Play className="h-4 w-4 mr-2" />
            Test Run
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Workflow
          </Button>
        </div>
      </div>
    </div>
  );
}

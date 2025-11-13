'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plug,
  CheckCircle2,
  XCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  Facebook,
  Mail,
  ShoppingCart,
  Package,
  Globe,
  Zap,
  BarChart3,
  Users,
  MessageSquare,
  Phone,
  Calendar,
  CreditCard,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'ads' | 'ecommerce' | 'communication' | 'analytics' | 'productivity';
  icon: any;
  color: string;
  status: 'connected' | 'disconnected' | 'error';
  features: string[];
  setupUrl?: string;
  lastSync?: string;
  accountInfo?: {
    accountId?: string;
    accountName?: string;
    email?: string;
  };
}

const INTEGRATIONS: Integration[] = [
  // Advertising Platforms
  {
    id: 'meta-ads',
    name: 'Meta Ads (Facebook & Instagram)',
    description: 'Sync your Facebook and Instagram ad campaigns, track performance, and manage budgets',
    category: 'ads',
    icon: Facebook,
    color: 'bg-blue-500',
    status: 'disconnected',
    features: [
      'Campaign synchronization',
      'Real-time performance metrics',
      'Audience insights',
      'Ad creative management',
      'Budget optimization',
    ],
    setupUrl: 'https://developers.facebook.com/docs/marketing-apis',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    description: 'Connect Google Ads to track campaigns, keywords, and conversions',
    category: 'ads',
    icon: Globe,
    color: 'bg-green-500',
    status: 'disconnected',
    features: [
      'Campaign management',
      'Keyword tracking',
      'Conversion tracking',
      'Performance reports',
      'Budget alerts',
    ],
    setupUrl: 'https://developers.google.com/google-ads/api',
  },
  {
    id: 'linkedin-ads',
    name: 'LinkedIn Ads',
    description: 'Manage LinkedIn advertising campaigns and B2B lead generation',
    category: 'ads',
    icon: Users,
    color: 'bg-blue-700',
    status: 'disconnected',
    features: [
      'B2B campaign management',
      'Lead gen forms',
      'Audience targeting',
      'Campaign analytics',
      'Conversion tracking',
    ],
  },

  // E-commerce Platforms
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Sync products, orders, and customer data from your Shopify store',
    category: 'ecommerce',
    icon: ShoppingCart,
    color: 'bg-green-600',
    status: 'disconnected',
    features: [
      'Product catalog sync',
      'Order management',
      'Customer data sync',
      'Inventory tracking',
      'Sales analytics',
    ],
    setupUrl: 'https://shopify.dev/docs/api',
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Connect your WooCommerce store for order and customer management',
    category: 'ecommerce',
    icon: Package,
    color: 'bg-purple-600',
    status: 'disconnected',
    features: [
      'Order synchronization',
      'Product management',
      'Customer profiles',
      'Inventory updates',
      'Sales reports',
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon Seller Central',
    description: 'Manage Amazon listings, orders, and customer communications',
    category: 'ecommerce',
    icon: Package,
    color: 'bg-orange-500',
    status: 'disconnected',
    features: [
      'Listing management',
      'Order processing',
      'Inventory sync',
      'Customer messages',
      'Performance metrics',
    ],
  },

  // Communication
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Connect Gmail for unified inbox and email tracking',
    category: 'communication',
    icon: Mail,
    color: 'bg-red-500',
    status: 'disconnected',
    features: [
      'Email synchronization',
      'Thread tracking',
      'Send & receive',
      'Contact sync',
      'Email templates',
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Integrate WhatsApp Business for customer messaging',
    category: 'communication',
    icon: MessageSquare,
    color: 'bg-green-500',
    status: 'disconnected',
    features: [
      'Message management',
      'Contact sync',
      'Broadcast messages',
      'Quick replies',
      'Message templates',
    ],
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS and voice communication platform integration',
    category: 'communication',
    icon: Phone,
    color: 'bg-red-600',
    status: 'disconnected',
    features: [
      'SMS messaging',
      'Voice calls',
      'Call recording',
      'Phone number management',
      'Conversation logs',
    ],
  },

  // Analytics
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track website analytics and user behavior',
    category: 'analytics',
    icon: BarChart3,
    color: 'bg-yellow-500',
    status: 'disconnected',
    features: [
      'Website traffic',
      'User behavior',
      'Conversion tracking',
      'Event tracking',
      'Custom reports',
    ],
  },

  // Productivity
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync meetings, tasks, and reminders',
    category: 'productivity',
    icon: Calendar,
    color: 'bg-blue-500',
    status: 'disconnected',
    features: [
      'Calendar sync',
      'Meeting scheduling',
      'Event reminders',
      'Availability tracking',
      'Team calendars',
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscription management',
    category: 'productivity',
    icon: CreditCard,
    color: 'bg-purple-500',
    status: 'disconnected',
    features: [
      'Payment processing',
      'Subscription billing',
      'Invoice management',
      'Customer payments',
      'Revenue analytics',
    ],
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect 5000+ apps with automated workflows',
    category: 'productivity',
    icon: Zap,
    color: 'bg-orange-500',
    status: 'disconnected',
    features: [
      'Workflow automation',
      '5000+ app connections',
      'Custom triggers',
      'Multi-step zaps',
      'Data transformation',
    ],
    setupUrl: 'https://zapier.com/developer',
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [credentials, setCredentials] = useState({
    apiKey: '',
    apiSecret: '',
    accountId: '',
  });

  const categories = [
    { id: 'all', name: 'All Integrations', icon: Plug },
    { id: 'ads', name: 'Advertising', icon: BarChart3 },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'communication', name: 'Communication', icon: MessageSquare },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'productivity', name: 'Productivity', icon: Zap },
  ];

  const filteredIntegrations =
    selectedCategory === 'all'
      ? integrations
      : integrations.filter((i) => i.category === selectedCategory);

  const connectedCount = integrations.filter((i) => i.status === 'connected').length;

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setSetupDialogOpen(true);
  };

  const handleDisconnect = (integrationId: string) => {
    if (!confirm('Are you sure you want to disconnect this integration?')) return;

    setIntegrations(
      integrations.map((i) =>
        i.id === integrationId
          ? { ...i, status: 'disconnected', accountInfo: undefined, lastSync: undefined }
          : i
      )
    );
  };

  const handleSaveConnection = () => {
    if (!selectedIntegration) return;

    // Mock connection - in real app, this would make API calls
    setIntegrations(
      integrations.map((i) =>
        i.id === selectedIntegration.id
          ? {
              ...i,
              status: 'connected',
              lastSync: new Date().toISOString(),
              accountInfo: {
                accountId: credentials.accountId || 'acc_12345',
                accountName: selectedIntegration.name,
              },
            }
          : i
      )
    );

    setSetupDialogOpen(false);
    setCredentials({ apiKey: '', apiSecret: '', accountId: '' });
  };

  const handleSync = (integrationId: string) => {
    // Mock sync
    setIntegrations(
      integrations.map((i) =>
        i.id === integrationId ? { ...i, lastSync: new Date().toISOString() } : i
      )
    );
    alert('Sync started! Data will be updated shortly.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Integrations</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Connect your favorite tools and platforms
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {connectedCount} Connected
        </Badge>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
              <cat.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{cat.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <Card
                key={integration.id}
                className="border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${integration.color} rounded-lg p-2.5`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        {integration.status === 'connected' && integration.accountInfo && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {integration.accountInfo.accountName || integration.accountInfo.accountId}
                          </p>
                        )}
                      </div>
                    </div>
                    {integration.status === 'connected' ? (
                      <CheckCircle2 className="h-5 w-5 text-success-600" />
                    ) : integration.status === 'error' ? (
                      <XCircle className="h-5 w-5 text-error-600" />
                    ) : null}
                  </div>
                  <CardDescription className="mt-2">{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Features:
                    </p>
                    <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                      {integration.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-success-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {integration.features.length > 3 && (
                        <li className="text-xs text-neutral-500">
                          +{integration.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Last Sync */}
                  {integration.lastSync && (
                    <p className="text-xs text-neutral-500">
                      Last synced: {new Date(integration.lastSync).toLocaleString()}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {integration.status === 'connected' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleSync(integration.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={() => handleConnect(integration)}
                        >
                          <Plug className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                        {integration.setupUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(integration.setupUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Tabs>

      {/* Setup Dialog */}
      <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect this integration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                placeholder="Enter your API key"
                value={credentials.apiKey}
                onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-secret">API Secret</Label>
              <Input
                id="api-secret"
                type="password"
                placeholder="Enter your API secret"
                value={credentials.apiSecret}
                onChange={(e) => setCredentials({ ...credentials, apiSecret: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-id">Account ID (Optional)</Label>
              <Input
                id="account-id"
                placeholder="Enter account ID"
                value={credentials.accountId}
                onChange={(e) => setCredentials({ ...credentials, accountId: e.target.value })}
              />
            </div>

            <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 p-4">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <strong>How to get credentials:</strong>
              </p>
              <ol className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1 list-decimal list-inside">
                <li>Go to the platform's developer portal</li>
                <li>Create a new application or API key</li>
                <li>Copy the credentials and paste them here</li>
              </ol>
              {selectedIntegration?.setupUrl && (
                <Button
                  variant="link"
                  className="p-0 h-auto mt-2"
                  onClick={() => window.open(selectedIntegration.setupUrl, '_blank')}
                >
                  Open Developer Portal <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSetupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConnection}>Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

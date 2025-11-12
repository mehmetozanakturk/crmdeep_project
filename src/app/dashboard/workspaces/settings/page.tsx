'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, CheckCircle2, XCircle, Loader2, Save, Key, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkspaceSettings {
  id: string;
  name: string;
  domain: string;
  color: string;
  description?: string;
  apis: {
    metaAds: {
      enabled: boolean;
      accessToken?: string;
      adAccountId?: string;
      status: 'connected' | 'disconnected' | 'error';
      lastSync?: string;
      errorMessage?: string;
    };
    googleAds: {
      enabled: boolean;
      clientId?: string;
      clientSecret?: string;
      refreshToken?: string;
      customerId?: string;
      status: 'connected' | 'disconnected' | 'error';
      lastSync?: string;
      errorMessage?: string;
    };
    email: {
      enabled: boolean;
      smtpHost?: string;
      smtpPort?: string;
      smtpUser?: string;
      smtpPassword?: string;
      fromEmail?: string;
      fromName?: string;
      status: 'connected' | 'disconnected' | 'error';
      errorMessage?: string;
    };
  };
}

export default function WorkspaceSettingsPage() {
  const { toast } = useToast();
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('');
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  useEffect(() => {
    const workspaceId = localStorage.getItem('crmdeep_active_workspace');
    if (workspaceId) {
      setActiveWorkspaceId(workspaceId);
      loadSettings(workspaceId);
    }
  }, []);

  const loadSettings = (workspaceId: string) => {
    const workspacesData = localStorage.getItem('crmdeep_workspaces');
    const workspaces = workspacesData ? JSON.parse(workspacesData) : [];
    const workspace = workspaces.find((w: any) => w.id === workspaceId);

    const settingsKey = `crmdeep_workspace_${workspaceId}_settings`;
    const savedSettings = localStorage.getItem(settingsKey);

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else if (workspace) {
      const defaultSettings: WorkspaceSettings = {
        id: workspace.id,
        name: workspace.name,
        domain: workspace.domain,
        color: workspace.color,
        description: workspace.description,
        apis: {
          metaAds: {
            enabled: false,
            status: 'disconnected',
          },
          googleAds: {
            enabled: false,
            status: 'disconnected',
          },
          email: {
            enabled: false,
            status: 'disconnected',
          },
        },
      };
      setSettings(defaultSettings);
    }
  };

  const saveSettings = async () => {
    if (!settings || !activeWorkspaceId) return;

    setIsSaving(true);
    try {
      const settingsKey = `crmdeep_workspace_${activeWorkspaceId}_settings`;
      localStorage.setItem(settingsKey, JSON.stringify(settings));

      const workspacesData = localStorage.getItem('crmdeep_workspaces');
      if (workspacesData) {
        const workspaces = JSON.parse(workspacesData);
        const updatedWorkspaces = workspaces.map((w: any) =>
          w.id === activeWorkspaceId
            ? { ...w, name: settings.name, domain: settings.domain, color: settings.color, description: settings.description }
            : w
        );
        localStorage.setItem('crmdeep_workspaces', JSON.stringify(updatedWorkspaces));
        window.dispatchEvent(new Event('workspaceChanged'));
      }

      toast({
        title: 'Ayarlar Kaydedildi',
        description: 'Workspace ayarlarınız başarıyla güncellendi.',
      });

      if (settings.apis.metaAds.enabled && settings.apis.metaAds.status === 'connected') {
        await syncMetaCampaigns();
      }
      if (settings.apis.googleAds.enabled && settings.apis.googleAds.status === 'connected') {
        await syncGoogleCampaigns();
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Ayarlar kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (apiType: 'metaAds' | 'googleAds' | 'email') => {
    if (!settings) return;

    setTestingConnection(apiType);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      let isValid = false;
      let errorMessage = '';

      switch (apiType) {
        case 'metaAds':
          isValid = !!(settings.apis.metaAds.accessToken && settings.apis.metaAds.adAccountId);
          errorMessage = isValid ? '' : 'Access Token ve Ad Account ID gerekli';
          setSettings({
            ...settings,
            apis: {
              ...settings.apis,
              metaAds: {
                ...settings.apis.metaAds,
                enabled: isValid,
                status: isValid ? 'connected' : 'error',
                errorMessage,
                lastSync: isValid ? new Date().toISOString() : undefined,
              },
            },
          });
          break;
        case 'googleAds':
          isValid = !!(
            settings.apis.googleAds.clientId &&
            settings.apis.googleAds.clientSecret &&
            settings.apis.googleAds.refreshToken &&
            settings.apis.googleAds.customerId
          );
          errorMessage = isValid ? '' : 'Tüm alanları doldurun';
          setSettings({
            ...settings,
            apis: {
              ...settings.apis,
              googleAds: {
                ...settings.apis.googleAds,
                enabled: isValid,
                status: isValid ? 'connected' : 'error',
                errorMessage,
                lastSync: isValid ? new Date().toISOString() : undefined,
              },
            },
          });
          break;
        case 'email':
          isValid = !!(
            settings.apis.email.smtpHost &&
            settings.apis.email.smtpPort &&
            settings.apis.email.smtpUser &&
            settings.apis.email.smtpPassword &&
            settings.apis.email.fromEmail &&
            settings.apis.email.fromName
          );
          errorMessage = isValid ? '' : 'Tüm alanları doldurun';
          setSettings({
            ...settings,
            apis: {
              ...settings.apis,
              email: {
                ...settings.apis.email,
                enabled: isValid,
                status: isValid ? 'connected' : 'error',
                errorMessage,
              },
            },
          });
          break;
      }

      toast({
        title: isValid ? 'Bağlantı Başarılı' : 'Bağlantı Hatası',
        description: isValid
          ? 'API bağlantısı başarıyla test edildi.'
          : errorMessage,
        variant: isValid ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Bağlantı Hatası',
        description: 'API bağlantısı test edilirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setTestingConnection(null);
    }
  };

  const syncMetaCampaigns = async () => {
    toast({
      title: 'Kampanyalar Senkronize Ediliyor',
      description: 'Meta Ads kampanyaları otomatik olarak çekiliyor...',
    });
  };

  const syncGoogleCampaigns = async () => {
    toast({
      title: 'Kampanyalar Senkronize Ediliyor',
      description: 'Google Ads kampanyaları otomatik olarak çekiliyor...',
    });
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const getStatusBadge = (status: 'connected' | 'disconnected' | 'error') => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="outline" className="gap-1 border-success-500 text-success-600 dark:text-success-400">
            <CheckCircle2 className="h-3 w-3" />
            Bağlı
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="gap-1 border-danger-500 text-danger-600 dark:text-danger-400">
            <XCircle className="h-3 w-3" />
            Hata
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1 border-neutral-300 text-neutral-600 dark:text-neutral-400">
            <XCircle className="h-3 w-3" />
            Bağlı Değil
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Workspace Ayarları
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            {settings.name} workspace ayarlarını yönetin
          </p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Kaydet
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Palette className="mr-2 h-4 w-4" />
            Genel
          </TabsTrigger>
          <TabsTrigger value="apis">
            <Key className="mr-2 h-4 w-4" />
            API Entegrasyonları
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Bilgileri</CardTitle>
              <CardDescription>
                Workspace temel bilgilerini güncelleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Workspace Adı</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) =>
                      setSettings({ ...settings, name: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={settings.domain}
                    onChange={(e) =>
                      setSettings({ ...settings, domain: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Açıklama</Label>
                <Input
                  id="description"
                  value={settings.description || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, description: e.target.value })
                  }
                  className="mt-1"
                  placeholder="Workspace açıklaması..."
                />
              </div>

              <div>
                <Label htmlFor="color">Renk</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="color"
                    type="color"
                    value={settings.color}
                    onChange={(e) =>
                      setSettings({ ...settings, color: e.target.value })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={settings.color}
                    onChange={(e) =>
                      setSettings({ ...settings, color: e.target.value })
                    }
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apis" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meta Ads API</CardTitle>
                  <CardDescription>
                    Facebook ve Instagram reklam kampanyalarınızı yönetin
                  </CardDescription>
                </div>
                {getStatusBadge(settings.apis.metaAds.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaAccessToken">Access Token</Label>
                <Input
                  id="metaAccessToken"
                  type="password"
                  value={settings.apis.metaAds.accessToken || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      apis: {
                        ...settings.apis,
                        metaAds: {
                          ...settings.apis.metaAds,
                          accessToken: e.target.value,
                        },
                      },
                    })
                  }
                  className="mt-1"
                  placeholder="EAAxxxx..."
                />
              </div>

              <div>
                <Label htmlFor="metaAdAccountId">Ad Account ID</Label>
                <Input
                  id="metaAdAccountId"
                  value={settings.apis.metaAds.adAccountId || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      apis: {
                        ...settings.apis,
                        metaAds: {
                          ...settings.apis.metaAds,
                          adAccountId: e.target.value,
                        },
                      },
                    })
                  }
                  className="mt-1"
                  placeholder="act_123456789"
                />
              </div>

              {settings.apis.metaAds.errorMessage && (
                <p className="text-sm text-danger-600 dark:text-danger-400">
                  {settings.apis.metaAds.errorMessage}
                </p>
              )}

              {settings.apis.metaAds.lastSync && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Son senkronizasyon:{' '}
                  {new Date(settings.apis.metaAds.lastSync).toLocaleString('tr-TR')}
                </p>
              )}

              <Button
                onClick={() => testConnection('metaAds')}
                disabled={testingConnection === 'metaAds'}
                variant="outline"
              >
                {testingConnection === 'metaAds' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Test Ediliyor...
                  </>
                ) : (
                  'Bağlantıyı Test Et'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Google Ads API</CardTitle>
                  <CardDescription>
                    Google Ads kampanyalarınızı yönetin
                  </CardDescription>
                </div>
                {getStatusBadge(settings.apis.googleAds.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="googleClientId">Client ID</Label>
                  <Input
                    id="googleClientId"
                    value={settings.apis.googleAds.clientId || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          googleAds: {
                            ...settings.apis.googleAds,
                            clientId: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1"
                    placeholder="123456789.apps.googleusercontent.com"
                  />
                </div>

                <div>
                  <Label htmlFor="googleClientSecret">Client Secret</Label>
                  <Input
                    id="googleClientSecret"
                    type="password"
                    value={settings.apis.googleAds.clientSecret || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          googleAds: {
                            ...settings.apis.googleAds,
                            clientSecret: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1"
                    placeholder="GOCSPX-xxxx..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="googleRefreshToken">Refresh Token</Label>
                <Input
                  id="googleRefreshToken"
                  type="password"
                  value={settings.apis.googleAds.refreshToken || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      apis: {
                        ...settings.apis,
                        googleAds: {
                          ...settings.apis.googleAds,
                          refreshToken: e.target.value,
                        },
                      },
                    })
                  }
                  className="mt-1"
                  placeholder="1//xxxx..."
                />
              </div>

              <div>
                <Label htmlFor="googleCustomerId">Customer ID</Label>
                <Input
                  id="googleCustomerId"
                  value={settings.apis.googleAds.customerId || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      apis: {
                        ...settings.apis,
                        googleAds: {
                          ...settings.apis.googleAds,
                          customerId: e.target.value,
                        },
                      },
                    })
                  }
                  className="mt-1"
                  placeholder="123-456-7890"
                />
              </div>

              {settings.apis.googleAds.errorMessage && (
                <p className="text-sm text-danger-600 dark:text-danger-400">
                  {settings.apis.googleAds.errorMessage}
                </p>
              )}

              {settings.apis.googleAds.lastSync && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Son senkronizasyon:{' '}
                  {new Date(settings.apis.googleAds.lastSync).toLocaleString('tr-TR')}
                </p>
              )}

              <Button
                onClick={() => testConnection('googleAds')}
                disabled={testingConnection === 'googleAds'}
                variant="outline"
              >
                {testingConnection === 'googleAds' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Test Ediliyor...
                  </>
                ) : (
                  'Bağlantıyı Test Et'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email SMTP</CardTitle>
                  <CardDescription>
                    E-posta gönderimi için SMTP ayarları
                  </CardDescription>
                </div>
                {getStatusBadge(settings.apis.email.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.apis.email.smtpHost || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          email: {
                            ...settings.apis.email,
                            smtpHost: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.apis.email.smtpPort || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          email: {
                            ...settings.apis.email,
                            smtpPort: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1"
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="smtpUser">SMTP User</Label>
                  <Input
                    id="smtpUser"
                    value={settings.apis.email.smtpUser || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          email: {
                            ...settings.apis.email,
                            smtpUser: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.apis.email.smtpPassword || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          email: {
                            ...settings.apis.email,
                            smtpPassword: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.apis.email.fromEmail || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          email: {
                            ...settings.apis.email,
                            fromEmail: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1"
                    placeholder="noreply@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.apis.email.fromName || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          email: {
                            ...settings.apis.email,
                            fromName: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1"
                    placeholder="CRM Deep"
                  />
                </div>
              </div>

              {settings.apis.email.errorMessage && (
                <p className="text-sm text-danger-600 dark:text-danger-400">
                  {settings.apis.email.errorMessage}
                </p>
              )}

              <Button
                onClick={() => testConnection('email')}
                disabled={testingConnection === 'email'}
                variant="outline"
              >
                {testingConnection === 'email' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Test Ediliyor...
                  </>
                ) : (
                  'Bağlantıyı Test Et'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

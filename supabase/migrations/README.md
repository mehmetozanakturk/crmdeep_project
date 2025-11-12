# Supabase Migrations

Bu klasör CRMDeep projesi için Supabase veritabanı migration dosyalarını içerir.

## Migration Dosyaları

1. **20250112000001_create_workspaces.sql**
   - Workspaces (Ana workspace tablosu)
   - Workspace Settings (API yapılandırmaları)
   - Workspace Members (Kullanıcı üyelikleri)
   - Profiles (Kullanıcı profilleri)
   - RLS politikaları ve triggerlar

2. **20250112000002_create_companies.sql**
   - Companies tablosu (workspace-scoped)
   - Firmalar için RLS politikaları

3. **20250112000003_create_projects.sql**
   - Projects tablosu (workspace-scoped)
   - Projeler için RLS politikaları

4. **20250112000004_create_tasks.sql**
   - Tasks tablosu (workspace-scoped)
   - Görevler için RLS politikaları

5. **20250112000005_create_campaigns.sql**
   - Campaigns tablosu (workspace-scoped)
   - Kampanyalar için RLS politikaları

6. **20250112000006_create_emails.sql**
   - Emails tablosu (workspace-scoped)
   - E-postalar için RLS politikaları

7. **20250112000007_seed_data.sql**
   - Test/development için başlangıç verileri

## Kurulum

### Supabase Dashboard Üzerinden

1. [Supabase Dashboard](https://supabase.com/dashboard) → Projenizi seçin
2. SQL Editor'e gidin
3. Her migration dosyasını sırayla kopyalayıp çalıştırın (numaralı sıraya göre)

### Supabase CLI İle (Önerilen)

```bash
# Supabase CLI yükleyin (eğer yoksa)
npm install -g supabase

# Projeyi başlatın
supabase init

# Supabase projesi ile bağlantı kurun
supabase link --project-ref YOUR_PROJECT_REF

# Migration'ları uygulayın
supabase db push

# Veya migration'ları tek tek çalıştırın
supabase db push --file supabase/migrations/20250112000001_create_workspaces.sql
```

## Özellikler

### Multi-Tenant Mimari
- Her workspace tamamen izole veri sahibi
- Row Level Security (RLS) ile veri güvenliği
- Kullanıcılar sadece üye oldukları workspace verilerini görebilir

### Roller
- **admin**: Workspace yönetimi, ayarlar, üye yönetimi
- **member**: Veri ekleme/düzenleme
- **viewer**: Sadece görüntüleme

### API Entegrasyonları
Workspace settings tablosu şunları saklar:
- Meta Ads API credentials
- Google Ads API credentials
- Email SMTP ayarları

### Otomatik İşlemler
- `updated_at` otomatik güncellenir
- Yeni kullanıcı kaydında otomatik profile oluşturulur
- Workspace silindiğinde ilgili tüm veriler CASCADE olarak silinir

## Güvenlik

### Row Level Security (RLS)
Tüm tablolarda RLS aktif. Kullanıcılar:
- Sadece kendi workspace'lerinin verilerini görebilir
- Sadece yetkileri dahilinde işlem yapabilir
- Admin yetkisi olmadan workspace ayarlarını göremez

### API Keys
API anahtarları `workspace_settings` tablosunda saklanır ve sadece admin'ler erişebilir.

## Dikkat Edilmesi Gerekenler

1. **Sıralı Çalıştırma**: Migration dosyalarını mutlaka numaralı sıraya göre çalıştırın
2. **Seed Data**: `20250112000007_seed_data.sql` sadece development içindir
3. **Production**: Production'da seed data çalıştırmayın, kullanıcılar kayıt olurken workspace oluşturacak
4. **Backup**: Migration çalıştırmadan önce mutlaka veritabanı yedeki alın

## localStorage'dan Migration

Mevcut localStorage verilerini Supabase'e taşımak için:

1. Frontend'de workspace ID'leri localStorage'daki workspace'lerle eşleştirin
2. Her modül için localStorage verilerini okuyup Supabase'e INSERT edin
3. Workspace ID'yi her kayda ekleyin

Örnek migration fonksiyonu:
```typescript
async function migrateLocalStorageToSupabase() {
  const workspaceId = localStorage.getItem('crmdeep_active_workspace');

  // Companies
  const companies = JSON.parse(localStorage.getItem(`crmdeep_workspace_${workspaceId}_companies`) || '[]');
  for (const company of companies) {
    await supabase.from('companies').insert({
      ...company,
      workspace_id: workspaceId
    });
  }

  // Projects, Tasks, Campaigns, Emails için aynı işlemi tekrarlayın
}
```

## Troubleshooting

### Migration Hatası
Eğer migration başarısız olursa:
1. Supabase Dashboard → Database → Logs'u kontrol edin
2. Hata mesajını okuyun
3. Gerekirse migration'ları rollback edin ve düzeltin

### RLS Sorunu
Kullanıcı veri göremiyor ise:
1. `workspace_members` tablosunda kullanıcının kaydı var mı kontrol edin
2. RLS politikalarını kontrol edin
3. Supabase Dashboard → Authentication → Policies'i inceleyin

## Destek

Migration ile ilgili sorunlar için:
- Supabase Docs: https://supabase.com/docs/guides/database/migrations
- CRMDeep GitHub Issues: [Proje GitHub URL]

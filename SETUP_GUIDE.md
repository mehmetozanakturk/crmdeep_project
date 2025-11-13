# CRMDeep - Kurulum Rehberi

Bu rehber, CRMDeep projesini local makinenizde çalıştırmanız için gerekli tüm adımları içerir.

## 📋 Gereksinimler

- Node.js 18+ ([nodejs.org](https://nodejs.org/))
- Git
- Supabase hesabı ([supabase.com](https://supabase.com))

---

## 🚀 Hızlı Başlangıç (CMD Komutları)

### Adım 1: Projeyi İndirin

```cmd
REM GitHub'dan clone
git clone https://github.com/mehmetozanakturk/crmdeep_project.git

REM Klasöre girin
cd crmdeep_project

REM Doğru branch'e geçin
git checkout claude/crmdeep-initial-setup-011CV11tdTLEQwL5xUy8XFj4
```

### Adım 2: Bağımlılıkları Yükleyin

```cmd
REM npm paketlerini yükle (408 paket, 1-2 dakika sürer)
npm install
```

### Adım 3: Environment Variables

```cmd
REM .env.local.example dosyasını kopyalayın
copy .env.local.example .env.local

REM NOT: .env.local dosyasını bir text editörle açıp
REM Supabase keys'lerini ekleyeceksiniz (sonraki adımda)
```

---

## 🗄️ Supabase Kurulumu

### Adım 1: Supabase Projesi Oluşturun

1. [supabase.com](https://supabase.com) → "New Project"
2. Organization seçin veya yeni oluşturun
3. Proje bilgileri:
   - **Name**: `crmdeep` (veya istediğiniz isim)
   - **Database Password**: Güçlü bir şifre seçin ve **KAYDEDIN!**
   - **Region**: `Europe West (Frankfurt)` (size en yakın)
4. "Create new project" tıklayın (1-2 dakika sürer)

### Adım 2: API Keys'leri Alın

Proje oluşturulduktan sonra:

1. Sol menüden **Settings** → **API**
2. Aşağıdaki değerleri kopyalayın:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (GİZLİ!)
```

### Adım 3: .env.local Dosyasını Doldurun

`.env.local` dosyasını bir text editör ile açıp şunları yapıştırın:

```bash
# Supabase Configuration (Yukarıda kopyaladığınız değerler)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site Configuration (Değiştirmeyin)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=CRMDeep
```

### Adım 4: Database Migration'ları Çalıştırın

Supabase Dashboard'da:

1. Sol menüden **SQL Editor**
2. "New query" butonuna tıklayın
3. Aşağıdaki dosyaları sırayla çalıştırın:

#### 4.1 İlk Migration (Schema)

`supabase/migrations/20240101000000_initial_schema.sql` dosyasının içeriğini kopyalayıp SQL Editor'e yapıştırın ve "Run" butonuna basın.

✅ **Başarılı:** "Success. No rows returned" mesajını göreceksiniz

#### 4.2 İkinci Migration (RLS Policies)

`supabase/migrations/20240101000001_rls_policies.sql` dosyasının içeriğini kopyalayıp SQL Editor'e yapıştırın ve "Run" butonuna basın.

✅ **Başarılı:** "Success. No rows returned" mesajını göreceksiniz

#### 4.3 Campaigns & Emails Migration

`supabase/migrations/20241113000000_campaigns_and_emails.sql` dosyasının içeriğini kopyalayıp SQL Editor'e yapıştırın ve "Run" butonuna basın.

✅ **Başarılı:** "Success. No rows returned" mesajını göreceksiniz

#### 4.4 Campaigns & Emails RLS

`supabase/migrations/20241113000001_campaigns_emails_rls.sql` dosyasının içeriğini kopyalayıp SQL Editor'e yapıştırın ve "Run" butonuna basın.

✅ **Başarılı:** "Success. No rows returned" mesajını göreceksiniz

#### 4.5 Custom Reports Migration

`supabase/migrations/20241113000002_custom_reports.sql` dosyasının içeriğini kopyalayıp SQL Editor'e yapıştırın ve "Run" butonuna basın.

✅ **Başarılı:** "Success. No rows returned" mesajını göreceksiniz

#### 4.6 Custom Reports RLS

`supabase/migrations/20241113000003_custom_reports_rls.sql` dosyasının içeriğini kopyalayıp SQL Editor'e yapıştırın ve "Run" butonuna basın.

✅ **Başarılı:** "Success. No rows returned" mesajını göreceksiniz

#### 4.7 Doğrulama

Sol menüden **Table Editor** → Şu tabloları görmelisiniz:
- profiles
- organizations
- organization_members
- brands
- projects
- project_members
- tasks
- task_checklist
- task_labels
- attachments
- activity_logs
- campaigns
- campaign_performance_history
- emails
- custom_reports
- report_exports

---

## 🎯 Projeyi Çalıştırın

```cmd
REM Development server'ı başlat
npm run dev
```

Tarayıcınızda açın: **http://localhost:3000** 🎉

---

## ✅ Test Edin

### 1. Register (Kayıt Ol)

1. http://localhost:3000/register
2. Form doldurun:
   - Full name: Adınız Soyadınız
   - Email: test@example.com
   - Password: 123456 (en az 6 karakter)
3. "Create account" tıklayın
4. ✅ Dashboard'a yönlendirilmelisiniz!

### 2. Dashboard

http://localhost:3000/dashboard - İstatistikler ve quick actions göreceksiniz

### 3. Supabase'de Kontrol

1. Supabase Dashboard → **Authentication** → **Users**
2. Yeni kullanıcınızı görmelisiniz! ✅

---

## 🐛 Sorun Giderme

### Build Hatası

```cmd
REM Cache temizle
rmdir /s /q .next
rmdir /s /q node_modules
del package-lock.json

REM Yeniden yükle
npm install
npm run dev
```

### Supabase Bağlantı Hatası

1. `.env.local` dosyasını kontrol edin
2. API keys doğru kopyalandı mı?
3. `NEXT_PUBLIC_SUPABASE_URL` başında `https://` var mı?
4. Server'ı yeniden başlatın: `Ctrl+C` sonra `npm run dev`

### Database Migration Hatası

1. SQL Editor'de tüm tabloları silin (Table Editor'den)
2. Migration'ları tekrar sırayla çalıştırın
3. **NOT:** İlk migration'ı çalıştırmadan ikincisini çalıştırmayın!

---

## 📚 Ekstra Bilgiler

### Type Generation (Opsiyonel)

Supabase types'ları güncellemek için:

```cmd
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

`YOUR_PROJECT_ID` değerini Supabase Dashboard → Settings → General → Reference ID'den alabilirsiniz.

### Build Test

```cmd
npm run build
```

### Lint

```cmd
npm run lint
```

---

## 🎉 Başarılı Kurulum!

Artık CRMDeep local makinenizde çalışıyor!

- ✅ Authentication çalışıyor
- ✅ Database bağlantısı aktif
- ✅ Tüm sayfalar erişilebilir

Sorun yaşarsanız, bu rehberi tekrar gözden geçirin veya GitHub Issues'da soru sorun.

**İyi çalışmalar! 🚀**

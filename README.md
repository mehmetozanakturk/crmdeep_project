# CRMDeep

**Deep Analytics. Deeper Insights.**

CRMDeep is a comprehensive multi-brand management platform that helps businesses manage brands, projects, teams, and analytics from a single centralized hub.

## 🎯 Features

- **Multi-Brand Management**: Manage multiple brands from one dashboard
- **Project & Task Management**: Kanban boards, task assignments, and team collaboration
- **Analytics Integration**: Email analytics, website analytics (GA4, GSC)
- **Sales Pipeline**: Track deals and manage sales processes
- **Team Performance**: Monitor team productivity and activity
- **Secure & Scalable**: Built with Row Level Security (RLS) and multi-tenancy

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                # Next.js app directory
│   ├── (auth)/        # Authentication pages
│   ├── (dashboard)/   # Dashboard pages
│   └── api/           # API routes
├── components/        # React components
│   ├── ui/           # shadcn/ui components
│   └── layout/       # Layout components
├── lib/              # Utility functions
│   └── supabase/     # Supabase client & queries
├── types/            # TypeScript types
└── store/            # Zustand stores
```

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Multi-tenant architecture
- Role-based access control (RBAC)
- Secure API key storage

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and Supabase

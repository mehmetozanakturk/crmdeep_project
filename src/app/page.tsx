import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-50">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-primary-600">
          CRMDeep
        </h1>
        <p className="text-2xl text-neutral-700 font-light">
          Deep Analytics. Deeper Insights.
        </p>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          The comprehensive multi-brand management platform for modern businesses.
          Manage brands, projects, teams, and analytics from one centralized hub.
        </p>

        <div className="flex gap-4 justify-center pt-8">
          <Link
            href="/login"
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Get Started
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
          >
            Sign Up
          </Link>
        </div>

        <div className="pt-12 text-sm text-neutral-500">
          <p>Built with Next.js 14, TypeScript, and Supabase</p>
        </div>
      </div>
    </div>
  );
}

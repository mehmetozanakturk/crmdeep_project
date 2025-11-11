import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'CRMDeep - Multi-Brand Management Platform',
  description: 'Deep Analytics. Deeper Insights. Manage multiple brands, projects, and teams from one centralized hub.',
  keywords: ['CRM', 'Multi-Brand', 'Project Management', 'Analytics', 'Business Intelligence'],
  authors: [{ name: 'CRMDeep Team' }],
  openGraph: {
    title: 'CRMDeep - Multi-Brand Management Platform',
    description: 'Deep Analytics. Deeper Insights.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="light" storageKey="crmdeep-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/theme-context';
import MainLayout from '@/components/main-layout';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';

export const metadata: Metadata = {
  title: 'DeenStream',
  description: 'The Ultimate Islamic App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <ThemeProvider>
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

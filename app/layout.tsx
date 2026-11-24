import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import { Providers } from '@/components/providers';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const pinterestVerify = process.env.PINTEREST_DOMAIN_VERIFY?.trim();

export const metadata: Metadata = {
  title: 'Studio OS',
  description: 'Digital product intelligence and operations',
  robots: { index: false, follow: false },
  ...(pinterestVerify ? { other: { 'p:domain_verify': pinterestVerify } } : {}),
};

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="antialiased selection:bg-primary/15 selection:text-foreground">
        <Providers nonce={nonce}>{children}</Providers>
      </body>
    </html>
  );
}

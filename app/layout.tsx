import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Studio OS — Opportunity radar', description: 'Digital product intelligence and production operations', robots: { index: false, follow: false } };
export default function Layout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }

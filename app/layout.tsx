import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NavigationBar } from '@/components/NavigationBar';
import { Footer } from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Empleaido Factory - AI-Powered Employee Platform',
  description: 'Adopt AI-powered employees with unique personalities and skills that grow with your business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

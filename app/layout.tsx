import { Analytics } from '@vercel/analytics/react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import AppLayoutShell from './components/AppLayoutShell'

declare module '@vercel/analytics/react';

export const metadata = {
  title: 'Hoops Store Operations',
  description: 'Store operations management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppLayoutShell>{children}</AppLayoutShell>
        <Analytics />
      </body>
    </html>
  )
}

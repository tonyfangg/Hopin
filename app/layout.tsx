import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import MarketingLayout from './marketing-layout'

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
        <MarketingLayout>{children}</MarketingLayout>
        <Analytics />
      </body>
    </html>
  )
}

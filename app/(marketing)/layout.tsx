import { Header } from '@/components/marketing/header'

export const runtime = 'nodejs'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {children}
    </div>
  )
}
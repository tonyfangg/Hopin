'use client';

import { usePathname } from 'next/navigation';
import MarketingLayout from '@/app/marketing-layout';

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardOrAuth =
    pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth');

  return isDashboardOrAuth ? <>{children}</> : <MarketingLayout>{children}</MarketingLayout>;
} 
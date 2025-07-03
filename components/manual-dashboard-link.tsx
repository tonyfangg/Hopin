'use client'

import Link from 'next/link'
import Button from '@/components/ui/button'

export function ManualDashboardLink() {
  const goToDashboard = () => {
    // Force navigation
    window.location.href = '/dashboard'
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-sm text-blue-700 mb-3">
        If automatic redirect doesn't work, try these manual options:
      </p>
      
      <div className="flex gap-2">
        <Link href="/dashboard">
          <Button variant="outline" className="text-sm">
            📊 Go to Dashboard (Link)
          </Button>
        </Link>
        
        <Button 
          onClick={goToDashboard}
          variant="outline" 
          className="text-sm"
        >
          🔗 Go to Dashboard (Force)
        </Button>
      </div>
    </div>
  )
} 
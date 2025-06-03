'use client'
import { useState } from 'react'
import Button from '@/components/ui/button'

interface NotifyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotifyModal({ isOpen, onClose }: NotifyModalProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/mailchimp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setEmail('')
      } else {
        const data = await response.json()
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setIsSuccess(false)
    setError('')
    setEmail('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={resetModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl"
        >
          ×
        </button>

        {!isSuccess ? (
          <>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Get Early Access</h3>
            <p className="text-slate-600 mb-6">
              Be the first to know when Hoops Store Operations launches. Join our exclusive waitlist for early access and special pricing.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              />
              
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Notify Me'}
              </Button>
            </form>

            <p className="text-xs text-slate-500 mt-4 text-center">
              We'll only send you launch updates. No spam, unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">You&apos;re on the list!</h3>
            <p className="text-slate-600 mb-6">
              We&apos;ll notify you as soon as Hoops Store Operations is available.
            </p>
            <Button onClick={resetModal} className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/lib/hooks/useSupabase'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'

interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company_name: string | null
  phone: string | null
  position: string | null
}

export function AccountSettings() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('User error:', userError)
        router.push('/auth/login')
        return
      }

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError)
        setError('Failed to load profile data')
        return
      }

      // Combine user auth data with profile data
      const combinedProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        first_name: profile?.first_name || user.user_metadata?.first_name || '',
        last_name: profile?.last_name || user.user_metadata?.last_name || '',
        company_name: profile?.company_name || user.user_metadata?.company_name || '',
        phone: profile?.phone || user.user_metadata?.phone || '',
        position: profile?.position || ''
      }

      setProfileData(combinedProfile)
      
    } catch (err) {
      console.error('Load profile error:', err)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!profileData) return

    try {
      setSaving(true)
      setError('')
      
      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: profileData.id,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          company_name: profileData.company_name,
          phone: profileData.phone,
          position: profileData.position,
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Profile update error:', profileError)
        setError('Failed to update profile')
        return
      }

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          company_name: profileData.company_name,
          phone: profileData.phone
        }
      })

      if (authError) {
        console.error('Auth update error:', authError)
        // Don't show error for auth metadata update failure
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      
    } catch (err) {
      console.error('Save profile error:', err)
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-100">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-100">
        <p className="text-red-600">Failed to load profile data</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
          <span className="text-xl">👤</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Account Details</h3>
          <p className="text-slate-600">Your profile and credentials</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={profileData.first_name || ''}
              onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={profileData.last_name || ''}
              onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={saving}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profileData.email}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
            disabled
          />
          <p className="text-xs text-slate-500 mt-1">Email cannot be changed here</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={profileData.company_name || ''}
            onChange={(e) => setProfileData({...profileData, company_name: e.target.value})}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Position
          </label>
          <input
            type="text"
            value={profileData.position || ''}
            onChange={(e) => setProfileData({...profileData, position: e.target.value})}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Store Manager, Operations Director"
            disabled={saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={profileData.phone || ''}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={saving}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Profile updated successfully!
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={saveProfile}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button 
            variant="outline"
            onClick={loadUserProfile}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
} 
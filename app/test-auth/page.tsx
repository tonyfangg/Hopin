'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'

export default function TestAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  const testConnection = async () => {
    setLoading(true)
    setMessage('Testing connection...')
    
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setMessage(`Connection error: ${error.message}`)
      } else {
        setMessage(`Connection successful! Session: ${data.session ? 'Yes' : 'No'}`)
      }
    } catch (err) {
      setMessage(`Exception: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignUp = async () => {
    setLoading(true)
    setMessage('Creating test account...')
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        setMessage(`Signup error: ${error.message}`)
      } else {
        setMessage(`Signup successful! User: ${data.user?.id}`)
      }
    } catch (err) {
      setMessage(`Exception: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignIn = async () => {
    setLoading(true)
    setMessage('Testing sign in...')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setMessage(`Signin error: ${error.message}`)
      } else {
        setMessage(`Signin successful! User: ${data.user?.id}`)
      }
    } catch (err) {
      setMessage(`Exception: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-6">Supabase Auth Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Test Connection
          </button>
          
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <button
            onClick={testSignUp}
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Test Sign Up
          </button>
          
          <button
            onClick={testSignIn}
            disabled={loading}
            className="w-full bg-purple-600 text-white p-2 rounded"
          >
            Test Sign In
          </button>
        </div>
        
        {message && (
          <div className="mt-4 p-3 bg-slate-100 rounded">
            <pre className="text-sm">{message}</pre>
          </div>
        )}
      </div>
    </div>
  )
} 
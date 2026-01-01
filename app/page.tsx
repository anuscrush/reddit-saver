'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RedditPostData } from '@/lib/types'

export default function Page() {
  const [url, setUrl] = useState('')
  const [post, setPost] = useState<RedditPostData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl) {
        setError('Please configure Supabase in .env.local file.')
        setCheckingAuth(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth')
        return
      }

      setUser(session.user)
      setCheckingAuth(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/auth')
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPost(null)
    setLoading(true)

    try {
      const res = await fetch('/api/reddit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to fetch Reddit post. It may be deleted or archived.')

      setPost(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !post) return

    setSaving(true)
    setError(null)

    try {
      const session = await supabase.auth.getSession()
      if (!session.data.session) throw new Error('Not authenticated')

      const res = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session.access_token}`
        },
        body: JSON.stringify(post)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      alert('Thread saved successfully!')
      setPost(null)
      setUrl('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reddit Thread Saver</h1>
          <div className="flex gap-4 items-center">
            <Link href="/saved" className="text-blue-600 hover:underline">Saved Threads</Link>
            <span className="text-sm text-gray-500">{user.email}</span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Reddit post URL (e.g., https://www.reddit.com/r/...)"
            className="w-full p-3 border rounded text-black"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Fetching...' : 'Fetch Post'}
          </button>
        </form>

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        {post && (
          <div className="mt-6 space-y-4 p-4 border rounded">
            <div>
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <div className="text-sm text-gray-600 space-x-4">
                <span>Author: {post.author}</span>
                <span>Score: {post.score}</span>
                <span>Comments: {post.comments.length}</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Comments ({post.comments.length}):</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {post.comments.map((c, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded">
                    <div className="text-sm font-semibold text-gray-700 mb-1">{c.author} (score: {c.score})</div>
                    <div className="text-sm">{c.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Thread'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

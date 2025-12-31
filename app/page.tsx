'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import RedditForm from './components/RedditForm'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [threads, setThreads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchThreads = async (userId: string) => {
    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching threads:', error)
      return
    }

    setThreads(data || [])
  }

  useEffect(() => {
    if (user) {
      fetchThreads(user.id)
    }
  }, [user])

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('threads')
      .delete()
      .eq('id', id)

    if (!error && user) {
      fetchThreads(user.id)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  // 🔐 LOGIN UI
  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: '50px auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Reddit Thread Saver
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
        />
      </div>
    )
  }

  // ✅ LOGGED IN UI
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Reddit Thread Saver</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{
        background: '#f9fafb',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '40px',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Fetch New Thread</h2>
        <RedditForm
          userId={user.id}
          onSaved={() => fetchThreads(user.id)}
        />
      </div>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

      <h2>Saved Threads ({threads.length})</h2>

      {threads.length === 0 && (
        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
          No threads saved yet. Paste a Reddit URL above to get started!
        </p>
      )}

      <div>
        {threads.map((t) => (
          <div 
            key={t.id} 
            style={{ 
              marginBottom: '20px',
              padding: '20px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
              {t.post.title}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
              By u/{t.post.author} • Score: {t.post.score} • {t.post.comments.length} comments
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a 
                href={t.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}
              >
                View on Reddit →
              </a>
              <button 
                onClick={() => handleDelete(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: 0
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
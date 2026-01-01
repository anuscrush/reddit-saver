'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SavedPage() {
  const [threads, setThreads] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth')
      return
    }
    setUser(session.user)
    loadThreads(session.user.id)
  }

  async function loadThreads(userId: string) {
    const { data } = await supabase
      .from('threads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (data) setThreads(data)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete?')) return
    await supabase.from('threads').delete().eq('id', id)
    if (user) loadThreads(user.id)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (!user) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Saved Threads</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-blue-600">Home</Link>
            <button onClick={handleLogout} className="text-red-600">Logout</button>
          </div>
        </div>

        {threads.length === 0 ? (
          <p>No threads saved</p>
        ) : (
          <div className="space-y-4">
            {threads.map((t) => (
              <div key={t.id} className="p-4 border rounded">
                <h3 className="font-bold">{t.title}</h3>
                <p className="text-sm text-gray-600">
                  By u/{t.author} - Score: {t.score}
                </p>
                <div className="flex gap-3 mt-2">
                  <a href={t.url} target="_blank" className="text-blue-600 text-sm">
                    View Reddit
                  </a>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
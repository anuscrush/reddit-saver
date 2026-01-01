'use client'

import { useState } from 'react'

export default function TestPage() {
  const [url, setUrl] = useState('https://www.reddit.com/r/programming/comments/1pzvo25/psa_be_aware_when_opening_take_home_challenges/')
  const [post, setPost] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setPost(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reddit Fetch Test (No Auth Required)</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste Reddit post URL"
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

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {post && (
        <div className="mt-6 space-y-4 p-4 border rounded">
          <div>
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <div className="text-sm text-gray-600 space-x-4">
              <span>Author: {post.author}</span>
              <span>Score: {post.score}</span>
              <span>Comments: {post.comments?.length || 0}</span>
            </div>
          </div>

          {post.comments && post.comments.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Comments ({post.comments.length}):</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {post.comments.map((c: any, i: number) => (
                  <div key={i} className="p-3 bg-gray-50 rounded">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {c.author} (score: {c.score})
                    </div>
                    <div className="text-sm">{c.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-800">
              ✅ Reddit fetching is working! The data structure is ready to save.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold mb-2">Test Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>This page tests Reddit fetching without authentication</li>
          <li>If this works, the Reddit API is functioning correctly</li>
          <li>If this doesn't work, check your internet connection</li>
          <li>To test full app, go to <a href="/" className="text-blue-600 underline">home page</a> (requires Supabase setup)</li>
        </ol>
      </div>
    </main>
  )
}


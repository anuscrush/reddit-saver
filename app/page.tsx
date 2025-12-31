'use client'

import { useState } from 'react'

export default function Page() {
  const [url, setUrl] = useState('')
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
    <main className="p-6 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste Reddit URL"
          className="w-full p-2 border rounded text-black"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Fetch
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {post && (
        <div className="mt-4 space-y-2">
          <h2 className="font-bold">{post.title}</h2>
          <p>Author: {post.author}</p>
          <p>Score: {post.score}</p>

          {post.comments?.map((c: any, i: number) => (
            <p key={i}>
              <b>{c.author}</b>: {c.body}
            </p>
          ))}
        </div>
      )}
    </main>
  )
}

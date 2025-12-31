'use client'

import { useState } from 'react'
import { saveThread } from '@/lib/db'

interface RedditFormProps {
  userId: string
  onSaved: () => void
}

export default function RedditForm({ userId, onSaved }: RedditFormProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setError('Please paste a Reddit URL')
      return
    }

    // Basic Reddit URL validation
    if (!url.includes('reddit.com')) {
      setError('Invalid Reddit URL')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/reddit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })

      const data = await res.json()

      if (data.error || !res.ok) {
        setError(data.error || 'Failed to fetch thread')
        return
      }

      // Save to database
      await saveThread(userId, url.trim(), {
        title: data.post.title,
        author: data.post.author,
        score: data.post.score,
        comments: data.comments
      })

      setUrl('')
      onSaved() // Refresh list
      
    } catch (err) {
      console.error('Error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="https://www.reddit.com/r/nextjs/comments/..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            setError('') // Clear error on input
          }}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            outline: 'none',
          }}
        />
      </div>

      {error && (
        <div style={{
          padding: '8px 12px',
          background: '#fef2f2',
          color: '#dc2626',
          fontSize: '14px',
          borderRadius: '6px',
          marginBottom: '12px',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      <button 
        type="submit"
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: loading ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 500
        }}
      >
        {loading ? 'Fetching & Saving...' : 'Fetch & Save Thread'}
      </button>
    </form>
  )
}
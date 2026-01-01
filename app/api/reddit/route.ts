import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url || !url.includes('reddit.com')) {
      return NextResponse.json(
        { error: 'Invalid Reddit URL' },
        { status: 400 }
      )
    }

    // normalize URL
    const jsonUrl = url.replace(/\/$/, '') + '.json'

    const res = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'reddit-saver-app'
      },
      cache: 'no-store'
    })

    if (!res.ok) {
      throw new Error('Reddit fetch failed')
    }

    const data = await res.json()

    if (!data?.[0]?.data?.children?.length) {
      throw new Error('Invalid Reddit response')
    }

    const post = data[0].data.children[0].data
    
    // Extract comments, filtering out deleted/removed comments and getting first ~20
    const comments = data[1]?.data?.children
      ?.filter((c: any) => c.data?.body && !c.data.body.includes('[deleted]') && !c.data.body.includes('[removed]'))
      .slice(0, 20)
      .map((c: any) => ({
        author: c.data.author || '[deleted]',
        body: c.data.body || '',
        score: c.data.score || 0
      })) || []

    // Extract post ID from URL
    const postIdMatch = url.match(/\/comments\/([a-z0-9]+)/)
    const postId = postIdMatch ? postIdMatch[1] : post.id

    return NextResponse.json({
      title: post.title,
      author: post.author,
      score: post.score,
      comments,
      postId,
      url
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch Reddit data' },
      { status: 500 }
    )
  }
}

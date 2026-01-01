import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    // 1️⃣ Validate input
    if (!url || !url.includes('reddit.com')) {
      return NextResponse.json(
        { error: 'Invalid Reddit URL' },
        { status: 400 }
      )
    }

    // 2️⃣ Normalize Reddit URL (CRITICAL FOR VERCEL)
    const jsonUrl =
      url
        .trim()
        .replace(/^https?:\/\/(www\.)?reddit\.com/, 'https://old.reddit.com')
        .replace(/\/$/, '') + '.json'

    // 3️⃣ Fetch from Reddit with proper headers
    const res = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (RedditThreadSaver/1.0)',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    // 4️⃣ Handle Reddit blocking / errors
    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Reddit request failed with status ${res.status}. The post may be private, deleted, or blocked.`,
        },
        { status: res.status }
      )
    }

    const data = await res.json()

    // 5️⃣ Validate Reddit response format
    if (!Array.isArray(data) || !data[0]?.data?.children?.length) {
      return NextResponse.json(
        { error: 'Unexpected Reddit response format' },
        { status: 500 }
      )
    }

    // 6️⃣ Extract post data
    const post = data[0].data.children[0].data

    // 7️⃣ Extract top-level comments only
    const comments = (data[1]?.data?.children || [])
      .filter(
        (c: any) =>
          c.kind === 't1' &&
          c.data?.body &&
          !c.data.body.includes('[deleted]') &&
          !c.data.body.includes('[removed]')
      )
      .slice(0, 20)
      .map((c: any) => ({
        author: c.data.author || '[deleted]',
        body: c.data.body,
        score: c.data.score || 0,
      }))

    // 8️⃣ Extract post ID
    const postIdMatch = url.match(/\/comments\/([a-z0-9]+)/i)
    const postId = postIdMatch ? postIdMatch[1] : post.id

    // 9️⃣ Return response
    return NextResponse.json({
      postId,
      title: post.title,
      author: post.author,
      score: post.score,
      url,
      comments,
      
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error while fetching Reddit data' },
      { status: 500 }
    )
  }
}

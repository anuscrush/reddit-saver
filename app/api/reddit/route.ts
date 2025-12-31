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
    const comments = data[1]?.data?.children
      ?.filter((c: any) => c.data?.body)
      .slice(0, 5)
      .map((c: any) => ({
        author: c.data.author,
        body: c.data.body,
        score: c.data.score
      }))

    return NextResponse.json({
      title: post.title,
      author: post.author,
      score: post.score,
      comments
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch Reddit data' },
      { status: 500 }
    )
  }
}

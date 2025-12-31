import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL missing' }, { status: 400 })
    }

    const jsonUrl = url.replace(/\/$/, '') + '.json'

    const res = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'reddit-saver-app',
      },
    })

    if (!res.ok) {
      throw new Error('Reddit fetch failed')
    }

    const raw = await res.json()

    const postRaw = raw[0].data.children[0].data
    const commentsRaw = raw[1].data.children
      .slice(0, 20)
      .filter((c: any) => c.kind === 't1')
      .map((c: any) => ({
        author: c.data.author,
        body: c.data.body,
        score: c.data.score,
      }))

    return NextResponse.json({
      post: {
        title: postRaw.title,
        author: postRaw.author,
        score: postRaw.score,
      },
      comments: commentsRaw,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch Reddit data' },
      { status: 500 }
    )
  }
}

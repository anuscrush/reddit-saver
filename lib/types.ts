export interface RedditComment {
  author: string
  body: string
  score: number
}

export interface RedditPostData {
  title: string
  author: string
  score: number
  comments: RedditComment[]
  postId: string
  url: string
}
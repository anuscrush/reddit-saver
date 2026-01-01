import { supabase } from './supabaseClient'
import { RedditPostData } from './types'

export async function saveThread(
  userId: string,
  postData: RedditPostData
) {
  const { error } = await supabase
    .from('threads')
    .insert([
      {
        user_id: userId,
        post_id: postData.postId,
        title: postData.title,
        author: postData.author,
        score: postData.score,
        comments: postData.comments,
        url: postData.url
      }
    ])

  if (error) {
    console.error(error)
    throw error
  }
}

export async function getSavedThreads(userId: string) {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export async function deleteThread(threadId: string, userId: string) {
  const { error } = await supabase
    .from('threads')
    .delete()
    .eq('id', threadId)
    .eq('user_id', userId)

  if (error) {
    console.error(error)
    throw error
  }
}

import { supabase } from './supabaseClient'

export async function saveThread(
  userId: string,
  url: string,
  postData: any
) {
  const { error } = await supabase
    .from('threads')
    .insert([
      {
        user_id: userId,
        url,
        post: postData
      }
    ])

  if (error) {
    console.error(error)
    throw error
  }
}

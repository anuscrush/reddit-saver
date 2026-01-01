# Reddit Thread Saver

A simple Next.js application that allows users to authenticate, save Reddit post URLs, fetch post data and comments, and manage their saved threads.

## Features

- User authentication (email/password + OAuth with Google/GitHub)
- Paste a Reddit post URL to fetch post data
- Extract post title, author, score, and first ~20 comments
- Save threads to Supabase database
- View and delete saved threads
- Clean, basic UI with Tailwind CSS

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Supabase** (Authentication + Database)
- **Reddit JSON API** (No scraping needed - just append `.json` to any Reddit URL)
- **Tailwind CSS**

## Quick Start

1. **Install dependencies:** `npm install`
2. **Set up Supabase:** Create project and get credentials
3. **Create `.env.local`:** Add Supabase URL and key
4. **Run database schema:** Execute `supabase-schema.sql` in Supabase SQL Editor
5. **Start dev server:** `npm run dev`
6. **Open:** http://localhost:3000

📖 **For detailed setup, deployment, and submission instructions, see:**
- `SETUP_AND_DEPLOYMENT.md` - Complete setup and deployment guide
- `SUBMISSION_GUIDE.md` - How to submit your project

## Setup Steps

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Once your project is created, go to **Settings** → **API**
3. Copy your **Project URL** and **anon/public key**

### 3. Create Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Set Up Database Schema

In your Supabase dashboard, go to **SQL Editor** and run the following SQL to create the `threads` table:

```sql
-- Create threads table
CREATE TABLE threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  score INTEGER NOT NULL,
  comments JSONB NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_threads_user_id ON threads(user_id);
CREATE INDEX idx_threads_created_at ON threads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own threads
CREATE POLICY "Users can view own threads"
  ON threads FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own threads
CREATE POLICY "Users can insert own threads"
  ON threads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own threads
CREATE POLICY "Users can delete own threads"
  ON threads FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. Configure OAuth (Optional)

If you want to enable OAuth with Google or GitHub:

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Google** and/or **GitHub**
3. Follow the setup instructions to add your OAuth credentials
4. Add the redirect URL: `http://localhost:3000/auth/callback` (for local dev)
5. For production, add your production URL as well

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Data Flow

1. **Authentication**: User signs up/signs in via Supabase Auth (email/password or OAuth)
2. **Fetch Reddit Data**: User pastes a Reddit URL → App appends `.json` to the URL → Fetches JSON data from Reddit's public API
3. **Parse Data**: Extracts post title, author, score, and first ~20 comments from the JSON response
4. **Save to Database**: User clicks "Save Thread" → Data is saved to Supabase `threads` table
5. **View Saved Threads**: User can view all their saved threads on the `/saved` page

### Reddit API

Reddit provides a public JSON API. Simply append `.json` to any Reddit URL:
- `https://www.reddit.com/r/subreddit/comments/abc123/post_title/` 
- becomes: `https://www.reddit.com/r/subreddit/comments/abc123/post_title.json`

The response contains:
- `[0].data.children[0].data` - Post data (title, author, score, etc.)
- `[1].data.children[]` - Comments array

### Code Structure

```
app/
  ├── api/
  │   ├── reddit/route.ts      # Fetches Reddit post data
  │   ├── save/route.ts        # Saves thread to database
  │   └── threads/route.ts     # Gets/deletes saved threads
  ├── auth/
  │   ├── page.tsx             # Authentication page
  │   └── callback/route.ts    # OAuth callback handler
  ├── saved/
  │   └── page.tsx             # Saved threads list page
  └── page.tsx                 # Main page (fetch & save threads)

lib/
  ├── supabaseClient.ts        # Supabase client initialization
  ├── db.ts                    # Database helper functions
  └── types.ts                 # TypeScript type definitions
```

## Project Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Notes

- UI is kept basic and functional
- Nested comments are not extracted (only top-level comments)
- Supabase Row Level Security ensures users can only access their own threads
- Reddit API doesn't require authentication for public posts

## Troubleshooting

- **"Invalid Reddit URL"**: Make sure the URL is a valid Reddit post URL
- **Authentication errors**: Check that your Supabase credentials are correct in `.env.local`
- **Database errors**: Ensure the `threads` table is created and RLS policies are set up
- **OAuth not working**: Verify OAuth providers are configured in Supabase dashboard and redirect URLs are correct

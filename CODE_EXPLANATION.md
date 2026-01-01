# Code and Data Flow Explanation

## Overview

This application allows users to authenticate, fetch Reddit post data, and save threads to a database. Here's how the code is structured and how data flows through the system.

## Architecture

### Frontend (Client Components)
- `app/page.tsx` - Main page for fetching and saving Reddit threads
- `app/auth/page.tsx` - Authentication page (sign up/sign in)
- `app/saved/page.tsx` - List of saved threads

### Backend (API Routes)
- `app/api/reddit/route.ts` - Fetches Reddit post data
- `app/api/save/route.ts` - Saves thread to database
- `app/api/threads/route.ts` - Gets all saved threads for a user
- `app/api/threads/[id]/route.ts` - Deletes a specific thread
- `app/auth/callback/route.ts` - Handles OAuth callback

### Utilities
- `lib/supabaseClient.ts` - Supabase client initialization
- `lib/db.ts` - Database helper functions
- `lib/types.ts` - TypeScript type definitions

## Data Flow

### 1. Authentication Flow

```
User → /auth page → Supabase Auth
  ↓
Email/Password or OAuth (Google/GitHub)
  ↓
Session created → Redirect to home page
  ↓
Session stored in Supabase client (browser)
```

**Key Code:**
- `app/auth/page.tsx`: Handles sign up, sign in, and OAuth
- `app/auth/callback/route.ts`: Processes OAuth callback and exchanges code for session
- Session is managed by Supabase client-side SDK

### 2. Fetching Reddit Data Flow

```
User pastes URL → /api/reddit POST request
  ↓
Extract post ID from URL
  ↓
Append .json to Reddit URL → Fetch from Reddit API
  ↓
Parse JSON response:
  - Post data: data[0].data.children[0].data
  - Comments: data[1].data.children[] (first 20)
  ↓
Return structured data to frontend
```

**Key Code:**
- `app/api/reddit/route.ts`: 
  - Normalizes URL by appending `.json`
  - Fetches from Reddit's public JSON API
  - Extracts post title, author, score, and first 20 comments
  - Filters out deleted/removed comments

**Reddit API Details:**
- Reddit provides a public JSON API
- Any Reddit URL + `.json` returns JSON data
- No authentication required for public posts
- Response structure: `[post_data, comments_data]`

### 3. Saving Thread Flow

```
User clicks "Save Thread" → Frontend sends POST to /api/save
  ↓
Extract auth token from Authorization header
  ↓
Verify user with Supabase
  ↓
Insert into threads table:
  - user_id (from auth)
  - post_id, title, author, score
  - comments (JSONB array)
  - url
  ↓
Return success/error
```

**Key Code:**
- `app/page.tsx`: Gets session token and sends POST request
- `app/api/save/route.ts`: 
  - Validates authentication
  - Inserts data into Supabase `threads` table
  - Uses Row Level Security (RLS) to ensure user can only save their own threads

### 4. Viewing Saved Threads Flow

```
User navigates to /saved → GET /api/threads
  ↓
Extract auth token from Authorization header
  ↓
Verify user with Supabase
  ↓
Query threads table WHERE user_id = current_user.id
  ↓
Return array of saved threads
  ↓
Display in UI with delete functionality
```

**Key Code:**
- `app/saved/page.tsx`: Fetches and displays saved threads
- `app/api/threads/route.ts`: Returns all threads for authenticated user
- `app/api/threads/[id]/route.ts`: Deletes a thread (with user verification)

## Database Schema

```sql
threads table:
  - id: UUID (primary key)
  - user_id: UUID (foreign key to auth.users)
  - post_id: TEXT (Reddit post ID)
  - title: TEXT
  - author: TEXT
  - score: INTEGER
  - comments: JSONB (array of comment objects)
  - url: TEXT (original Reddit URL)
  - created_at: TIMESTAMP
```

**Row Level Security (RLS):**
- Users can only SELECT, INSERT, DELETE their own threads
- Policies use `auth.uid() = user_id` to enforce ownership

## Security Features

1. **Authentication Required**: All API routes check for valid auth token
2. **Row Level Security**: Database-level security ensures users can only access their own data
3. **User Verification**: Every database operation verifies the user owns the resource
4. **OAuth Support**: Secure OAuth flow with PKCE (handled by Supabase)

## Key Technologies

- **Next.js App Router**: Modern routing with server and client components
- **Supabase Auth**: Handles authentication, sessions, and OAuth
- **Supabase Database**: PostgreSQL with RLS for security
- **Reddit JSON API**: Public API, no scraping needed
- **TypeScript**: Type safety throughout the application

## Error Handling

- API routes return appropriate HTTP status codes (400, 401, 500)
- Frontend displays error messages to users
- Database errors are logged and returned as user-friendly messages
- Invalid Reddit URLs are caught and validated

## Future Enhancements (Not Implemented)

- Nested comment extraction
- Search/filter saved threads
- Export saved threads
- Pagination for saved threads
- Thread categories/tags


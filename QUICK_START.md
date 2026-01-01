# 🚀 Quick Start Guide

Get your Reddit Thread Saver app running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase (2 minutes)

1. Go to https://supabase.com and create a free account
2. Click "New Project"
3. Fill in:
   - Project name: `reddit-saver`
   - Database password: (choose a strong password)
   - Region: (choose closest to you)
4. Wait 1-2 minutes for project to be created

## Step 3: Get Credentials

1. In Supabase dashboard, click **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

## Step 4: Create Environment File

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=paste-your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-key-here
```

## Step 5: Set Up Database

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Open `supabase-schema.sql` file from this project
4. Copy ALL the SQL code
5. Paste into SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

## Step 6: Run the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 7: Test It!

1. You'll see the auth page
2. Click "Sign up" tab
3. Enter email and password (min 6 characters)
4. Check your email for verification (or skip for testing)
5. Sign in
6. Paste a Reddit URL, e.g.:
   ```
   https://www.reddit.com/r/programming/comments/1pzvo25/psa_be_aware_when_opening_take_home_challenges/
   ```
7. Click "Fetch Post"
8. Click "Save Thread"
9. Go to "Saved Threads" to see it!

---

## 🎯 That's It!

Your app is now running locally!

## 📚 Next Steps

- **Deploy to Vercel:** See `SETUP_AND_DEPLOYMENT.md`
- **Submit your project:** See `SUBMISSION_GUIDE.md`
- **Understand the code:** See `CODE_EXPLANATION.md`

## ❓ Troubleshooting

**"Invalid Supabase URL" error?**
- Check `.env.local` file exists
- Make sure no extra spaces in the values
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

**"Table doesn't exist" error?**
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check Table Editor in Supabase to see if `threads` table exists

**Can't sign up?**
- Check your email for verification link (or disable email verification in Supabase Auth settings for testing)

---

Need more help? Check the full guides in the repository!


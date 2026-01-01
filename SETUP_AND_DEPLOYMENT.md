# Setup, Running, and Deployment Guide

## 🚀 Running the App Locally

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Supabase

1. **Create a Supabase Project:**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up/login
   - Click "New Project"
   - Fill in project details (name, database password, region)
   - Wait for project to be created (takes 1-2 minutes)

2. **Get Your Project Credentials:**
   - In Supabase dashboard, go to **Settings** → **API**
   - Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy your **anon/public key** (long string starting with `eyJ...`)

3. **Create Environment File:**
   - Create a file named `.env.local` in the project root
   - Add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Set Up Database

1. **In Supabase Dashboard:**
   - Go to **SQL Editor**
   - Click **New Query**
   - Copy and paste the entire contents of `supabase-schema.sql`
   - Click **Run** (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

2. **Verify Table Created:**
   - Go to **Table Editor**
   - You should see a `threads` table

### Step 4: (Optional) Configure OAuth Providers

If you want Google/GitHub login:

1. **For Google:**
   - Go to **Authentication** → **Providers** → **Google**
   - Enable Google provider
   - Follow instructions to get OAuth credentials from Google Cloud Console
   - Add redirect URL: `http://localhost:3000/auth/callback` (for local)
   - Add redirect URL: `https://your-domain.com/auth/callback` (for production)

2. **For GitHub:**
   - Go to **Authentication** → **Providers** → **GitHub**
   - Enable GitHub provider
   - Create OAuth app on GitHub
   - Add redirect URL: `http://localhost:3000/auth/callback` (for local)
   - Add redirect URL: `https://your-domain.com/auth/callback` (for production)

### Step 5: Run the Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### Step 6: Test the App

1. Open http://localhost:3000
2. You'll be redirected to `/auth` if not logged in
3. Sign up with email/password (or use OAuth)
4. Go to home page
5. Paste a Reddit post URL (e.g., `https://www.reddit.com/r/programming/comments/1pzvo25/...`)
6. Click "Fetch Post"
7. Click "Save Thread"
8. View saved threads at `/saved`

---

## 🌐 Deployment Options

### Option 1: Deploy to Vercel (Recommended - Easiest)

Vercel is made by the Next.js team and is the easiest way to deploy.

#### Steps:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/reddit-saver.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables:**
   - In Vercel project settings, go to **Environment Variables**
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
   - Click **Deploy**

4. **Update Supabase Redirect URLs:**
   - In Supabase dashboard, go to **Authentication** → **URL Configuration**
   - Add your Vercel URL to **Redirect URLs**: `https://your-project.vercel.app/auth/callback`
   - Add to **Site URL**: `https://your-project.vercel.app`

5. **Done!** Your app is live at `https://your-project.vercel.app`

#### Vercel CLI (Alternative):

```bash
npm i -g vercel
vercel login
vercel
# Follow prompts, add environment variables when asked
```

---

### Option 2: Deploy to Netlify

1. **Push to GitHub** (same as above)

2. **Deploy:**
   - Go to [https://netlify.com](https://netlify.com)
   - Sign up/login
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Add Environment Variables:**
   - Go to **Site settings** → **Environment variables**
   - Add your Supabase credentials

4. **Update Supabase Redirect URLs:**
   - Add Netlify URL to Supabase redirect URLs

---

### Option 3: Deploy to Railway

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Deploy:**
   ```bash
   railway init
   railway up
   ```

3. **Add Environment Variables:**
   - In Railway dashboard, add your Supabase credentials

---

### Option 4: Self-Hosted (VPS/Docker)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Or use Docker:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

---

## 📦 Building for Production

```bash
# Build the app
npm run build

# Test production build locally
npm start
```

---

## 📝 Submission Checklist

When submitting your project, include:

### 1. **README.md** ✅ (Already created)
   - Setup instructions
   - Features list
   - Tech stack

### 2. **Environment Variables Template**
   Create `.env.example`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

### 3. **Database Schema** ✅ (supabase-schema.sql)
   - SQL file for easy setup

### 4. **Code Documentation** ✅ (CODE_EXPLANATION.md)
   - Explains data flow
   - Architecture overview

### 5. **Deployment URL** (if deployed)
   - Live demo link
   - Screenshots (optional)

### 6. **Project Structure**
   ```
   reddit-saver/
   ├── app/              # Next.js app directory
   ├── lib/             # Utilities
   ├── public/          # Static files
   ├── README.md        # Setup guide
   ├── CODE_EXPLANATION.md  # Code docs
   ├── supabase-schema.sql   # Database schema
   └── package.json     # Dependencies
   ```

---

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🔧 Troubleshooting

### "Invalid Supabase URL" Error
- Check `.env.local` file exists
- Verify credentials are correct (no extra spaces)
- Restart dev server after adding env variables

### "Table doesn't exist" Error
- Run `supabase-schema.sql` in Supabase SQL Editor
- Check table exists in Table Editor

### "Unauthorized" Error
- Check Supabase RLS policies are set up
- Verify user is logged in
- Check auth token is being sent

### OAuth Not Working
- Verify redirect URLs in Supabase match your domain
- Check OAuth provider credentials are correct
- Ensure callback route is accessible

### Build Errors
- Run `npm install` again
- Delete `node_modules` and `.next` folder, then reinstall
- Check Node.js version (should be 18+)

---

## 📱 Testing Checklist

Before submitting, test:

- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] OAuth login (if configured)
- [ ] Fetch Reddit post data
- [ ] Save a thread
- [ ] View saved threads
- [ ] Delete a saved thread
- [ ] Logout
- [ ] Error handling (invalid URLs, etc.)

---

## 🚢 Deployment Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use environment variables** in deployment platform
3. **Update Supabase redirect URLs** for production domain
4. **Test production build** locally before deploying
5. **Enable HTTPS** (automatic with Vercel/Netlify)
6. **Set up custom domain** (optional)

---

## 📞 Need Help?

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

## ✅ Final Submission Steps

1. **Code is complete** ✅
2. **README with setup instructions** ✅
3. **Database schema file** ✅
4. **Code documentation** ✅
5. **Test locally** - Make sure everything works
6. **Deploy** (optional but recommended)
7. **Submit:**
   - GitHub repository link
   - Live demo URL (if deployed)
   - Brief description of features

Good luck! 🎉


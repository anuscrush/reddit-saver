# Troubleshooting Guide

## Common Issues and Fixes

### Issue 1: "Invalid Supabase URL" or App Won't Start

**Problem:** Missing or incorrect Supabase credentials

**Solution:**
1. Create `.env.local` file in project root
2. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Restart the dev server (stop with Ctrl+C, then `npm run dev`)

**How to get credentials:**
- Go to https://supabase.com
- Create a project (free)
- Go to Settings → API
- Copy Project URL and anon public key

---

### Issue 2: "Table doesn't exist" Error

**Problem:** Database table not created

**Solution:**
1. Open Supabase dashboard
2. Go to SQL Editor
3. Open `supabase-schema.sql` from this project
4. Copy all the SQL code
5. Paste into SQL Editor
6. Click "Run"
7. Verify table exists in Table Editor

---

### Issue 3: Can't Sign Up/Sign In

**Problem:** Authentication not working

**Solutions:**
- Check Supabase credentials in `.env.local`
- Make sure you ran the database schema
- Check email for verification link (if email verification is enabled)
- Try disabling email verification in Supabase Auth settings for testing

---

### Issue 4: Reddit Fetch Not Working

**Problem:** Can't fetch Reddit data

**Solutions:**
- Check internet connection
- Verify Reddit URL is correct format
- Try a different Reddit post URL
- Check browser console for errors

---

### Issue 5: "Cannot save thread" Error

**Problem:** Save functionality not working

**Solutions:**
- Make sure you're logged in
- Verify database table exists (see Issue 2)
- Check browser console for specific error
- Verify Row Level Security policies are set up

---

### Issue 6: Build Errors

**Problem:** `npm run build` fails

**Solutions:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules .next
npm install

# Try building again
npm run build
```

---

### Issue 7: Port Already in Use

**Problem:** Port 3000 is already taken

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
```

---

## Quick Diagnostic Steps

1. **Check environment variables:**
   ```bash
   # Make sure .env.local exists
   cat .env.local
   ```

2. **Check if server is running:**
   ```bash
   npm run dev
   # Should see: "Ready on http://localhost:3000"
   ```

3. **Check browser console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

4. **Verify Supabase connection:**
   - Go to Supabase dashboard
   - Check if project is active
   - Verify API keys are correct

---

## Still Not Working?

1. **Check Node.js version:**
   ```bash
   node --version
   # Should be 18 or higher
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Check for TypeScript errors:**
   ```bash
   npm run lint
   ```

---

## Getting Help

If you're still stuck:
1. Check the error message in browser console
2. Check terminal/command prompt for errors
3. Verify all setup steps in README.md
4. Make sure Supabase project is set up correctly


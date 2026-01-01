-- Reddit Thread Saver Database Schema
-- Run this in your Supabase SQL Editor

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_threads_user_id ON threads(user_id);
CREATE INDEX IF NOT EXISTS idx_threads_created_at ON threads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running)
DROP POLICY IF EXISTS "Users can view own threads" ON threads;
DROP POLICY IF EXISTS "Users can insert own threads" ON threads;
DROP POLICY IF EXISTS "Users can delete own threads" ON threads;

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


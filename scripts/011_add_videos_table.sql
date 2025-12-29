-- Create videos table for memorial video content
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read and insert (anyone can add videos)
CREATE POLICY "videos_select_public"
  ON public.videos FOR SELECT
  USING (true);

CREATE POLICY "videos_insert_public"
  ON public.videos FOR INSERT
  WITH CHECK (true);

-- Allow users to delete their own videos
CREATE POLICY "videos_delete_own"
  ON public.videos FOR DELETE
  USING (auth.uid() = user_id);

-- Allow memorial owners to delete any video on their memorial
CREATE POLICY "videos_delete_memorial_owner"
  ON public.videos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = videos.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_videos_memorial_id ON public.videos(memorial_id);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);

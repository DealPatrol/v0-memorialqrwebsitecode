-- Create memorials table
CREATE TABLE IF NOT EXISTS public.memorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  birth_date DATE,
  death_date DATE,
  location TEXT,
  biography TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stories table
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create music table
CREATE TABLE IF NOT EXISTS public.music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT,
  audio_url TEXT NOT NULL,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access, but restrict writes
-- Memorials: Public read
CREATE POLICY "memorials_select_public"
  ON public.memorials FOR SELECT
  USING (true);

-- Stories: Public read and insert (anyone can add stories)
CREATE POLICY "stories_select_public"
  ON public.stories FOR SELECT
  USING (true);

CREATE POLICY "stories_insert_public"
  ON public.stories FOR INSERT
  WITH CHECK (true);

-- Messages: Public read and insert (anyone can add messages)
CREATE POLICY "messages_select_public"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "messages_insert_public"
  ON public.messages FOR INSERT
  WITH CHECK (true);

-- Photos: Public read and insert (anyone can add photos)
CREATE POLICY "photos_select_public"
  ON public.photos FOR SELECT
  USING (true);

CREATE POLICY "photos_insert_public"
  ON public.photos FOR INSERT
  WITH CHECK (true);

-- Music: Public read and insert (anyone can add music)
CREATE POLICY "music_select_public"
  ON public.music FOR SELECT
  USING (true);

CREATE POLICY "music_insert_public"
  ON public.music FOR INSERT
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_memorials_slug ON public.memorials(slug);
CREATE INDEX IF NOT EXISTS idx_stories_memorial_id ON public.stories(memorial_id);
CREATE INDEX IF NOT EXISTS idx_messages_memorial_id ON public.messages(memorial_id);
CREATE INDEX IF NOT EXISTS idx_photos_memorial_id ON public.photos(memorial_id);
CREATE INDEX IF NOT EXISTS idx_music_memorial_id ON public.music(memorial_id);

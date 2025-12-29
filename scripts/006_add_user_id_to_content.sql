-- Add user_id to messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- Add user_id to photos table
ALTER TABLE photos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON photos(user_id);

-- Add user_id to stories table
ALTER TABLE stories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);

-- Add user_id to music table
ALTER TABLE music ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_music_user_id ON music(user_id);

-- Enable RLS on content tables
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE music ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "messages_select_all" ON messages FOR SELECT USING (true);
CREATE POLICY "messages_insert_authenticated" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "messages_delete_own_or_memorial_owner" ON messages FOR DELETE USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT user_id FROM memorials WHERE id = messages.memorial_id)
);

-- Photos policies
CREATE POLICY "photos_select_all" ON photos FOR SELECT USING (true);
CREATE POLICY "photos_insert_authenticated" ON photos FOR INSERT WITH CHECK (true);
CREATE POLICY "photos_delete_own_or_memorial_owner" ON photos FOR DELETE USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT user_id FROM memorials WHERE id = photos.memorial_id)
);

-- Stories policies
CREATE POLICY "stories_select_all" ON stories FOR SELECT USING (true);
CREATE POLICY "stories_insert_authenticated" ON stories FOR INSERT WITH CHECK (true);
CREATE POLICY "stories_delete_own_or_memorial_owner" ON stories FOR DELETE USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT user_id FROM memorials WHERE id = stories.memorial_id)
);

-- Music policies
CREATE POLICY "music_select_all" ON music FOR SELECT USING (true);
CREATE POLICY "music_insert_authenticated" ON music FOR INSERT WITH CHECK (true);
CREATE POLICY "music_delete_own_or_memorial_owner" ON music FOR DELETE USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT user_id FROM memorials WHERE id = music.memorial_id)
);

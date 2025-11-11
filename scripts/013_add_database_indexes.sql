-- Add indexes for better query performance with large datasets
-- This will significantly speed up memorial page loads and searches

-- Index for fetching photos by memorial
CREATE INDEX IF NOT EXISTS idx_photos_memorial_id ON photos(memorial_id);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);

-- Index for fetching videos by memorial
CREATE INDEX IF NOT EXISTS idx_videos_memorial_id ON videos(memorial_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- Index for fetching stories by memorial
CREATE INDEX IF NOT EXISTS idx_stories_memorial_id ON stories(memorial_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);

-- Index for fetching messages by memorial
CREATE INDEX IF NOT EXISTS idx_messages_memorial_id ON messages(memorial_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Index for fetching music by memorial
CREATE INDEX IF NOT EXISTS idx_music_memorial_id ON music(memorial_id);
CREATE INDEX IF NOT EXISTS idx_music_created_at ON music(created_at DESC);

-- Index for fetching milestones by memorial
CREATE INDEX IF NOT EXISTS idx_milestones_memorial_id ON milestones(memorial_id);
CREATE INDEX IF NOT EXISTS idx_milestones_date ON milestones(date DESC);

-- Index for memorial lookups by slug
CREATE INDEX IF NOT EXISTS idx_memorials_slug ON memorials(slug);

-- Index for user's memorials
CREATE INDEX IF NOT EXISTS idx_memorials_user_id ON memorials(user_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_photos_memorial_created ON photos(memorial_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_memorial_created ON videos(memorial_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_memorial_created ON stories(memorial_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_memorial_created ON messages(memorial_id, created_at DESC);

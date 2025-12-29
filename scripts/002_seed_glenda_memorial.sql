-- Insert Glenda's memorial
INSERT INTO public.memorials (
  slug,
  full_name,
  birth_date,
  death_date,
  location,
  biography,
  profile_image_url
) VALUES (
  'glenda-kelso',
  'Glenda Jane Kelso',
  '1952-07-27',
  '2025-08-27',
  'Cullman, AL',
  'A life so beautifully lived deserves to be beautifully remembered. Today, we gather not only in sorrow but in profound gratitude for the extraordinary woman we were blessed to know—Glenda Jane Kelso. Glenda was the heart of her home and a force of nature in the lives of all who knew her.',
  '/glenda-memorial-portrait.jpeg'
) ON CONFLICT (slug) DO NOTHING;

-- Get the memorial ID for Glenda
DO $$
DECLARE
  glenda_id UUID;
BEGIN
  SELECT id INTO glenda_id FROM public.memorials WHERE slug = 'glenda-kelso';

  -- Insert initial photos for Glenda
  INSERT INTO public.photos (memorial_id, image_url, caption) VALUES
    (glenda_id, '/glenda-memorial-portrait.jpeg', 'Glenda in her favorite garden'),
    (glenda_id, '/glenda-garden-couple.jpeg', 'With her beloved husband in their garden'),
    (glenda_id, '/glenda-christmas-daughter.jpeg', 'Christmas morning with her daughter'),
    (glenda_id, '/glenda-hospital-visit.jpeg', 'Visiting friends at the hospital'),
    (glenda_id, '/glenda-family-baseball.jpeg', 'Family baseball game'),
    (glenda_id, '/glenda-restaurant-couple.jpeg', 'Anniversary dinner'),
    (glenda_id, '/glenda-hospital-bedside.jpeg', 'Comforting a patient'),
    (glenda_id, '/glenda-beach-walk.jpeg', 'Beach walk with family')
  ON CONFLICT DO NOTHING;

  -- Insert memorial music
  INSERT INTO public.music (memorial_id, title, artist, audio_url, duration) VALUES
    (glenda_id, 'Amazing Grace', 'Traditional', '/audio/amazing-grace.mp3', '3:45'),
    (glenda_id, 'How Great Thou Art', 'Traditional', '/audio/how-great-thou-art.mp3', '4:12'),
    (glenda_id, 'In the Garden', 'Traditional', '/audio/in-the-garden.mp3', '3:28')
  ON CONFLICT DO NOTHING;
END $$;

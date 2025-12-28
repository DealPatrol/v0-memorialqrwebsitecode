-- First, let's get a memorial ID to use
DO $$
DECLARE
  memorial_id UUID;
  parent_id UUID;
  grandparent_id UUID;
  spouse_id UUID;
  child_id UUID;
BEGIN
  -- Get the first memorial ID
  SELECT id INTO memorial_id FROM memorials LIMIT 1;
  
  IF memorial_id IS NOT NULL THEN
    -- Clear existing family members for this memorial
    DELETE FROM family_members WHERE memorial_id = memorial_id;
    
    -- Clear existing stories for this memorial
    DELETE FROM stories WHERE memorial_id = memorial_id;
    
    -- Add grandparents
    INSERT INTO family_members (memorial_id, name, relationship, birth_date, death_date, bio, parent_id)
    VALUES (
      memorial_id,
      'Eleanor Mitchell',
      'Grandmother',
      '1932-03-15',
      '2018-11-22',
      'Eleanor was born in Springfield and worked as a nurse for over 40 years. She was known for her homemade apple pie and her love of gardening. She raised three children and was a devoted grandmother to seven grandchildren.',
      NULL
    ) RETURNING id INTO grandparent_id;
    
    -- Add parent
    INSERT INTO family_members (memorial_id, name, relationship, birth_date, bio, parent_id)
    VALUES (
      memorial_id,
      'Sarah Mitchell',
      'Mother',
      '1958-08-10',
      'Sarah is a retired elementary school teacher who taught for 35 years. She loves reading, traveling, and spending time with her grandchildren.',
      grandparent_id
    ) RETURNING id INTO parent_id;
    
    -- Add spouse
    INSERT INTO family_members (memorial_id, name, relationship, birth_date, death_date, bio, parent_id)
    VALUES (
      memorial_id,
      'Thomas Mitchell',
      'Father',
      '1956-04-22',
      '2023-01-15',
      'Thomas was a dedicated father and husband who worked as an architect. He loved fishing, woodworking, and coaching his children''s baseball teams. His laugh could fill a room, and he never met a stranger.',
      NULL
    ) RETURNING id INTO spouse_id;
    
    -- Add siblings
    INSERT INTO family_members (memorial_id, name, relationship, birth_date, bio, parent_id)
    VALUES
      (memorial_id, 'Michael Mitchell', 'Brother', '1982-06-12', 'Michael lives in Portland with his wife and two children. He works as a software engineer and enjoys hiking and photography.', parent_id),
      (memorial_id, 'Jennifer Mitchell', 'Sister', '1985-09-03', 'Jennifer is a pediatrician in Boston. She volunteers at a free clinic on weekends and loves to travel internationally.', parent_id);
      
    -- Add children
    INSERT INTO family_members (memorial_id, name, relationship, birth_date, bio, parent_id)
    VALUES (
      memorial_id,
      'Emma Mitchell',
      'Daughter',
      '2010-07-18',
      'Emma is in middle school and loves playing soccer and the violin. She inherited her grandfather''s artistic talent and enjoys drawing.',
      spouse_id
    ) RETURNING id INTO child_id;
    
    -- Add realistic tributes/stories
    INSERT INTO stories (memorial_id, author_name, content, is_approved)
    VALUES
      (memorial_id, 'Karen Johnson', 'Tom was my neighbor for over 15 years. He was always the first to offer help when anyone needed it. I remember when a storm knocked down a tree in my yard, Tom was there with his chainsaw before I even called. His kindness and generosity touched so many lives in our community.', true),
      
      (memorial_id, 'David Wilson', 'I worked with Tom at Johnson & Associates for nearly a decade. He was not only brilliant at his job but also made the workplace better for everyone with his positive attitude and mentorship. He helped me through some tough projects and always made time to listen. The office hasn''t been the same without him.', true),
      
      (memorial_id, 'Maria Rodriguez', 'Tom coached my son''s little league team for three seasons. He had such patience with the kids and taught them not just about baseball but about teamwork and perseverance. My son still talks about "Coach Tom" and the lessons he learned from him.', true),
      
      (memorial_id, 'Robert Chen', 'I met Tom through our shared love of fishing. We spent countless early mornings on the lake, sometimes talking for hours, sometimes in comfortable silence. He had a way of making every fishing trip memorable, even when we didn''t catch anything. I miss those mornings and my dear friend.', true),
      
      (memorial_id, 'Susan Taylor', 'Tom and Sarah were fixtures at every school event. As a teacher at Westside Elementary, I saw how devoted Tom was to his children''s education. He volunteered countless hours and always expressed gratitude to the teachers and staff. His legacy lives on in the many young lives he touched.', true);
  END IF;
END $$;

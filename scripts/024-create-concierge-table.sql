-- Create concierge_requests table for managing concierge service orders
CREATE TABLE IF NOT EXISTS public.concierge_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Deceased person information
  deceased_name TEXT NOT NULL,
  birth_date DATE,
  death_date DATE,
  obituary TEXT,
  
  -- Delivery choice
  delivery_type VARCHAR(50) NOT NULL CHECK (delivery_type IN ('digital', 'plaque')),
  plaque_color VARCHAR(50),
  
  -- Files uploaded
  photos_url TEXT[],
  videos_url TEXT[],
  documents_url TEXT[],
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delivered', 'cancelled')),
  admin_notes TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Memorial details
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE SET NULL,
  digital_memorial_url TEXT,
  qr_code_url TEXT,
  
  -- Dates
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.concierge_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies - simplified to avoid type mismatches
CREATE POLICY "Users can view own concierge requests"
  ON public.concierge_requests
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create concierge requests"
  ON public.concierge_requests
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Create indexes for performance
CREATE INDEX idx_concierge_status ON public.concierge_requests(status);
CREATE INDEX idx_concierge_user ON public.concierge_requests(user_id);
CREATE INDEX idx_concierge_assigned ON public.concierge_requests(assigned_to);

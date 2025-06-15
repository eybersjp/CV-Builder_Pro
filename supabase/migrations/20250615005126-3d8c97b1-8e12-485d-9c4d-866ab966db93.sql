
-- 1. Create the `templates` table
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  preview_image_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE
);

-- 2. Insert initial sample templates
INSERT INTO public.templates (name, preview_image_url, is_premium) VALUES
  ('Modern Blue', 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7', FALSE),
  ('Sleek Grey', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b', FALSE),
  ('Tech Black', 'https://images.unsplash.com/photo-1518770660439-4636190af475', FALSE),
  ('Code Green', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6', FALSE),
  ('Pro Tan', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d', TRUE);

-- 3. (Recommended) Allow everyone to read templates, but do NOT enable RLS since no sensitive data is stored.

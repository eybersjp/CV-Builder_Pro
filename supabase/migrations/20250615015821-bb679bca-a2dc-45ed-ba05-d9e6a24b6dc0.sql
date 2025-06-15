
-- Create the subscriptions table for user subscription management
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id),
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE
);

-- Enable Row Level Security (RLS) for security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view their subscription"
  ON public.subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own subscription row
CREATE POLICY "Users can insert their subscription"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own subscription row
CREATE POLICY "Users can update their subscription"
  ON public.subscriptions
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own subscription row
CREATE POLICY "Users can delete their subscription"
  ON public.subscriptions
  FOR DELETE
  USING (user_id = auth.uid());

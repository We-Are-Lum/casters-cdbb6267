
-- Characters table: each row is a persistent playable character
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  faction TEXT NOT NULL,
  backstory TEXT NOT NULL,
  portrait_index INTEGER NOT NULL DEFAULT 0,
  lum_balance INTEGER NOT NULL DEFAULT 100,
  fgld_balance INTEGER NOT NULL DEFAULT 50,
  reputation_score INTEGER NOT NULL DEFAULT 0,
  reputation_tags TEXT[] DEFAULT '{}',
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can browse characters)
CREATE POLICY "Anyone can view characters"
  ON public.characters FOR SELECT
  USING (true);

-- Public insert (character creation from the selection screen)
CREATE POLICY "Anyone can create characters"
  ON public.characters FOR INSERT
  WITH CHECK (true);

-- Public update (anyone can play as any character)
CREATE POLICY "Anyone can update characters"
  ON public.characters FOR UPDATE
  USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

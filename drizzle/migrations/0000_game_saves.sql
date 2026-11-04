CREATE TABLE public.game_saves (
 user_id uuid PRIMARY KEY,
 state jsonb NOT NULL DEFAULT '{}'::jsonb,
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT game_state_object CHECK (jsonb_typeof(state) = 'object')
);
GRANT SELECT, INSERT, UPDATE ON public.game_saves TO authenticated;
GRANT ALL ON public.game_saves TO service_role;
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own game" ON public.game_saves FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Create own game" ON public.game_saves FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own game" ON public.game_saves FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
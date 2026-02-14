
-- Create a security definer function to check role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = _user_id LIMIT 1;
$$;

-- Restrict access
REVOKE EXECUTE ON FUNCTION public.get_user_role FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_role TO authenticated;

-- Fix the doctor profile viewing policy
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;

CREATE POLICY "Doctors can view patient profiles" ON public.profiles
  FOR SELECT USING (
    public.get_user_role(auth.uid()) = 'doctor'
  );

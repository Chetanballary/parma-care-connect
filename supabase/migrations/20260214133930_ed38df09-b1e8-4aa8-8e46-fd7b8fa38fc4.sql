
-- Allow any authenticated user to view doctor profiles (for appointment booking)
CREATE POLICY "Anyone can view doctor profiles"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (role = 'doctor');

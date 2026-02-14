
-- Fix profiles: drop recursive policy and recreate using JWT
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view patient profiles" ON public.profiles
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'doctor'
  );

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Fix appointments: drop restrictive and recreate as permissive
DROP POLICY IF EXISTS "Patients see own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients cancel appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors see their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors update appointments" ON public.appointments;

CREATE POLICY "Patients see own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors see their appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Patients create appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients cancel appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Doctors update appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = doctor_id);

-- Fix patient_records too
DROP POLICY IF EXISTS "Patients see own records" ON public.patient_records;
DROP POLICY IF EXISTS "Doctors see their patient records" ON public.patient_records;
DROP POLICY IF EXISTS "Doctors create records" ON public.patient_records;
DROP POLICY IF EXISTS "Doctors update records" ON public.patient_records;

CREATE POLICY "Patients see own records" ON public.patient_records
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors see their patient records" ON public.patient_records
  FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors create records" ON public.patient_records
  FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors update records" ON public.patient_records
  FOR UPDATE USING (auth.uid() = doctor_id);

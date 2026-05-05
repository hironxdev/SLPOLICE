-- Run this block in the Supabase SQL Editor

-- 1. Create a users reference table
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text,
  email text UNIQUE,
  nic text UNIQUE,
  role text DEFAULT 'user'
);

-- 2. Create the cases table
CREATE TABLE public.cases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id),
  complaint_type text,
  description text,
  status text DEFAULT 'Pending',
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Create case updates table
CREATE TABLE public.case_updates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid REFERENCES public.cases(id),
  admin_id uuid REFERENCES public.users(id),
  note text,
  status_change text,
  timestamp timestamp with time zone DEFAULT now()
);

-- 4. Create files metadata table
CREATE TABLE public.files (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid REFERENCES public.cases(id),
  file_path text,
  uploaded_by uuid REFERENCES public.users(id),
  uploaded_at timestamp with time zone DEFAULT now()
);

-- Company Marketplace schema
-- Run this in the Supabase SQL Editor for a new project.

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null check (price >= 0),
  industry text not null,
  seller_id uuid not null references auth.users (id) on delete cascade,
  seller_email text,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.companies add column if not exists seller_email text;
alter table public.companies add column if not exists created_at timestamptz default now();
alter table public.companies add column if not exists image_url text;
alter table public.companies add column if not exists industry text;
alter table public.companies add column if not exists description text;

create table if not exists public.company_interests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  buyer_email text
);

alter table public.company_interests add column if not exists buyer_email text;

create unique index if not exists company_interests_company_user_idx
  on public.company_interests (company_id, user_id);

alter table public.companies enable row level security;
alter table public.company_interests enable row level security;

drop policy if exists "anyone can read companies" on public.companies;
drop policy if exists "sellers can insert companies" on public.companies;
drop policy if exists "sellers can update own companies" on public.companies;
drop policy if exists "sellers can delete own companies" on public.companies;
drop policy if exists "anyone can read interests" on public.company_interests;
drop policy if exists "users can insert their interest" on public.company_interests;

create policy "anyone can read companies"
  on public.companies for select
  using (true);

create policy "sellers can insert companies"
  on public.companies for insert
  to authenticated
  with check (auth.uid() = seller_id);

create policy "sellers can update own companies"
  on public.companies for update
  to authenticated
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

create policy "sellers can delete own companies"
  on public.companies for delete
  to authenticated
  using (auth.uid() = seller_id);

create policy "anyone can read interests"
  on public.company_interests for select
  using (true);

create policy "users can insert their interest"
  on public.company_interests for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Optional helper if older rows do not store seller_email
create or replace function public.get_user_emails(user_ids uuid[])
returns table (id uuid, email text, full_name text)
language sql
security definer
set search_path = public
as $$
  select
    u.id,
    u.email::text,
    u.raw_user_meta_data->>'full_name' as full_name
  from auth.users u
  where u.id = any(user_ids);
$$;

grant execute on function public.get_user_emails(uuid[]) to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('company-images', 'company-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view company images" on storage.objects;
drop policy if exists "Authenticated users can upload company images" on storage.objects;
drop policy if exists "Users can update company images" on storage.objects;
drop policy if exists "Users can delete company images" on storage.objects;

create policy "Public can view company images"
on storage.objects
for select
to public
using (bucket_id = 'company-images');

create policy "Authenticated users can upload company images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'company-images');

create policy "Users can update company images"
on storage.objects
for update
to authenticated
using (bucket_id = 'company-images');

create policy "Users can delete company images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'company-images');

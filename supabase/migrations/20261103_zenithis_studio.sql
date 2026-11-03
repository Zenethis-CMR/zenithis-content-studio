-- Zenithis Content Studio • Supabase schema v1
-- Run in the SQL editor of the chosen Supabase project.
-- IMPORTANT: bootstrap administrators after they have signed in using the SQL below.
create extension if not exists pgcrypto;
create table if not exists public.studio_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  brand_id text not null check (brand_id in ('bonas','lzo')),
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now(),
  primary key (user_id, brand_id)
);
create table if not exists public.studio_documents (
  brand_id text primary key check (brand_id in ('bonas','lzo')),
  payload jsonb not null,
  version integer not null default 1 check(version>0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
create or replace function public.studio_is_member(p_brand text)
returns boolean language sql stable security definer set search_path=''
as $$ select exists (select 1 from public.studio_members m
  where m.user_id = (select auth.uid()) and m.brand_id=p_brand); $$;
revoke all on function public.studio_is_member(text) from public;
grant execute on function public.studio_is_member(text) to authenticated;
alter table public.studio_members enable row level security;
alter table public.studio_documents enable row level security;
drop policy if exists "members can view own membership" on public.studio_members;
create policy "members can view own membership" on public.studio_members
  for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists "studio documents select" on public.studio_documents;
create policy "studio documents select" on public.studio_documents
  for select to authenticated using (public.studio_is_member(brand_id));
drop policy if exists "studio documents insert" on public.studio_documents;
create policy "studio documents insert" on public.studio_documents
  for insert to authenticated with check (public.studio_is_member(brand_id) and updated_by=(select auth.uid()));
drop policy if exists "studio documents update" on public.studio_documents;
create policy "studio documents update" on public.studio_documents
  for update to authenticated using (public.studio_is_member(brand_id))
  with check (public.studio_is_member(brand_id) and updated_by=(select auth.uid()));
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('studio-media','studio-media',false,26214400,
 array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','application/pdf'])
on conflict (id) do update set public=false, file_size_limit=26214400,
allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "studio storage read" on storage.objects;
create policy "studio storage read" on storage.objects for select to authenticated
using (bucket_id='studio-media' and public.studio_is_member(split_part(name,'/',1)));
drop policy if exists "studio storage upload" on storage.objects;
create policy "studio storage upload" on storage.objects for insert to authenticated
with check (bucket_id='studio-media' and public.studio_is_member(split_part(name,'/',1)));
drop policy if exists "studio storage delete" on storage.objects;
create policy "studio storage delete" on storage.objects for delete to authenticated
using (bucket_id='studio-media' and public.studio_is_member(split_part(name,'/',1)));
-- After the owner signs in once by magic link, replace the email below and run:
-- insert into public.studio_members (user_id, brand_id, role)
-- select u.id,b.brand_id,'admin' from auth.users u
-- cross join (values ('bonas'),('lzo')) as b(brand_id)
-- where u.email='YOUR_ACCOUNT_EMAIL@example.com'
-- on conflict (user_id,brand_id) do update set role='admin';
-- Never put a service_role key or database password in NEXT_PUBLIC_* variables.

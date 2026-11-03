-- Zenithis Content Studio: editorial libraries live inside Supabase, not public frontend bundles.
create table if not exists public.studio_libraries (
  brand_id text primary key check(brand_id in ('bonas','lzo')),
  payload jsonb not null,
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
alter table public.studio_libraries enable row level security;
grant select, update on public.studio_libraries to authenticated;
revoke all on public.studio_libraries from anon;
drop policy if exists "studio libraries select" on public.studio_libraries;
create policy "studio libraries select" on public.studio_libraries
  for select to authenticated using(studio_private.is_member(brand_id));
drop policy if exists "studio libraries update" on public.studio_libraries;
create policy "studio libraries update" on public.studio_libraries
  for update to authenticated using(studio_private.can_edit(brand_id))
  with check(studio_private.can_edit(brand_id) and updated_by=(select auth.uid()));
-- Content seeding is a separate one-time owner-only import and is never committed to public git.

-- Supabase RLS hardening for Zenithis Content Studio
-- Stored in the repository to match the migration applied to production.
create schema if not exists studio_private;
revoke all on schema studio_private from public, anon;
grant usage on schema studio_private to authenticated;
create or replace function studio_private.is_member(p_brand text)
returns boolean language sql stable security definer set search_path=''
as $$
  select exists (
    select 1 from public.studio_members m
    where m.user_id=(select auth.uid()) and m.brand_id=p_brand
  )
$$;
revoke all on function studio_private.is_member(text) from public, anon;
grant execute on function studio_private.is_member(text) to authenticated;
drop policy if exists "studio documents select" on public.studio_documents;
create policy "studio documents select" on public.studio_documents
  for select to authenticated using (studio_private.is_member(brand_id));
drop policy if exists "studio documents insert" on public.studio_documents;
create policy "studio documents insert" on public.studio_documents
  for insert to authenticated with check (
    studio_private.is_member(brand_id) and updated_by=(select auth.uid())
  );
drop policy if exists "studio documents update" on public.studio_documents;
create policy "studio documents update" on public.studio_documents
  for update to authenticated using (studio_private.is_member(brand_id))
  with check (studio_private.is_member(brand_id) and updated_by=(select auth.uid()));
drop policy if exists "studio storage read" on storage.objects;
create policy "studio storage read" on storage.objects for select to authenticated
  using (bucket_id='studio-media' and studio_private.is_member(split_part(name,'/',1)));
drop policy if exists "studio storage upload" on storage.objects;
create policy "studio storage upload" on storage.objects for insert to authenticated
  with check (bucket_id='studio-media' and studio_private.is_member(split_part(name,'/',1)));
drop policy if exists "studio storage delete" on storage.objects;
create policy "studio storage delete" on storage.objects for delete to authenticated
  using (bucket_id='studio-media' and studio_private.is_member(split_part(name,'/',1)));
drop function if exists public.studio_is_member(text);
grant usage on schema public to authenticated;
grant select, insert, update on table public.studio_documents to authenticated;
grant select on table public.studio_members to authenticated;

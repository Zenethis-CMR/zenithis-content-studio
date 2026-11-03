-- Zenithis Content Studio — permissions séparées par marque.
-- IMPORTANT : l'adresse du super-administrateur est enregistrée UNIQUEMENT dans Supabase.
-- Ce fichier public ne contient aucun compte personnel ni secret.

create table if not exists public.studio_superadmins (
  email text primary key check (email = lower(btrim(email))),
  created_at timestamptz not null default now()
);
create table if not exists public.studio_brand_access (
  email text not null check (email=lower(btrim(email)) and length(email) between 5 and 254 and position('@' in email)>1),
  brand_id text not null check (brand_id in ('bonas','lzo')),
  role text not null check (role in ('owner','editor','viewer')),
  granted_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  primary key(email,brand_id)
);
alter table public.studio_superadmins enable row level security;
alter table public.studio_brand_access enable row level security;
grant select on public.studio_superadmins to authenticated;
grant select,insert,update,delete on public.studio_brand_access to authenticated;
revoke all on public.studio_superadmins,public.studio_brand_access from anon;
create or replace function studio_private.verified_email()
returns text language sql stable security definer set search_path=''
as $$ select lower(u.email) from auth.users u where u.id=(select auth.uid()) and u.email_confirmed_at is not null limit 1 $$;
create or replace function studio_private.is_superadmin()
returns boolean language sql stable security definer set search_path=''
as $$ select exists(select 1 from public.studio_superadmins s where s.email=studio_private.verified_email()) $$;
create or replace function studio_private.brand_role(p_brand text)
returns text language sql stable security definer set search_path=''
as $$ select case when studio_private.is_superadmin() then 'superadmin'
else (select a.role from public.studio_brand_access a where a.email=studio_private.verified_email() and a.brand_id=p_brand) end $$;
create or replace function studio_private.is_member(p_brand text)
returns boolean language sql stable security definer set search_path=''
as $$ select studio_private.brand_role(p_brand) is not null $$;
create or replace function studio_private.can_edit(p_brand text)
returns boolean language sql stable security definer set search_path=''
as $$ select studio_private.brand_role(p_brand) in ('superadmin','owner','editor') $$;
create or replace function studio_private.is_manager(p_brand text)
returns boolean language sql stable security definer set search_path=''
as $$ select studio_private.brand_role(p_brand) in ('superadmin','owner') $$;
create or replace function studio_private.may_grant(p_brand text,p_role text)
returns boolean language sql stable security definer set search_path=''
as $$ select case when studio_private.is_superadmin() then p_role in ('owner','editor','viewer')
else studio_private.brand_role(p_brand)='owner' and p_role in ('editor','viewer') end $$;
revoke all on function studio_private.verified_email() from public,anon;
revoke all on function studio_private.is_superadmin() from public,anon;
revoke all on function studio_private.brand_role(text) from public,anon;
revoke all on function studio_private.is_member(text) from public,anon;
revoke all on function studio_private.can_edit(text) from public,anon;
revoke all on function studio_private.is_manager(text) from public,anon;
revoke all on function studio_private.may_grant(text,text) from public,anon;
grant usage on schema studio_private to authenticated;
grant execute on function studio_private.verified_email() to authenticated;
grant execute on function studio_private.is_superadmin() to authenticated;
grant execute on function studio_private.brand_role(text) to authenticated;
grant execute on function studio_private.is_member(text) to authenticated;
grant execute on function studio_private.can_edit(text) to authenticated;
grant execute on function studio_private.is_manager(text) to authenticated;
grant execute on function studio_private.may_grant(text,text) to authenticated;
drop policy if exists "studio admins own email" on public.studio_superadmins;
create policy "studio admins own email" on public.studio_superadmins
 for select to authenticated using (email=studio_private.verified_email());
drop policy if exists "studio brand access list" on public.studio_brand_access;
create policy "studio brand access list" on public.studio_brand_access
 for select to authenticated using (email=studio_private.verified_email() or studio_private.is_manager(brand_id));
drop policy if exists "studio brand access grant" on public.studio_brand_access;
create policy "studio brand access grant" on public.studio_brand_access
 for insert to authenticated with check (studio_private.may_grant(brand_id,role) and granted_by=(select auth.uid()));
drop policy if exists "studio brand access update" on public.studio_brand_access;
create policy "studio brand access update" on public.studio_brand_access
 for update to authenticated using (studio_private.is_manager(brand_id) and (role<>'owner' or studio_private.is_superadmin()))
 with check (studio_private.may_grant(brand_id,role) and granted_by=(select auth.uid()));
drop policy if exists "studio brand access revoke" on public.studio_brand_access;
create policy "studio brand access revoke" on public.studio_brand_access
 for delete to authenticated using (studio_private.is_manager(brand_id) and (role<>'owner' or studio_private.is_superadmin()));
drop policy if exists "studio documents select" on public.studio_documents;
create policy "studio documents select" on public.studio_documents
 for select to authenticated using (studio_private.is_member(brand_id));
drop policy if exists "studio documents insert" on public.studio_documents;
create policy "studio documents insert" on public.studio_documents
 for insert to authenticated with check (studio_private.can_edit(brand_id) and updated_by=(select auth.uid()));
drop policy if exists "studio documents update" on public.studio_documents;
create policy "studio documents update" on public.studio_documents
 for update to authenticated using (studio_private.can_edit(brand_id))
 with check (studio_private.can_edit(brand_id) and updated_by=(select auth.uid()));
drop policy if exists "studio storage read" on storage.objects;
create policy "studio storage read" on storage.objects
 for select to authenticated using (bucket_id='studio-media' and studio_private.is_member(split_part(name,'/',1)));
drop policy if exists "studio storage upload" on storage.objects;
create policy "studio storage upload" on storage.objects
 for insert to authenticated with check (bucket_id='studio-media' and studio_private.can_edit(split_part(name,'/',1)));
drop policy if exists "studio storage delete" on storage.objects;
create policy "studio storage delete" on storage.objects
 for delete to authenticated using (bucket_id='studio-media' and studio_private.can_edit(split_part(name,'/',1)));

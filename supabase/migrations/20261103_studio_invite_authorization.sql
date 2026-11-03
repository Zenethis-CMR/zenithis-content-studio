-- RPC used by the secure Supabase Edge Function to verify the actual signed-in inviter.
-- Caller identity is derived from auth.uid() via studio_private.may_grant.
create or replace function public.studio_may_invite(p_brand text,p_role text)
returns boolean
language sql stable security invoker set search_path=''
as $$
 select coalesce(studio_private.may_grant(p_brand,p_role),false)
$$;
revoke execute on function public.studio_may_invite(text,text) from public,anon;
grant execute on function public.studio_may_invite(text,text) to authenticated;

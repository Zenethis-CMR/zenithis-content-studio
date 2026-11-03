-- Zenithis Content Studio: secure Supabase's generated public DDL event-trigger function.
-- The function itself is reserved for internal event triggers; browser API clients must not execute it.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

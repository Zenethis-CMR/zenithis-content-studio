-- Zenithis Content Studio — persistence, managed by server-side API.
-- Run this migration in Supabase SQL Editor. Never put a service-role key in browser code.
create table if not exists public.studio_workspaces (
 brand text primary key check (brand in ('bonas','lzo')),
 state jsonb not null,
 version integer not null default 1 check (version >= 1),
 updated_at timestamptz not null default now()
);
alter table public.studio_workspaces enable row level security;
revoke all on public.studio_workspaces from anon, authenticated;
-- No browser policies: only the Vercel backend uses Supabase's protected service role.
-- The application verifies an HttpOnly signed session cookie before accessing these rows.
create index if not exists studio_workspaces_updated_idx on public.studio_workspaces(updated_at desc);

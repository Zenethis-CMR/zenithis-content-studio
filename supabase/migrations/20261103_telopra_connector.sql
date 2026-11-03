-- TeloPra / Evolution API read-only bridge for Zenithis Content Studio.
-- Sensitive connector credentials are stored ONLY in Supabase Vault (encrypted).
create table if not exists studio_private.telopra_connectors (
  brand_id text primary key check (brand_id in ('bonas','lzo')),
  base_url text not null,
  instance_name text not null,
  vault_secret_id uuid not null,
  connected_by uuid references auth.users(id),
  connected_at timestamptz not null default now()
);
revoke all on table studio_private.telopra_connectors from public,anon,authenticated;
create table if not exists public.studio_telopra_status (
  brand_id text primary key check(brand_id in ('bonas','lzo')),
  provider text not null default 'evolution-api',
  instance_name text,
  connection_state text not null default 'not_connected',
  last_synced_at timestamptz,
  last_error text,
  chats_count integer not null default 0,
  messages_count integer not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists public.studio_telopra_chats (
 brand_id text not null check(brand_id in ('bonas','lzo')),
 remote_jid text not null,
 display_name text,
 kind text not null default 'contact',
 unread_count integer not null default 0,
 last_message_preview text,
 last_message_at timestamptz,
 updated_at timestamptz not null default now(),
 primary key (brand_id,remote_jid)
);
create table if not exists public.studio_telopra_messages (
 brand_id text not null check(brand_id in ('bonas','lzo')),
 message_id text not null,
 remote_jid text not null,
 sent_at timestamptz,
 from_me boolean not null default false,
 message_type text,
 text_body text,
 updated_at timestamptz not null default now(),
 primary key(brand_id,message_id),
 foreign key(brand_id,remote_jid) references public.studio_telopra_chats(brand_id,remote_jid) on delete cascade
);
create index if not exists studio_telopra_chats_activity on public.studio_telopra_chats(brand_id,last_message_at desc nulls last);
create index if not exists studio_telopra_messages_timeline on public.studio_telopra_messages(brand_id,remote_jid,sent_at desc nulls last);
alter table public.studio_telopra_status enable row level security;
alter table public.studio_telopra_chats enable row level security;
alter table public.studio_telopra_messages enable row level security;
grant select on table public.studio_telopra_status,public.studio_telopra_chats,public.studio_telopra_messages to authenticated;
revoke all on table public.studio_telopra_status,public.studio_telopra_chats,public.studio_telopra_messages from anon;
drop policy if exists "telopra status read by brand" on public.studio_telopra_status;
create policy "telopra status read by brand" on public.studio_telopra_status
 for select to authenticated using(studio_private.is_member(brand_id));
drop policy if exists "telopra chats read by brand" on public.studio_telopra_chats;
create policy "telopra chats read by brand" on public.studio_telopra_chats
 for select to authenticated using(studio_private.is_member(brand_id));
drop policy if exists "telopra messages read by brand" on public.studio_telopra_messages;
create policy "telopra messages read by brand" on public.studio_telopra_messages
 for select to authenticated using(studio_private.is_member(brand_id));

-- This RPC returns only a boolean; authorization is always derived from the verified caller.
create or replace function public.studio_telopra_allowed(p_brand text,p_action text)
returns boolean language sql stable security invoker set search_path=''
as $$
 select case when p_action='manage' then studio_private.is_manager(p_brand)
             when p_action='sync' then studio_private.can_edit(p_brand)
             when p_action='read' then studio_private.is_member(p_brand)
             else false end
$$;
revoke all on function public.studio_telopra_allowed(text,text) from public,anon;
grant execute on function public.studio_telopra_allowed(text,text) to authenticated;

-- Service-only: create or rotate an encrypted credential; never return the decrypted key.
create or replace function public.studio_telopra_configure(
 p_brand text,p_base_url text,p_instance text,p_secret text,p_actor uuid
) returns void language plpgsql security definer set search_path=''
as $$
declare sid uuid;
begin
 if p_brand not in ('bonas','lzo') or length(p_secret)<8 or length(p_secret)>2048
    or length(p_instance)<1 or length(p_instance)>128
    or length(p_base_url)>500 then
   raise exception 'Invalid connector settings';
 end if;
 select c.vault_secret_id into sid from studio_private.telopra_connectors c where c.brand_id=p_brand for update;
 if sid is null then
   select v.id into sid from vault.secrets v where v.name='zenithis-studio-telopra-'||p_brand;
 end if;
 if sid is null then
   sid:=vault.create_secret(p_secret,'zenithis-studio-telopra-'||p_brand,'TeloPra read-only instance credential');
 else
   perform vault.update_secret(sid,p_secret);
 end if;
 insert into studio_private.telopra_connectors(brand_id,base_url,instance_name,vault_secret_id,connected_by,connected_at)
 values (p_brand,p_base_url,p_instance,sid,p_actor,now())
 on conflict(brand_id) do update
 set base_url=excluded.base_url,instance_name=excluded.instance_name,vault_secret_id=excluded.vault_secret_id,
     connected_by=excluded.connected_by,connected_at=now();
 insert into public.studio_telopra_status(brand_id,provider,instance_name,connection_state,updated_at,last_error)
 values(p_brand,'evolution-api',p_instance,'connected',now(),null)
 on conflict(brand_id) do update set instance_name=excluded.instance_name,
    connection_state='connected',last_error=null,updated_at=now();
end $$;
revoke all on function public.studio_telopra_configure(text,text,text,text,uuid) from public,anon,authenticated;
grant execute on function public.studio_telopra_configure(text,text,text,text,uuid) to service_role;

-- Service-only: no connection credential is exposed to browser queries.
create or replace function public.studio_telopra_private_connection(p_brand text)
returns jsonb language sql stable security definer set search_path=''
as $$
 select jsonb_build_object('baseUrl',c.base_url,'instance',c.instance_name,'apiKey',v.decrypted_secret)
 from studio_private.telopra_connectors c
 join vault.decrypted_secrets v on v.id=c.vault_secret_id
 where c.brand_id=p_brand
$$;
revoke all on function public.studio_telopra_private_connection(text) from public,anon,authenticated;
grant execute on function public.studio_telopra_private_connection(text) to service_role;

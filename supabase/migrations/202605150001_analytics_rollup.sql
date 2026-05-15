create table if not exists public.analytics_event_cursor (
  id int primary key default 1,
  last_event_processed_at timestamptz not null default '1970-01-01 00:00:00+00',
  last_lead_processed_at timestamptz not null default '1970-01-01 00:00:00+00'
);

alter table public.analytics_event_cursor
  add column if not exists last_event_processed_at timestamptz not null default '1970-01-01 00:00:00+00';

alter table public.analytics_event_cursor
  add column if not exists last_lead_processed_at timestamptz not null default '1970-01-01 00:00:00+00';

insert into public.analytics_event_cursor (id, last_event_processed_at, last_lead_processed_at)
values (1, '1970-01-01 00:00:00+00', '1970-01-01 00:00:00+00')
on conflict (id) do nothing;

create table if not exists public.analytics_event_daily (
  day date not null,
  event_name text not null,
  event_count bigint not null default 0,
  primary key (day, event_name)
);

create table if not exists public.analytics_leads_daily (
  day date primary key,
  lead_count bigint not null default 0
);

alter table public.analytics_event_daily enable row level security;
alter table public.analytics_leads_daily enable row level security;

revoke select on public.analytics_event_daily from anon, authenticated;
revoke select on public.analytics_leads_daily from anon, authenticated;

drop policy if exists "analytics_event_daily select for service role" on public.analytics_event_daily;
create policy "analytics_event_daily select for service role"
  on public.analytics_event_daily
  for select
  to service_role
  using (true);

drop policy if exists "analytics_leads_daily select for service role" on public.analytics_leads_daily;
create policy "analytics_leads_daily select for service role"
  on public.analytics_leads_daily
  for select
  to service_role
  using (true);

create or replace function public.process_store_events()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_last_event timestamptz;
  v_last_lead timestamptz;
  v_next_event timestamptz;
  v_next_lead timestamptz;
begin
  select last_event_processed_at, last_lead_processed_at
    into v_last_event, v_last_lead
  from public.analytics_event_cursor
  where id = 1
  for update;

  if v_last_event is null then
    v_last_event := '1970-01-01 00:00:00+00'::timestamptz;
  end if;

  if v_last_lead is null then
    v_last_lead := '1970-01-01 00:00:00+00'::timestamptz;
  end if;

  with src as (
    select
      date_trunc('day', created_at)::date as day,
      event_name
    from public.store_events
    where created_at > v_last_event
  ),
  agg as (
    select day, event_name, count(*)::bigint as event_count
    from src
    group by day, event_name
  )
  insert into public.analytics_event_daily (day, event_name, event_count)
  select day, event_name, event_count
  from agg
  on conflict (day, event_name)
  do update
    set event_count = public.analytics_event_daily.event_count + excluded.event_count;

  insert into public.analytics_leads_daily (day, lead_count)
  select date_trunc('day', created_at)::date as day, count(*)::bigint as lead_count
  from public.newsletter_signups
  where created_at > v_last_lead
  group by 1
  on conflict (day)
  do update
    set lead_count = public.analytics_leads_daily.lead_count + excluded.lead_count;

  select coalesce(max(created_at), v_last_event)
    into v_next_event
  from public.store_events
  where created_at > v_last_event;

  select coalesce(max(created_at), v_last_lead)
    into v_next_lead
  from public.newsletter_signups
  where created_at > v_last_lead;

  update public.analytics_event_cursor
  set
    last_event_processed_at = greatest(v_last_event, v_next_event),
    last_lead_processed_at = greatest(v_last_lead, v_next_lead)
  where id = 1;
end;
$$;

revoke execute on function public.process_store_events() from anon, authenticated;

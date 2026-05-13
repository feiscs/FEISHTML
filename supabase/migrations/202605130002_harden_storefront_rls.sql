do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'store_events_event_name_length'
  ) then
    alter table public.store_events
      add constraint store_events_event_name_length check (char_length(event_name) between 1 and 80);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'store_events_page_path_length'
  ) then
    alter table public.store_events
      add constraint store_events_page_path_length check (page_path is null or char_length(page_path) <= 2048);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'store_events_user_agent_length'
  ) then
    alter table public.store_events
      add constraint store_events_user_agent_length check (user_agent is null or char_length(user_agent) <= 512);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'store_events_payload_is_object'
  ) then
    alter table public.store_events
      add constraint store_events_payload_is_object check (jsonb_typeof(payload) = 'object');
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'newsletter_signups_email_length'
  ) then
    alter table public.newsletter_signups
      add constraint newsletter_signups_email_length check (char_length(email) between 3 and 254);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'newsletter_signups_email_shape'
  ) then
    alter table public.newsletter_signups
      add constraint newsletter_signups_email_shape check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$');
  end if;
end $$;

alter table public.store_events enable row level security;
alter table public.newsletter_signups enable row level security;

drop policy if exists "Allow anonymous storefront event inserts" on public.store_events;
create policy "Allow anonymous storefront event inserts"
  on public.store_events
  for insert
  to anon
  with check (
    char_length(event_name) between 1 and 80
    and jsonb_typeof(payload) = 'object'
    and (page_path is null or char_length(page_path) <= 2048)
    and (user_agent is null or char_length(user_agent) <= 512)
  );

drop policy if exists "Allow anonymous newsletter inserts" on public.newsletter_signups;
create policy "Allow anonymous newsletter inserts"
  on public.newsletter_signups
  for insert
  to anon
  with check (
    source = 'forma-storefront'
    and char_length(email) between 3 and 254
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  );

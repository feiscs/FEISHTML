-- Follow-up migration: keep storefront tables insert-only for browser roles.
-- This is intentionally a new file so hosted Supabase deploy pipelines apply it
-- even when earlier migrations were already executed.

alter table public.store_events enable row level security;
alter table public.newsletter_signups enable row level security;

revoke select on public.store_events from anon, authenticated;
revoke select on public.newsletter_signups from anon, authenticated;

drop policy if exists "Allow authenticated storefront event inserts" on public.store_events;
create policy "Allow authenticated storefront event inserts"
  on public.store_events
  for insert
  to authenticated
  with check (
    char_length(event_name) between 1 and 80
    and jsonb_typeof(payload) = 'object'
    and (page_path is null or char_length(page_path) <= 2048)
    and (user_agent is null or char_length(user_agent) <= 512)
  );

drop policy if exists "Allow authenticated newsletter inserts" on public.newsletter_signups;
create policy "Allow authenticated newsletter inserts"
  on public.newsletter_signups
  for insert
  to authenticated
  with check (
    source = 'forma-storefront'
    and char_length(email) between 3 and 254
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  );

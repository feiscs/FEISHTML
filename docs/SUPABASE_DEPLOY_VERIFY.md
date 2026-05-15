# Supabase migration deploy + verification (analytics rollup)

If `analytics_event_cursor`, `analytics_event_daily`, and `analytics_leads_daily` do not appear in `public`, your local migration file exists but has not been applied to the target Supabase project yet.

## 1) Deploy migrations to the correct project

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

If you use CI, ensure the pipeline that runs `supabase db push` points to the same project ref you are checking in the dashboard.

## 2) Verify analytics tables exist

```sql
select schemaname, tablename
from pg_tables
where schemaname = 'public'
  and tablename like 'analytics_%'
order by tablename;
```

Expected:
- `analytics_event_cursor`
- `analytics_event_daily`
- `analytics_leads_daily`

## 3) Verify RLS/policies and grants

```sql
select schemaname, tablename, policyname, permissive, roles, cmd
from pg_policies
where schemaname='public'
  and tablename in ('analytics_event_daily', 'analytics_leads_daily')
order by tablename, policyname;
```

```sql
select table_schema, table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema='public'
  and table_name in ('analytics_event_daily', 'analytics_leads_daily')
  and grantee in ('anon', 'authenticated', 'service_role')
order by table_name, grantee, privilege_type;
```

## 4) Verify function and EXECUTE permissions

```sql
select n.nspname as schema, p.proname as function_name,
       p.prosecdef as security_definer,
       pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname='public'
  and p.proname='process_store_events';
```

```sql
select routine_schema, routine_name, grantee, privilege_type
from information_schema.role_routine_grants
where routine_schema='public'
  and routine_name='process_store_events'
  and grantee in ('anon', 'authenticated', 'service_role')
order by grantee;
```

## 5) Validate insert-only frontend model still holds

From browser-side anon key:
- `INSERT` into `store_events` and `newsletter_signups` should work.
- `SELECT` from those raw tables should be denied.

This aligns with the current frontend integration, which writes events/newsletter rows and does not read raw tables.

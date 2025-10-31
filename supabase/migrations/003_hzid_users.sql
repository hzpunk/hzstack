-- Users table bound to external HZid identity via hzid_user_id
create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  hzid_user_id text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_hzid_user_id_idx on public.users (hzid_user_id);

-- Row Level Security: each row accessible only to the matching hzid_sub claim
alter table public.users enable row level security;

drop policy if exists "Individuals can read own user row" on public.users;
create policy "Individuals can read own user row"
  on public.users for select
  using (hzid_user_id = current_setting('request.jwt.claims', true)::jsonb->>'hzid_sub');

drop policy if exists "Individuals can update own user row" on public.users;
create policy "Individuals can update own user row"
  on public.users for update
  using (hzid_user_id = current_setting('request.jwt.claims', true)::jsonb->>'hzid_sub');

drop policy if exists "Anyone can insert matching their hzid_sub" on public.users;
create policy "Anyone can insert matching their hzid_sub"
  on public.users for insert
  with check (hzid_user_id = current_setting('request.jwt.claims', true)::jsonb->>'hzid_sub');

-- Helpful trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- Central HZid mapping: local users table with reference to HZid (global) user id
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  hzid_user_id uuid not null unique,
  email text,
  created_at timestamptz not null default now()
);

-- RLS using custom JWT claim `hzid_sub` (populated by our token exchange)
alter table public.users enable row level security;

create policy users_select_self on public.users
  for select using (
    auth.jwt() ? 'hzid_sub'
    and (auth.jwt() ->> 'hzid_sub')::uuid = hzid_user_id
  );

create policy users_update_self on public.users
  for update using (
    auth.jwt() ? 'hzid_sub'
    and (auth.jwt() ->> 'hzid_sub')::uuid = hzid_user_id
  );



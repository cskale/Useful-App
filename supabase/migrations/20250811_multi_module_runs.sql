-- 20250811_multi_module_runs.sql
-- Parent assessment run (single, multi, or all modules)
create table if not exists public.assessment_runs (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null,
  mode text not null check (mode in ('single','multi','all')),
  selected_module_ids uuid[] not null default '{}',
  status text not null default 'in_progress',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  meta jsonb
);
create index if not exists assessment_runs_dealer_idx on public.assessment_runs(dealer_id, status);

-- Link existing module sessions to a run (create table if not exists)
create table if not exists public.assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null,
  module_id uuid not null,
  status text not null default 'in_progress',
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.assessment_sessions
  add column if not exists run_id uuid references public.assessment_runs(id) on delete cascade;

create index if not exists assessment_sessions_run_idx on public.assessment_sessions(run_id, module_id, status);

-- Per-module rollups (if not exists)
create table if not exists public.module_scores (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.assessment_sessions(id) on delete cascade,
  module_id uuid not null,
  score numeric not null,
  maturity_level text not null,
  kpi_gaps jsonb,
  benchmarks jsonb,
  created_at timestamptz not null default now(),
  unique(session_id, module_id)
);

-- Overall scores aggregated across modules in a run
create table if not exists public.run_scores (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.assessment_runs(id) on delete cascade,
  overall_score numeric not null,
  overall_maturity text not null,
  section_rollup jsonb,
  module_breakdown jsonb,
  combined_recommendations jsonb,
  benchmarks jsonb,
  created_at timestamptz not null default now(),
  unique(run_id)
);

-- RLS
alter table public.assessment_runs enable row level security;
alter table public.assessment_sessions enable row level security;
alter table public.module_scores enable row level security;
alter table public.run_scores enable row level security;

-- Simple RLS example using auth.uid() if you use user-based dealer_id.
-- Replace with your existing auth/dealer mapping as needed.
create policy if not exists "owners_select_runs"
on public.assessment_runs
for select
using (dealer_id::text = auth.uid()::text);

create policy if not exists "owners_modify_runs"
on public.assessment_runs
for all
using (dealer_id::text = auth.uid()::text)
with check (dealer_id::text = auth.uid()::text);

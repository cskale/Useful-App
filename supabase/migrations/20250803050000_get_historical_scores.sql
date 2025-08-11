-- create function to fetch historical scores for a dealership
-- optional module filtering allows querying trends for a specific module
create or replace function public.get_historical_scores(
  dealership_id uuid,
  module_slug text default null
)
returns table(
  created_at timestamptz,
  overall_score double precision
) as $$
  select a.created_at, a.overall_score
  from assessments a
  left join modules m on a.module_id = m.id
  where a.dealership_id = get_historical_scores.dealership_id
    and (
      get_historical_scores.module_slug is null
      or m.slug = get_historical_scores.module_slug
    )
  order by a.created_at;
$$ language sql stable;

-- allow anon and authenticated users to execute
grant execute on function public.get_historical_scores(uuid, text) to anon, authenticated;


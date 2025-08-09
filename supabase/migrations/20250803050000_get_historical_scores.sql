-- create function to fetch historical scores for a dealership
create or replace function public.get_historical_scores(dealership_id uuid)
returns table(
  created_at timestamptz,
  overall_score double precision
) as $$
  select created_at, overall_score
  from assessments
  where assessments.dealership_id = get_historical_scores.dealership_id
  order by created_at;
$$ language sql stable;

-- allow anon and authenticated users to execute
grant execute on function public.get_historical_scores(uuid) to anon, authenticated;


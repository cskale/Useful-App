import { ModuleScore, Maturity } from '@/types/assessment';

/**
 * Compute a weighted average score across modules and derive overall maturity.
 * Weights default to 100 when not provided or invalid.
 */
export function computeOverallScore(
  modules: ModuleScore[],
  weights: Record<string, number> = {}
): { overall_score: number; overall_maturity: Maturity } {
  let numerator = 0;
  let denominator = 0;
  for (const mod of modules) {
    const w = Math.max(1, weights[mod.module_id] ?? 100);
    numerator += mod.score * w;
    denominator += w;
  }
  const overall_score = denominator ? Math.round((numerator / denominator) * 10) / 10 : 0;
  const overall_maturity: Maturity =
    overall_score >= 85
      ? 'Advanced'
      : overall_score >= 70
        ? 'Proficient'
        : overall_score >= 55
          ? 'Emerging'
          : 'Basic';
  return { overall_score, overall_maturity };
}

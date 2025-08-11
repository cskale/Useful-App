import type { Maturity } from "@/types/assessmentRun";

export interface ModuleScore {
  module_id: string;
  score: number;
  maturity: Maturity;
}

export function computeOverallScore(
  modules: ModuleScore[],
  weights: Record<string, number> = {}
): { overall_score: number; overall_maturity: Maturity } {
  let num = 0, den = 0;
  for (const m of modules) {
    const w = Math.max(1, weights[m.module_id] ?? 100);
    num += m.score * w; den += w;
  }
  const s = den ? Math.round((num / den) * 10) / 10 : 0;
  const overall_maturity: Maturity = s >= 85 ? 'Advanced' : s >= 70 ? 'Proficient' : s >= 55 ? 'Emerging' : 'Basic';
  return { overall_score: s, overall_maturity };
}

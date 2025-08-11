import { describe, it, expect } from 'bun:test';

import { computeOverallScore } from './overall';
import type { ModuleScore } from '@/types/assessment';

describe('computeOverallScore', () => {
  it('computes a weighted average and maturity', () => {
    const modules: ModuleScore[] = [
      { module_id: 'a', score: 60, maturity: 'Basic' },
      { module_id: 'b', score: 80, maturity: 'Basic' },
    ];

    const { overall_score, overall_maturity } = computeOverallScore(modules, {
      a: 50,
      b: 100,
    });

    expect(overall_score).toBeCloseTo(73.3, 1);
    expect(overall_maturity).toBe('Proficient');
  });

  it('returns 0 and Basic when no modules provided', () => {
    const result = computeOverallScore([], {});
    expect(result.overall_score).toBe(0);
    expect(result.overall_maturity).toBe('Basic');
  });

  it('clamps invalid weights to at least 1', () => {
    const modules: ModuleScore[] = [
      { module_id: 'a', score: 100, maturity: 'Advanced' },
      { module_id: 'b', score: 0, maturity: 'Basic' },
    ];

    const { overall_score } = computeOverallScore(modules, { a: 0, b: -5 });

    expect(overall_score).toBe(50);
  });
});


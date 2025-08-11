export type RunMode = 'single' | 'multi' | 'all';

export interface AssessmentRun {
  id: string;
  dealer_id: string;
  mode: RunMode;
  selected_module_ids: string[];
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at?: string;
  meta?: Record<string, unknown>;
}

export type Maturity = 'Basic' | 'Emerging' | 'Proficient' | 'Advanced';

export interface ModuleScore {
  module_id: string;
  score: number; // 0-100
  maturity: Maturity;
}

export interface OverallScore {
  overall_score: number;
  overall_maturity: Maturity;
  module_breakdown: ModuleScore[];
}

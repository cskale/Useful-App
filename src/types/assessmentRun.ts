export type RunMode = 'single' | 'multi' | 'all';
export type Maturity = 'Basic' | 'Emerging' | 'Proficient' | 'Advanced';

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

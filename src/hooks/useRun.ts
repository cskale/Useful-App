import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RunMode } from "@/types/assessmentRun";

export interface RunSession {
  session_id: string;
  module_id: string;
  slug?: string;
}

export function useRun() {
  const [runId, setRunId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<RunSession[]>([]);

  const createRun = useCallback(async (mode: RunMode, moduleSlugs: string[], dealerId: string, moduleSlugToId: (slug: string)=>string) => {
    try {
      // Attempt server creation; if fails, fall back to local
      const moduleIds = moduleSlugs.map(moduleSlugToId);
      const { data, error } = await supabase.from("assessment_runs").insert({
        dealer_id: dealerId,
        mode,
        selected_module_ids: moduleIds,
        status: "in_progress",
        meta: { moduleSlugs }
      }).select("id").single();

      let newRunId = data?.id || crypto.randomUUID();
      if (error) {
        console.warn("Supabase createRun failed; falling back to local:", error.message);
      }
      setRunId(newRunId);
      const sess = moduleIds.map((m,i)=>({ session_id: crypto.randomUUID(), module_id: m, slug: moduleSlugs[i]}));
      setSessions(sess);
      localStorage.setItem("run_meta", JSON.stringify({ runId: newRunId, mode, sessions: sess }));
      return { run_id: newRunId, sessions: sess };
    } catch (e:any) {
      console.error(e);
      const newRunId = crypto.randomUUID();
      const sess = moduleSlugs.map(s=>({ session_id: crypto.randomUUID(), module_id: moduleSlugToId(s), slug: s }));
      setRunId(newRunId); setSessions(sess);
      localStorage.setItem("run_meta", JSON.stringify({ runId: newRunId, mode, sessions: sess }));
      return { run_id: newRunId, sessions: sess };
    }
  }, []);

  return { runId, sessions, createRun };
}

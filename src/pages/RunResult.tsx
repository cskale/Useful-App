import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { computeOverallScore } from "@/lib/rules/overall";

type ModuleScore = { module_id: string; score: number; maturity: 'Basic'|'Emerging'|'Proficient'|'Advanced'; slug?: string; title?: string; };

export default function RunResult() {
  const [modules, setModules] = useState<ModuleScore[]>([]);
  const [overall, setOverall] = useState<{score:number; maturity: ModuleScore['maturity']}|null>(null);

  useEffect(()=>{
    // Load from local storage placeholder
    const raw = localStorage.getItem("run_module_scores");
    if (raw) {
      const list: ModuleScore[] = JSON.parse(raw);
      setModules(list);
      const { overall_score, overall_maturity } = computeOverallScore(list, {});
      setOverall({ score: overall_score, maturity: overall_maturity });
    }
  },[]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Assessment Results</h1>
      {overall && (
        <Card>
          <CardHeader><CardTitle>Overall</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overall.score}</div>
            <div className="text-muted-foreground">{overall.maturity}</div>
          </CardContent>
        </Card>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {modules.map(m=>(
          <Card key={m.module_id}>
            <CardHeader><CardTitle>{m.title || m.slug}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{m.score}</div>
              <div className="text-muted-foreground">{m.maturity}</div>
              <Button className="mt-3" onClick={()=>location.assign(`/results?module=${m.slug}`)}>View details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

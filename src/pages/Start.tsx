import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { questionnaire } from "@/data/questionnaire";
import { useRun } from "@/hooks/useRun";

export default function Start() {
  const navigate = useNavigate();
  const { createRun } = useRun();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const modules = useMemo(()=> questionnaire.sections.map(s=>({ slug: s.id, title: s.title, description: s.description })), []);

  const toggle = (slug:string) => setSelected(prev=> ({...prev, [slug]: !prev[slug]}));

  const onStart = async (mode: 'single'|'multi'|'all') => {
    const dealerId = "demo-dealer"; // TODO: plug actual auth/dealer id
    const chosen = mode==='all' ? modules.map(m=>m.slug) : Object.keys(selected).filter(k=>selected[k]);
    if (chosen.length===0) return;
    const slugToId = (slug:string)=> slug; // Temporary: using slug as id until modules table is wired
    const { run_id, sessions } = await createRun(mode, chosen, dealerId, slugToId);
    // Navigate to first module
    const first = sessions[0];
    navigate(`/assessment?module=${first.slug}&run=${run_id}&session=${first.session_id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Choose Modules</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {modules.map(m=>(
          <Card key={m.slug} className="hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{m.title}</CardTitle>
              <Checkbox checked={!!selected[m.slug]} onCheckedChange={()=>toggle(m.slug)} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{m.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={()=>onStart('single')} disabled={Object.values(selected).filter(Boolean).length!==1}>Start Single</Button>
        <Button variant="secondary" onClick={()=>onStart('multi')} disabled={Object.values(selected).filter(Boolean).length<2}>Start Selected</Button>
        <Button variant="outline" onClick={()=>onStart('all')}>Start Full Diagnostic</Button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Section = { slug: string; title: string; summary: string; updated_at: string; position: number };

export default function ResourcesTeaser() {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    supabase
      .from("resources_sections")
      .select("slug,title,summary,updated_at,position")
      .order("position", { ascending: true })
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else setSections(data ?? []);
      });
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <a
        href="/resources"
        className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900
                   hover:shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-describedby="resources-desc"
      >
        📚 Resources
      </a>
      <span id="resources-desc" className="sr-only">Consulting methodology, benchmarks, scoring, FAQs</span>

      <div
        className={`absolute right-0 z-10 mt-2 w-[340px] rounded-2xl border border-gray-200 bg-white p-4 shadow-lg transition
                   ${open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"}`}
        role="dialog" aria-label="Resources preview"
      >
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Inside Resources</p>

        {err ? (
          <div className="text-xs text-red-600">{err}</div>
        ) : (
          <ul className="space-y-2 text-sm text-gray-800">
            {sections.map(s => (
              <li key={s.slug} className="flex items-start gap-2">
                <span>•</span>
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-gray-600">{s.summary}</div>
                </div>
              </li>
            ))}
            {sections.length === 0 && <li className="text-gray-500">No sections yet.</li>}
          </ul>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{sections.length} sections</span>
          <a href="/resources" className="text-indigo-600 text-sm font-semibold hover:underline">Open →</a>
        </div>
      </div>
    </div>
  );
}

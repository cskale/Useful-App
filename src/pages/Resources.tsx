import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { marked } from "marked";

type Section = { slug:string; title:string; summary:string; position:number };
type Article = { section_slug:string; heading:string; body_md:string; position:number };
type Faq = { question:string; answer_md:string; position:number };

function useSEO(title: string, description: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    const oldDesc = meta ? meta.getAttribute('content') : null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta!.setAttribute('content', description);
    return () => {
      document.title = prevTitle;
      if (meta && oldDesc !== null) meta.setAttribute('content', oldDesc);
    };
  }, [title, description]);
}

export default function ResourcesPage(){
  useSEO(
    "Resources • Methodology, Benchmarks, Scoring & FAQs",
    "Understand our consulting methodology: peer benchmarking (OEM/Brand/Size), scoring to maturity, recommendations and data privacy FAQs."
  );

  const [sections,setSections] = useState<Section[]>([]);
  const [articles,setArticles] = useState<Article[]>([]);
  const [faqs,setFaqs] = useState<Faq[]>([]);
  const [loading,setLoading] = useState(true);
  const [err,setErr] = useState<string>("");

  useEffect(()=> {
    (async ()=>{
      const [s,a,f] = await Promise.all([
        supabase.from("resources_sections").select("*").order("position", { ascending: true }),
        supabase.from("resources_articles").select("*").order("position", { ascending: true }),
        supabase.from("resources_faqs").select("*").order("position", { ascending: true }),
      ]);
      if (s.error || a.error || f.error) setErr(s.error?.message || a.error?.message || f.error?.message || "Unknown error");
      setSections(s.data ?? []);
      setArticles(a.data ?? []);
      setFaqs(f.data ?? []);
      setLoading(false);
    })();
  },[]);

  const getArticles = (slug:string)=> articles.filter(a=>a.section_slug===slug);

  if (loading) return <main className="mx-auto max-w-5xl px-4 py-10">Loading…</main>;
  if (err) return <main className="mx-auto max-w-5xl px-4 py-10 text-red-600">Error: {err}</main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
        <p className="text-gray-600 mt-1">Methodology, benchmarks, scoring, recommendations, and FAQs.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(sec => (
          <section key={sec.slug} className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold">{sec.title}</h2>
            <p className="text-gray-700 mt-2">{sec.summary}</p>

            {getArticles(sec.slug).map((a,i)=>(
              <article key={i} className="mt-4">
                <h3 className="font-medium">{a.heading}</h3>
                <div className="prose prose-sm max-w-none text-gray-800"
                     dangerouslySetInnerHTML={{ __html: marked.parse(a.body_md) as string }} />
              </article>
            ))}

            {sec.slug==="faqs" && faqs.length>0 && (
              <div className="mt-4 divide-y divide-gray-200">
                {faqs.map((f,i)=>(
                  <details key={i} className="py-2">
                    <summary className="cursor-pointer font-medium">{f.question}</summary>
                    <div className="prose prose-sm max-w-none text-gray-800 mt-2"
                         dangerouslySetInnerHTML={{ __html: marked.parse(f.answer_md) as string }} />
                  </details>
                ))}
              </div>
            )}
          </section>
        ))}

        {sections.length===0 && (
          <div className="text-gray-600">No resources yet. Add content in Supabase Studio.</div>
        )}
      </div>
    </main>
  );
}

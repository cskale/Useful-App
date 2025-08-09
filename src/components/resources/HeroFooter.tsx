import ResourcesTeaser from "./ResourcesTeaser";

export default function HeroFooter() {
  return (
    <div className="w-full border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row items-center gap-2 sm:justify-between">
        <p className="text-sm text-gray-600">Methodology • Benchmarks • Scoring • FAQs</p>
        <ResourcesTeaser />
      </div>
    </div>
  );
}

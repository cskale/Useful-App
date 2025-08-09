import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib";

interface ReportRequest {
  dealership: any;
  scores: Record<string, number>;
  answers: Record<string, any>;
  recommendations: any[];
  benchmarks?: Record<string, number>;
  assessmentType: string;
}

serve(async (req: Request) => {
  try {
    const body = (await req.json()) as ReportRequest;
    const {
      dealership,
      scores,
      answers,
      recommendations,
      benchmarks = {},
      assessmentType,
    } = body;

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const primary = rgb(0.07, 0.33, 0.55);
    const gray = rgb(0.5, 0.5, 0.5);

    const addFooter = (page: any) => {
      const { width } = page.getSize();
      page.drawText("Confidential – For internal use only", {
        x: 40,
        y: 30,
        size: 10,
        font,
        color: gray,
      });
      page.drawText("Methodology available upon request", {
        x: 40,
        y: 15,
        size: 10,
        font,
        color: gray,
      });
      page.drawText(`${pdfDoc.getPageCount()}`, {
        x: width - 40,
        y: 30,
        size: 10,
        font,
        color: gray,
      });
    };

    // Cover page
    const cover = pdfDoc.addPage();
    const { width, height } = cover.getSize();
    cover.drawText("Dealership Assessment Report", {
      x: 50,
      y: height - 80,
      size: 26,
      font,
      color: primary,
    });
    cover.drawText(dealership?.name || "Dealership", {
      x: 50,
      y: height - 120,
      size: 18,
      font,
    });
    cover.drawText(`Assessment Date: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: height - 150,
      size: 12,
      font,
    });
    cover.drawText(`OEM: ${dealership?.oem || ""}`, {
      x: 50,
      y: height - 170,
      size: 12,
      font,
    });
    cover.drawText(`Location: ${dealership?.location || ""}`, {
      x: 50,
      y: height - 190,
      size: 12,
      font,
    });
    cover.drawText("Confidential - Do not distribute", {
      x: 50,
      y: 60,
      size: 10,
      font,
      color: gray,
    });
    addFooter(cover);

    // Executive Summary
    const summary = pdfDoc.addPage();
    const summaryHeight = summary.getSize().height;
    summary.drawText("Executive Summary", {
      x: 50,
      y: summaryHeight - 80,
      size: 20,
      font,
      color: primary,
    });
    const overall =
      Object.values(scores).reduce((a, b) => a + b, 0) /
      Math.max(Object.keys(scores).length, 1);
    summary.drawText(`Overall Performance Score: ${overall.toFixed(1)}%`, {
      x: 50,
      y: summaryHeight - 110,
      size: 14,
      font,
    });
    summary.drawText("Top Recommendations:", {
      x: 50,
      y: summaryHeight - 150,
      size: 12,
      font,
    });
    recommendations.slice(0, 5).forEach((rec, i) => {
      summary.drawText(`${i + 1}. ${rec.title}`, {
        x: 70,
        y: summaryHeight - 170 - i * 20,
        size: 12,
        font,
      });
    });
    addFooter(summary);

    // Section-wise results
    Object.entries(scores).forEach(([section, score]) => {
      const page = pdfDoc.addPage();
      const h = page.getSize().height;
      page.drawText(section.replace('_', ' ').toUpperCase(), {
        x: 50,
        y: h - 80,
        size: 18,
        font,
        color: primary,
      });
      const bench = benchmarks[section] || 0;
      page.drawText(`Score: ${score}% vs Benchmark: ${bench}%`, {
        x: 50,
        y: h - 110,
        size: 12,
        font,
      });
      page.drawText("Responses:", { x: 50, y: h - 140, size: 12, font });
      Object.entries(answers)
        .filter(([q]) => q.startsWith(section))
        .forEach(([q, ans], i) => {
          page.drawText(`${q}: ${String(ans)}`, {
            x: 70,
            y: h - 160 - i * 20,
            size: 10,
            font,
          });
        });
      addFooter(page);
    });

    // KPI Dashboard
    const dashboard = pdfDoc.addPage();
    const dh = dashboard.getSize().height;
    dashboard.drawText("KPI Dashboard", {
      x: 50,
      y: dh - 80,
      size: 18,
      font,
      color: primary,
    });
    dashboard.drawText("Heatmap and trend charts would be rendered here.", {
      x: 50,
      y: dh - 110,
      size: 12,
      font,
    });
    addFooter(dashboard);

    // Appendix
    const appendix = pdfDoc.addPage();
    const ah = appendix.getSize().height;
    appendix.drawText("Appendix", {
      x: 50,
      y: ah - 80,
      size: 18,
      font,
      color: primary,
    });
    appendix.drawText(
      "Full question list, KPI formulas, and benchmarking methodology.",
      { x: 50, y: ah - 110, size: 12, font },
    );
    addFooter(appendix);

    const pdfBytes = await pdfDoc.save();
    const fileName = `${(dealership?.name || 'Dealer').replace(/\s+/g, '_')}_${assessmentType}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});

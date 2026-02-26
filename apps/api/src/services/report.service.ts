import PptxGenJS from 'pptxgenjs';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../server';
import { testSignificance } from './significance.service';

const REPORT_DIR = process.env.REPORT_DIR || './tmp/reports';

// TrackPulse brand colors
const COLORS = {
  darkBg: '080C14',
  cardBg: '1A2332',
  cyan: '00D4FF',
  amber: 'F59E0B',
  white: 'FFFFFF',
  textBody: '94A3B8',
  textMeta: '64748B',
  teal: '57B9A5',
  purple: '8B5EA6',
};

export async function generateReport(reportId: string): Promise<void> {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      brand: { include: { client: true } },
      waves: { orderBy: { fieldworkStart: 'asc' } },
    },
  });

  if (!report) return;

  await prisma.report.update({
    where: { id: reportId },
    data: { status: 'GENERATING' },
  });

  try {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'TrackPulse';
    pptx.company = 'TrackField Projects';
    pptx.subject = `${report.brand.name} Brand Health Report`;

    // Define master slide
    pptx.defineSlideMaster({
      title: 'TRACKPULSE_MASTER',
      background: { color: COLORS.darkBg },
      objects: [
        // Top line
        { rect: { x: 0, y: 0, w: '100%', h: 0.04, fill: { color: COLORS.cyan } } },
        // Footer
        {
          text: {
            text: 'TrackPulse | Powered by TrackField Projects | trackfieldprojects.com',
            options: {
              x: 0.5,
              y: 5.15,
              w: 9,
              h: 0.3,
              fontSize: 8,
              color: COLORS.textMeta,
              fontFace: 'Arial',
            },
          },
        },
      ],
    });

    // ---- TITLE SLIDE ----
    const titleSlide = pptx.addSlide({ masterName: 'TRACKPULSE_MASTER' });
    titleSlide.addText(report.brand.name.toUpperCase(), {
      x: 0.8,
      y: 1.5,
      w: 8,
      h: 1,
      fontSize: 44,
      fontFace: 'Arial',
      color: COLORS.white,
      bold: true,
    });
    titleSlide.addText('Brand Health Tracking Report', {
      x: 0.8,
      y: 2.4,
      w: 8,
      h: 0.6,
      fontSize: 24,
      fontFace: 'Arial',
      color: COLORS.cyan,
    });
    titleSlide.addText(report.waves.map((w) => w.label).join(' vs '), {
      x: 0.8,
      y: 3.1,
      w: 8,
      h: 0.5,
      fontSize: 18,
      fontFace: 'Arial',
      color: COLORS.textBody,
    });
    titleSlide.addText(`Prepared for ${report.brand.client.name}`, {
      x: 0.8,
      y: 3.7,
      w: 8,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Arial',
      color: COLORS.textMeta,
    });

    // Fetch metrics for each wave
    const latestWave = report.waves[report.waves.length - 1];
    const prevWave = report.waves.length > 1 ? report.waves[report.waves.length - 2] : null;

    const currentMetrics = await prisma.brandMetric.findMany({
      where: { brandId: report.brand.id, waveId: latestWave.id, segment: null },
    });

    const prevMetrics = prevWave
      ? await prisma.brandMetric.findMany({
          where: { brandId: report.brand.id, waveId: prevWave.id, segment: null },
        })
      : [];

    // ---- SECTION SLIDES ----
    for (const section of report.sections) {
      const slide = pptx.addSlide({ masterName: 'TRACKPULSE_MASTER' });

      // Section header bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0.04,
        w: '100%',
        h: 0.7,
        fill: { color: COLORS.cardBg },
      });

      const sectionTitle = formatSectionTitle(section);
      slide.addText(sectionTitle, {
        x: 0.5,
        y: 0.12,
        w: 9,
        h: 0.55,
        fontSize: 22,
        fontFace: 'Arial',
        color: COLORS.white,
        bold: true,
      });

      // Add metric data table
      const sectionMetrics = getMetricsForSection(section, currentMetrics, prevMetrics);
      if (sectionMetrics.length > 0) {
        const tableRows: PptxGenJS.TableRow[] = [
          [
            { text: 'Metric', options: { bold: true, color: COLORS.cyan, fontSize: 11, fill: { color: COLORS.cardBg } } },
            { text: latestWave.label, options: { bold: true, color: COLORS.cyan, fontSize: 11, fill: { color: COLORS.cardBg } } },
            { text: prevWave?.label || 'Previous', options: { bold: true, color: COLORS.cyan, fontSize: 11, fill: { color: COLORS.cardBg } } },
            { text: 'Change', options: { bold: true, color: COLORS.cyan, fontSize: 11, fill: { color: COLORS.cardBg } } },
          ],
        ];

        for (const m of sectionMetrics) {
          const prev = prevMetrics.find((p) => p.metric === m.metric);
          const sig = prev
            ? testSignificance(m.value / 100, m.baseSize, prev.value / 100, prev.baseSize)
            : null;
          const delta = prev ? m.value - prev.value : 0;
          const arrow = delta > 0 ? '▲' : delta < 0 ? '▼' : '—';
          const changeColor = sig?.significant
            ? delta > 0
              ? '22C55E'
              : 'EF4444'
            : COLORS.textBody;

          tableRows.push([
            { text: formatMetricLabel(m.metric), options: { color: COLORS.white, fontSize: 10 } },
            { text: `${m.value.toFixed(1)}%`, options: { color: COLORS.white, fontSize: 10, align: 'center' } },
            { text: prev ? `${prev.value.toFixed(1)}%` : 'N/A', options: { color: COLORS.textBody, fontSize: 10, align: 'center' } },
            { text: `${arrow} ${Math.abs(delta).toFixed(1)}pp`, options: { color: changeColor, fontSize: 10, align: 'center', bold: sig?.significant } },
          ]);
        }

        slide.addTable(tableRows, {
          x: 0.5,
          y: 1.1,
          w: 9,
          border: { type: 'solid', pt: 0.5, color: COLORS.textMeta },
          colW: [3.5, 1.8, 1.8, 1.9],
          rowH: 0.4,
          autoPage: false,
        });

        // Base size note
        slide.addText(`Base: n=${latestWave.actualN}`, {
          x: 0.5,
          y: 4.8,
          w: 4,
          h: 0.3,
          fontSize: 9,
          color: COLORS.textMeta,
          fontFace: 'Arial',
          italic: true,
        });
      }
    }

    // ---- THANK YOU SLIDE ----
    const endSlide = pptx.addSlide({ masterName: 'TRACKPULSE_MASTER' });
    endSlide.addText('Thank You', {
      x: 0.8,
      y: 1.8,
      w: 8,
      h: 1,
      fontSize: 44,
      fontFace: 'Arial',
      color: COLORS.white,
      bold: true,
      align: 'center',
    });
    endSlide.addText('trackfieldprojects.com', {
      x: 0.8,
      y: 3.0,
      w: 8,
      h: 0.5,
      fontSize: 16,
      fontFace: 'Arial',
      color: COLORS.cyan,
      align: 'center',
    });

    // Save file
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
    }

    const filePath = path.join(REPORT_DIR, `${reportId}.pptx`);
    await pptx.writeFile({ fileName: filePath });

    await prisma.report.update({
      where: { id: reportId },
      data: { status: 'COMPLETED', filePath, completedAt: new Date() },
    });
  } catch (error) {
    console.error('Report generation error:', error);
    await prisma.report.update({
      where: { id: reportId },
      data: { status: 'FAILED' },
    });
  }
}

function formatSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    executive_summary: 'Executive Summary',
    key_learnings: 'Key Learnings',
    sample_profile: 'Sample Profile',
    category_consumption: 'Category Consumption',
    brand_awareness: 'Brand Awareness',
    ad_awareness_sov: 'Advertising Awareness & Share of Voice',
    brand_consumption: 'Brand Consumption',
    place_of_purchase: 'Place of Purchase',
    brand_positioning: 'Brand Positioning',
    pricing_perception: 'Pricing Perception',
    competitive_landscape: 'Competitive Landscape',
    recommendations: 'Recommendations',
  };
  return titles[section] || section;
}

function formatMetricLabel(metric: string): string {
  const labels: Record<string, string> = {
    tom_awareness: 'Top of Mind Awareness',
    spontaneous_awareness: 'Spontaneous Awareness',
    aided_awareness: 'Aided Awareness',
    consideration: 'Consideration',
    trial: 'Trial',
    regular_use: 'Regular Use',
    consumption_30day: '30-Day Consumption',
    ad_awareness: 'Advertising Awareness',
    share_of_voice: 'Share of Voice',
    quality_perception: 'Quality Perception',
    value_perception: 'Value Perception',
    nps_proxy: 'Net Promoter Proxy',
  };
  return labels[metric] || metric;
}

interface MetricRecord {
  metric: string;
  value: number;
  baseSize: number;
}

function getMetricsForSection(
  section: string,
  currentMetrics: MetricRecord[],
  _prevMetrics: MetricRecord[],
): MetricRecord[] {
  const sectionMetricMap: Record<string, string[]> = {
    brand_awareness: ['tom_awareness', 'spontaneous_awareness', 'aided_awareness'],
    brand_consumption: ['consumption_30day', 'consideration', 'trial', 'regular_use'],
    ad_awareness_sov: ['ad_awareness', 'share_of_voice'],
    brand_positioning: ['quality_perception', 'value_perception'],
    executive_summary: ['tom_awareness', 'consumption_30day', 'ad_awareness', 'share_of_voice'],
    competitive_landscape: ['tom_awareness', 'consumption_30day', 'ad_awareness'],
  };

  const metricKeys = sectionMetricMap[section];
  if (!metricKeys) return currentMetrics;

  return currentMetrics.filter((m) => metricKeys.includes(m.metric));
}

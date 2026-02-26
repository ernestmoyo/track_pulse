import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { authenticate } from '../middleware/auth.middleware';
import { testSignificance } from '../services/significance.service';

export const metricRouter = Router();
metricRouter.use(authenticate);

// GET /api/metrics?brandId=&waveId=
metricRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { brandId, waveId, compareWaveId } = req.query;
    const where: Record<string, unknown> = {};
    if (brandId) where.brandId = brandId;
    if (waveId) where.waveId = waveId;
    where.segment = null;

    const metrics = await prisma.brandMetric.findMany({
      where,
      include: {
        wave: { select: { label: true, period: true, actualN: true } },
      },
    });

    if (compareWaveId) {
      const prevMetrics = await prisma.brandMetric.findMany({
        where: { ...where, waveId: compareWaveId as string },
      });

      const enriched = metrics.map((m) => {
        const prev = prevMetrics.find((p) => p.metric === m.metric && p.brandId === m.brandId);
        const sig = prev
          ? testSignificance(m.value / 100, m.baseSize, prev.value / 100, prev.baseSize)
          : null;
        return { ...m, significance: sig, previousValue: prev?.value ?? null };
      });

      res.json({ success: true, data: enriched });
      return;
    }

    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
});

// GET /api/metrics/trend?brandId=&metric=&waves=
metricRouter.get('/trend', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { brandId, metric, waves } = req.query;
    const waveLabels = (waves as string)?.split(',') || [];

    const waveRecords = await prisma.wave.findMany({
      where: waveLabels.length > 0 ? { label: { in: waveLabels } } : {},
      orderBy: { fieldworkStart: 'asc' },
    });

    const waveIds = waveRecords.map((w) => w.id);

    const metrics = await prisma.brandMetric.findMany({
      where: {
        brandId: brandId as string,
        metric: metric as string,
        waveId: { in: waveIds },
        segment: null,
      },
      include: { wave: { select: { label: true, period: true, actualN: true } } },
      orderBy: { wave: { fieldworkStart: 'asc' } },
    });

    // Add significance vs previous wave
    const dataPoints = metrics.map((m, i) => {
      const prev = i > 0 ? metrics[i - 1] : null;
      const sig = prev
        ? testSignificance(m.value / 100, m.baseSize, prev.value / 100, prev.baseSize)
        : null;
      return {
        waveId: m.waveId,
        waveLabel: m.wave.label,
        value: m.value,
        baseSize: m.baseSize,
        significance: sig,
      };
    });

    res.json({
      success: true,
      data: { metric, brandId, dataPoints },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/metrics/competitors?studyId=&waveId=
metricRouter.get('/competitors', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studyId, waveId } = req.query;

    const study = await prisma.study.findUnique({
      where: { id: studyId as string },
      include: { competitorBrands: { where: { isActive: true } } },
    });

    const metrics = await prisma.brandMetric.findMany({
      where: {
        waveId: waveId as string,
        segment: null,
        OR: [
          { brandId: study?.brandId },
          { competitorBrandId: { in: study?.competitorBrands.map((c) => c.id) || [] } },
        ],
      },
    });

    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
});

// GET /api/metrics/segments?waveId=&brandId=&filters[sex]=&filters[ageGroup]=
metricRouter.get('/segments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { waveId, brandId, metric } = req.query;

    const where: Record<string, unknown> = {
      waveId: waveId as string,
      brandId: brandId as string,
    };

    if (metric) {
      where.metric = metric as string;
    }

    // Get segment breakdowns
    const metrics = await prisma.brandMetric.findMany({
      where: {
        ...where,
        segment: { not: null },
      },
      orderBy: [{ segment: 'asc' }, { segmentValue: 'asc' }],
    });

    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
});

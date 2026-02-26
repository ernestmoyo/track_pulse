import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { NotFoundError } from '../utils/errors';
import { generateReport } from '../services/report.service';
import path from 'path';
import fs from 'fs';

export const reportRouter = Router();
reportRouter.use(authenticate);

const generateReportSchema = z.object({
  brandId: z.string().uuid(),
  waveIds: z.array(z.string().uuid()).min(1),
  sections: z.array(z.string()).min(1),
  format: z.enum(['pptx', 'pdf', 'both']).default('pptx'),
  clientLogo: z.string().optional(),
  clientPrimaryColor: z.string().optional(),
});

// GET /api/reports?brandId=
reportRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { brandId } = req.query;
    const where: Record<string, unknown> = {};
    if (brandId) where.brandId = brandId;

    const reports = await prisma.report.findMany({
      where,
      include: {
        brand: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        waves: { select: { id: true, label: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
});

// POST /api/reports/generate
reportRouter.post('/generate', authorize('ADMIN', 'ANALYST'), validate(generateReportSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await prisma.report.create({
      data: {
        brandId: req.body.brandId,
        format: req.body.format,
        sections: req.body.sections,
        config: req.body,
        createdById: req.user!.userId,
        waves: {
          connect: req.body.waveIds.map((id: string) => ({ id })),
        },
      },
    });

    // Async report generation
    generateReport(report.id).catch((err) => {
      console.error(`Report generation failed for ${report.id}:`, err);
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/:id/status
reportRouter.get('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      select: { id: true, status: true, filePath: true, completedAt: true },
    });
    if (!report) throw new NotFoundError('Report', req.params.id);
    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/:id/download
reportRouter.get('/:id/download', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: { brand: { select: { name: true } }, waves: { select: { label: true } } },
    });

    if (!report) throw new NotFoundError('Report', req.params.id);
    if (!report.filePath || !fs.existsSync(report.filePath)) {
      throw new NotFoundError('Report file');
    }

    const fileName = `TrackPulse_${report.brand.name}_${report.waves.map((w) => w.label).join('_')}.${report.format}`;
    res.download(path.resolve(report.filePath), fileName);
  } catch (error) {
    next(error);
  }
});

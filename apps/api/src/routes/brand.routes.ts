import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { NotFoundError } from '../utils/errors';

export const brandRouter = Router();
brandRouter.use(authenticate);

const createBrandSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  clientId: z.string().uuid(),
  logoUrl: z.string().url().optional(),
});

// GET /api/brands
brandRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.query;
    const where: Record<string, unknown> = { isActive: true };
    if (clientId) where.clientId = clientId;

    const brands = await prisma.brand.findMany({
      where,
      include: { client: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: brands });
  } catch (error) {
    next(error);
  }
});

// POST /api/brands
brandRouter.post('/', authorize('ADMIN'), validate(createBrandSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brand = await prisma.brand.create({
      data: req.body,
      include: { client: { select: { id: true, name: true } } },
    });
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
});

// GET /api/brands/:id
brandRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: req.params.id },
      include: {
        client: { select: { id: true, name: true } },
        studies: { where: { isActive: true }, include: { waves: { orderBy: { fieldworkStart: 'desc' } } } },
      },
    });
    if (!brand) throw new NotFoundError('Brand', req.params.id);
    res.json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
});

// GET /api/brands/:id/metrics
brandRouter.get('/:id/metrics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { wave, compareWave } = req.query;

    const metrics = await prisma.brandMetric.findMany({
      where: {
        brandId: req.params.id,
        waveId: wave as string,
        segment: null,
      },
      include: { wave: { select: { label: true, period: true } } },
    });

    let compareMetrics: typeof metrics = [];
    if (compareWave) {
      compareMetrics = await prisma.brandMetric.findMany({
        where: {
          brandId: req.params.id,
          waveId: compareWave as string,
          segment: null,
        },
      });
    }

    res.json({ success: true, data: { current: metrics, previous: compareMetrics } });
  } catch (error) {
    next(error);
  }
});

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { NotFoundError } from '../utils/errors';

export const studyRouter = Router();
studyRouter.use(authenticate);

const createStudySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  brandId: z.string().uuid(),
  country: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
});

// GET /api/studies
studyRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { brandId } = req.query;
    const where: Record<string, unknown> = { isActive: true };
    if (brandId) where.brandId = brandId;

    const studies = await prisma.study.findMany({
      where,
      include: {
        brand: { select: { id: true, name: true, client: { select: { id: true, name: true } } } },
        waves: { orderBy: { fieldworkStart: 'desc' }, take: 5 },
        competitorBrands: { where: { isActive: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: studies });
  } catch (error) {
    next(error);
  }
});

// POST /api/studies
studyRouter.post('/', authorize('ADMIN', 'ANALYST'), validate(createStudySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const study = await prisma.study.create({
      data: req.body,
      include: { brand: { select: { id: true, name: true } } },
    });
    res.status(201).json({ success: true, data: study });
  } catch (error) {
    next(error);
  }
});

// GET /api/studies/:id
studyRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const study = await prisma.study.findUnique({
      where: { id: req.params.id },
      include: {
        brand: { select: { id: true, name: true, client: { select: { id: true, name: true } } } },
        waves: { orderBy: { fieldworkStart: 'asc' } },
        competitorBrands: { where: { isActive: true } },
      },
    });
    if (!study) throw new NotFoundError('Study', req.params.id);
    res.json({ success: true, data: study });
  } catch (error) {
    next(error);
  }
});

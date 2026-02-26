import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { NotFoundError } from '../utils/errors';

export const clientRouter = Router();
clientRouter.use(authenticate);

const createClientSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

// GET /api/clients
clientRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const where = req.user!.role === 'CLIENT_VIEWER'
      ? { organizationId: req.user!.organizationId, isActive: true }
      : { isActive: true };

    const clients = await prisma.client.findMany({
      where,
      include: { brands: { where: { isActive: true }, select: { id: true, name: true, slug: true } } },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
});

// POST /api/clients
clientRouter.post('/', authorize('ADMIN'), validate(createClientSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await prisma.client.create({
      data: {
        ...req.body,
        organizationId: req.user!.organizationId,
      },
    });
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

// GET /api/clients/:id
clientRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: {
        brands: { where: { isActive: true } },
        organization: { select: { name: true } },
      },
    });
    if (!client) throw new NotFoundError('Client', req.params.id as string);
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

// PUT /api/clients/:id
clientRouter.put('/:id', authorize('ADMIN'), validate(createClientSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/clients/:id (soft delete)
clientRouter.delete('/:id', authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

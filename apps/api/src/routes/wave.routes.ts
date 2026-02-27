import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { NotFoundError } from '../utils/errors';
import { importWaveData } from '../services/import.service';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const waveRouter = Router();
waveRouter.use(authenticate);

const uploadDir = process.env.VERCEL === '1' ? '/tmp/uploads' : (process.env.UPLOAD_DIR || './tmp/uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch {
  // Silently continue — directory creation may fail in some serverless environments
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.csv', '.xlsx', '.xls'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  },
});

const createWaveSchema = z.object({
  label: z.string().min(1).max(50),
  studyId: z.string().uuid(),
  period: z.string().min(1),
  fieldworkStart: z.string().datetime(),
  fieldworkEnd: z.string().datetime(),
  targetN: z.number().int().positive(),
  notes: z.string().optional(),
});

// GET /api/waves
waveRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studyId } = req.query;
    const where: Record<string, unknown> = {};
    if (studyId) where.studyId = studyId;

    const waves = await prisma.wave.findMany({
      where,
      include: {
        study: { select: { id: true, name: true, brand: { select: { id: true, name: true } } } },
      },
      orderBy: { fieldworkStart: 'desc' },
    });

    res.json({ success: true, data: waves });
  } catch (error) {
    next(error);
  }
});

// POST /api/waves
waveRouter.post('/', authorize('ADMIN', 'ANALYST'), validate(createWaveSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wave = await prisma.wave.create({
      data: {
        ...req.body,
        fieldworkStart: new Date(req.body.fieldworkStart),
        fieldworkEnd: new Date(req.body.fieldworkEnd),
      },
    });
    res.status(201).json({ success: true, data: wave });
  } catch (error) {
    next(error);
  }
});

// GET /api/waves/:id
waveRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wave = await prisma.wave.findUnique({
      where: { id: req.params.id },
      include: {
        study: { select: { id: true, name: true, brand: { select: { id: true, name: true } } } },
        survey: { include: { questions: { include: { options: true }, orderBy: { orderNum: 'asc' } } } },
        _count: { select: { respondents: true } },
      },
    });
    if (!wave) throw new NotFoundError('Wave', req.params.id);
    res.json({ success: true, data: wave });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/waves/:id/status
waveRouter.patch('/:id/status', authorize('ADMIN', 'ANALYST'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const wave = await prisma.wave.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ success: true, data: wave });
  } catch (error) {
    next(error);
  }
});

// POST /api/waves/:id/upload-data
waveRouter.post('/:id/upload-data', authorize('ADMIN', 'ANALYST'), upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file uploaded' } });
      return;
    }

    const result = await importWaveData(req.params.id, req.file.path);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/waves/:id/process
waveRouter.post('/:id/process', authorize('ADMIN', 'ANALYST'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wave = await prisma.wave.findUnique({ where: { id: req.params.id } });
    if (!wave) throw new NotFoundError('Wave', req.params.id);

    await prisma.wave.update({
      where: { id: req.params.id },
      data: { status: 'PROCESSING' },
    });

    res.json({ success: true, data: { message: 'Processing started', waveId: req.params.id } });
  } catch (error) {
    next(error);
  }
});

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { NotFoundError } from '../utils/errors';

export const surveyRouter = Router();
surveyRouter.use(authenticate);

const createSurveySchema = z.object({
  waveId: z.string().uuid(),
  title: z.string().min(1),
});

const updateQuestionsSchema = z.object({
  questions: z.array(z.object({
    id: z.string().uuid().optional(),
    text: z.string().min(1),
    type: z.enum(['SINGLE_CHOICE', 'MULTI_CHOICE', 'SCALE', 'OPEN_TEXT', 'RANKING']),
    orderNum: z.number().int().min(0),
    isRequired: z.boolean().default(true),
    options: z.array(z.object({
      id: z.string().uuid().optional(),
      text: z.string().min(1),
      value: z.string().min(1),
      orderNum: z.number().int().min(0),
    })).optional(),
  })),
});

// GET /api/surveys/:waveId
surveyRouter.get('/:waveId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const survey = await prisma.survey.findUnique({
      where: { waveId: req.params.waveId },
      include: {
        questions: {
          include: { options: { orderBy: { orderNum: 'asc' } } },
          orderBy: { orderNum: 'asc' },
        },
      },
    });
    if (!survey) throw new NotFoundError('Survey');
    res.json({ success: true, data: survey });
  } catch (error) {
    next(error);
  }
});

// POST /api/surveys
surveyRouter.post('/', authorize('ADMIN', 'ANALYST'), validate(createSurveySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const survey = await prisma.survey.create({ data: req.body });
    res.status(201).json({ success: true, data: survey });
  } catch (error) {
    next(error);
  }
});

// PUT /api/surveys/:id/questions
surveyRouter.put('/:id/questions', authorize('ADMIN', 'ANALYST'), validate(updateQuestionsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const survey = await prisma.survey.findUnique({ where: { id: req.params.id } });
    if (!survey) throw new NotFoundError('Survey', req.params.id);

    // Delete existing questions and recreate
    await prisma.questionOption.deleteMany({
      where: { question: { surveyId: req.params.id } },
    });
    await prisma.question.deleteMany({ where: { surveyId: req.params.id } });

    // Create new questions with options
    for (const q of req.body.questions) {
      await prisma.question.create({
        data: {
          surveyId: req.params.id,
          text: q.text,
          type: q.type,
          orderNum: q.orderNum,
          isRequired: q.isRequired,
          options: {
            create: (q.options || []).map((o: { text: string; value: string; orderNum: number }) => ({
              text: o.text,
              value: o.value,
              orderNum: o.orderNum,
            })),
          },
        },
      });
    }

    await prisma.survey.update({
      where: { id: req.params.id },
      data: { version: { increment: 1 } },
    });

    res.json({ success: true, data: { message: 'Questions updated' } });
  } catch (error) {
    next(error);
  }
});

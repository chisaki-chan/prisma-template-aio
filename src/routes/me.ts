import { authenticateJWT } from '@/middlewares/bearerToken';
import { ExtendedRequest } from '@/types/auth';
import type { Response } from 'express';

export const get = [
  authenticateJWT,
  async (req: ExtendedRequest, res: Response) => {
    res.json({ data: req.user });
  },
];

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { User } from '../models/User';
import { Conversion } from '../models/Conversion';
import { asyncH } from '../utils/async';
import { HttpError } from '../errors/HttpError';

const router = Router();

router.get('/me', requireAuth, asyncH(async (req, res) => {
  const user = await User.findById(req.user!.userId).select('-passwordHash');
  if (!user) throw new HttpError(404, 'User not found');
  res.json(user);
}));

router.get('/history', requireAuth, asyncH(async (req, res) => {
  const items = await Conversion.find({ userId: req.user!.userId })
    .sort({ createdAt: -1 })
    .limit(200);
  res.json(items);
}));

export default router;

import { Router } from 'express';
import { User } from '../models/User';
import { Conversion } from '../models/Conversion';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { asyncH } from '../utils/async';

const router = Router();
router.use(requireAuth, requireAdmin);

router.get('/users', asyncH(async (_req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
}));

router.get('/user-history/:userId', asyncH(async (req, res) => {
  const history = await Conversion.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(history);
}));

export default router;
